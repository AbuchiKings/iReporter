import 'babel-polyfill'
import query from '../queries/dbqueries'
import pool from '../queries/pool'

class IncidentHelper {

    static async create(data, user) {
        try {
            if (user.is_admin) return 'notAllowed';
            data.status = 'Pending';

            const { rows } = await pool.query(query.createIncident(data, user));
            return rows[0];

        } catch (error) {
            console.log(error);
        }

    }

    static async findOne(req) {
        try {
            const id = parseInt(req.params.id, 10)
            const isAdmin = req.user.is_admin;

            const { rows } = await pool.query(query.getIncident(id));
            // if (!rows[0]) return 404;

            if (isAdmin) return rows[0];

            const createdBy = rows[0].createdby;
            const userId = req.user.id;

            return (createdBy === userId ? rows[0] : 'noIncidentWithId');
        } catch (error) {
            console.log(error);
        }
    }

    static async findAll(req) {
        try {
            const isAdmin = req.user.is_admin;
            if (isAdmin) {
                const { rows, rowCount } = await pool.query(query.getAllIncidents())
                if (rowCount < 1) return 404;
                return rows;
            }

            const userId = req.user.id;
            const { rows, rowCount } = await pool.query(query.getUserIncidents(userId))
            if (rowCount < 1) return 404;
            return rows;

        } catch (error) {
            console.log(error);
        }
    }

    static async updateIncident(req) {
        try {
            const isAdmin = req.user.is_admin;
            if (isAdmin) return 405;
            
            const id = parseInt(req.params.id, 10);
            const { rows } = await pool.query(query.getIncident(id));
            if (!rows[0]) return 404;

            const createdBy = rows[0].createdby;
            const status = rows[0].status;
            const userId = req.user.id;
            if (createdBy !== userId || status !== 'Pending') return 405;

            const data = req.body
            const result = await pool.query(query.updateIncident(id, data));
            return result.rows[0];

        } catch (error) {
            console.log(error);
        }

    }

    static async updateStatus(id, data) {
        try {
            const { rows } = await pool.query(query.getIncident(id));
            if (!rows[0]) return 404;
            const result = await pool.query(query.updateIncidentStatus(id, data));
            return result.rows[0];
        } catch (error) {
            console.log(error);
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