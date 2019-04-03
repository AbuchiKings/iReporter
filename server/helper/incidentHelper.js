import 'babel-polyfill'
import query from '../queries/dbqueries'
import pool from '../queries/pool'

class IncidentHelper {

    static async create(data) {
        try {
            const { rows } = await pool.query(query.createIncident(data));
            return rows[0];
        } catch (error) {
            return error;
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

    static findAll() {

    }

    static updateIncident(incident, data) {

    }

    static updateLocation(incident, data) {

    }

    static delete(id) {

    }

}

export default IncidentHelper;