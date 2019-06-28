import 'babel-polyfill'
import query from '../queries/dbqueries'
import pool from '../queries/pool'
import mailer from './mailer'

class IncidentHelper {

    static async create(data) {
        try {
            const { rows } = await pool.query(query.createIncident(data));
            return rows[0];
        } catch (error) {
            console.log(error);
        }

    }

    static async findOne(id) {
        try {

            const { rows } = await pool.query(query.getIncident(id));
            if (!rows[0]) return 404;
            return rows[0];

        } catch (error) {
            return error;
        }
    }

    static async findAll(req) {
        try {
            const isAdmin = req.user.is_admin;
            const id = req.user.id;
            let result, reports;
            const userId = req.query.userId;
            const status = req.query.status;
            const type = req.query.type;
            const queryString = userId || status || type;

            if (isAdmin) {
                switch (queryString) {
                    case undefined: result = await pool.query(query.getAllIncidents());
                        break;
                    case userId: result = await pool.query(query.getAllUserIncidents(Number(userId)));
                        break;
                    case status: result = await pool.query(query.getIncidentsByStatus(status))
                        break;
                    case type: result = await pool.query(query.getIncidentsByType(type))
                        break;
                }

            } else if (!isAdmin) {
                switch (queryString) {
                    case undefined: result = await pool.query(query.getAllUserIncidents(id));
                        break;
                    case status: result = await pool.query(query.getUserIncidentsByStatus(id, status))
                        break;
                    case type: result = await pool.query(query.getUserIncidentsByType(id, type))
                        break;
                }
            }
            if (result.rowCount < 1) return 404;
            reports = result.rows;
            return reports;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateIncident(id, data) {
        try {
            const { rows } = await pool.query(query.getIncident(id));
            if (!rows[0]) return 404;
            const result = await pool.query(query.updateIncident(id, data));
            return result.rows[0];
        } catch (error) {

        }

    }

    static async updateStatus(id, data) {
        try {
            const { rows } = await pool.query(query.getIncident(id));
            if (!rows[0]) return 404;
            const result = await pool.query(query.updateIncidentStatus(id, data));
            const check = ()=>{
                return result.rows[0].status === 'Resolved' || result.rows[0].status === 'Rejected';
            }
            const to = 'abuchikings@hotmail.com';
            const subject = 'Report status';
            const message = `Your report with the id: ${id} 
            ${check ? 'has been ' + result.rows[0].status : 'is under investigation'}`;
            mailer.mail(to, subject, message);
            return result.rows[0];
        } catch (error) {

        }

    }

    static async deleteIncident(id) {
        try {
            const { rows } = await pool.query(query.getIncident(id));
            if (!rows[0]) return 404;
            await pool.query(query.deleteIncident(id));
            return;
        } catch (error) {
            console.log(error);
        }

    }

}

export default IncidentHelper;