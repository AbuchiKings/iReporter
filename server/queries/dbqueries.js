
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

    getIncidentsByType(type) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE type = $1`,
            values: [type]
        })
    },

    getIncidentsByStatus(status) {
        return ({
            text: `SELECT * FROM myireportdb.incidents WHERE status = 1`,
            values: [status]
        })
    },

    createIncident(newIncident, user) {
        return ({
            text: `INSERT INTO myireportdb.incidents (title, createdby, type, location, comment, status)
            VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [
                newIncident.title,
                user.id,
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

    getUserById(id) {
        return ({
            text: `SELECT * FROM myireportdb.users WHERE id = $1`,
            values: [id]
        })
    },

    regUser(firstName, lastName, otherNames, email, phoneNumber, userName, hashpassword, isAdmin) {
        return ({
            text: `INSERT INTO myireportdb.users (first_name, last_name, other_names, 
                email, phone_number, user_name, password, is_admin)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,

            values: [
                firstName,
                lastName,
                otherNames,
                email,
                phoneNumber,
                userName,
                hashpassword,
                isAdmin
            ]
        })
    },

    getAllUsers() {
        return ({
            text: `SELECT * FROM myireportdb.users`,
            values: []
        })
    },

    getUserByEmail(email) {
        return ({
            text: `SELECT * FROM myireportdb.users WHERE email = $1`,
            values: [email]
        })
    },

    getUserByUserName(userName) {
        return ({
            text: `SELECT * FROM myireportdb.users WHERE LOWER(user_name) = $1`,
            values: [userName]

        })
    },

    getUserByPhone(phoneNumber) {
        return ({
            text: `SELECT * FROM myireportdb.users WHERE phone_number = $1`,
            values: [phoneNumber]

        })
    },

    updateUserEmail(email, userId) {
        return ({
            text: `UPDATE myireportdb.users SET
            email = COALESCE($1, email) WHERE id = $2 RETURNING *`,
            values: [email, userId]
        })
    },

    updateUserPassword(hashNewPassword, userId) {
        return ({
            text: `UPDATE myireportdb.users SET
            password = COALESCE($1, password) WHERE id = $2 RETURNING *`,
            values: [hashNewPassword, userId]
        })
    },

    updateUser(email, phoneNumber, userName, userId) {
        return ({
            text: `UPDATE myireportdb.users SET
            email = COALESCE($1, email),
            phone_number = COALESCE($2, phone_number),
            user_name = COALESCE($4, user_name) 
            WHERE id = $5 RETURNING *`,
            values: [email, phoneNumber, userName, userId]
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

