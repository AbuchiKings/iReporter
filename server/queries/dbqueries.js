
const query = {
    getIncident(id) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE incidentid = $1`,
            values: [id]
        })
    },

    getUserIncidents(userId) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE createdby = $1`,
            values: [userId]
        })
    },

    getUserIncident(userId, id) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE createdby = $1 AND incidentid = $2`,
            values: [userId, id]
        })
    },

    getAllIncidents() {
        return ({
            text: `SELECT * FROM myireportdb.incidents`,
            values: []
        })
    },
    getAllUserIncidents(id) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE createdby = $1`,
            values: [id]
        })
    },
    getUserIncidentsByType(id, type) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE createdby = $1 AND type = $2`,
            values: [id, type]
        })
    },
    getUserIncidentsByStatus(id, status) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE createdby = $1 AND status = $2`,
            values: [id, status]
        })
    },

    getIncidentsByType(type) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE type = $1`,
            values: [type]
        })
    },

    getIncidentsByStatus(status) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE status = $1`,
            values: [status]
        })
    },

    createIncident(newIncident, user) {
        return ({
            text: `INSERT INTO myireportdb.incidents (title, createdby, type, location, comment, status)
            VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [
                newIncident.title,
                newIncident.createdby,
                newIncident.type,
                newIncident.location,
                newIncident.comment,
                newIncident.status
            ]
        })
    },
    updateIncident(id, incidentUpdate) {
        return ({
            text: `UPDATE myireportdb.incidents SET
            type = COALESCE($1, type),
            location = COALESCE ($2, location),
            comment = COALESCE ($3, comment)
            WHERE incidentid = $4  
            RETURNING *`,
            values: [
                incidentUpdate.type,
                incidentUpdate.location,
                incidentUpdate.comment,
                id
            ]
        })
    },
    updateIncidentStatus(id, incidentUpdate) {
        return ({
            text: `UPDATE myireportdb.incidents SET
            status = COALESCE($1, status)
            WHERE incidentid = $2 
            RETURNING *`,
            values: [
                incidentUpdate.status,
                id
            ]

        })
    },
    deleteIncident(id) {
        return ({
            text: `DELETE FROM myireportdb.incidents WHERE incidentid = $1
            RETURNING *`,
            values: [id]

        })
    },

    regUser(firstname, lastname, email, phoneNumber, username, hashpassword, isAdmin, registered) {
        return ({
            text: `INSERT INTO myireportdb.users (firstname, lastname, 
                email, phone_number, username, password, is_admin, registered)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING firstname, lastname, email, phone_number, username, is_admin, registered`,

            values: [
                firstname, lastname, email, phoneNumber, username, hashpassword, isAdmin, registered
            ]
        })
    },

    getAllUsers() {
        return ({
            text: `SELECT id, firstname, lastname, email, registered, is_admin FROM myireportdb.users`,
            values: []
        })
    },
    getAllusernames() {
        return ({
            text: `SELECT username, id FROM myireportdb.users
            ORDER BY username ASC`,
            values: []
        })
    },

    getUserByValue(selector, field, fields) {
        return ({
            text: `SELECT ${fields} FROM myireportdb.users WHERE ${field} = $1;`,
            values: [selector]
        })
    },

    updateUserEmail(email, userId) {
        return ({
            text: `UPDATE myireportdb.users SET
            email = COALESCE($1, email) WHERE id = $2 RETURNING `,
            values: [email, userId]
        })
    },

    updateUserPassword(hashedPassword, oldPassword, resetExpires, resetCode, token) {
        return ({
            text: `UPDATE myireportdb.users SET
            password =$1,
            old_password = $2,
            reset_expires = $3, 
            reset_code = $4 
            WHERE reset_code = $5 RETURNING *`,
            values: [hashedPassword, oldPassword, resetExpires, resetCode, token]
        })
    },

    updateUser(email, phoneNumber, username, firstname, lastname, userId) {
        return ({
            text: `UPDATE myireportdb.users SET
            email = COALESCE($1, email),
            phone_number = COALESCE($2, phone_number),
            username = COALESCE($3, username), 
            firstname = COALESCE($4, firstname), 
            lastname = COALESCE($5, lastname) 
            WHERE id = $6 RETURNING firstname, lastname, email, phone_number, username, is_admin, registered, id`,
            values: [email, phoneNumber, username, firstname, lastname, userId]
        })
    },

    saveResetCode(reset_code, reset_expires, email) {
        return ({
            text: `UPDATE myireportdb.users SET
            reset_code = $1,
            reset_expires = $2
            WHERE email = $3`,
            values: [reset_code, reset_expires, email]
        })
    },

    updateUserImage(imageId, imageUrl, userId) {
        return ({
            text: `UPDATE myireportdb.users SET
            image = COALESCE($1, image),
            image_id = COALESCE($2, image_id)
            WHERE id = $3 RETURNING *`,
            values: [imageUrl, imageId, userId]
        })
    },

    getUserReportsCount(status, userId) {
        return ({
            text: `SELECT COUNT(*) FROM myireportdb.incidents WHERE createdby = $1 AND status = $2`,
            values: [userId, status]
        })
    },

    deleteUser(userId) {
        return ({
            text: `DELETE FROM myireportdb.users WHERE id = $1 RETURNING *`,
            values: [userId]
        })
    }

};

module.exports = query;

