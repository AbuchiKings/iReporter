
const query = {
    getIncident(id) {
        return ({
            text: `SELECT * FROM incidents WHERE incidentid = $1`,
            values: [id]
        })
    },
    getAllIncidents() {
        return ({
            text: `SELECT * FROM incidents`,
            values: []
        })
    },

    getIncidentsByType(type) {
        return ({
            text: `SELECT * FROM incidents WHERE type = $1`,
            values: [type]
        })
    },

    getIncidentsByStatus(status) {
        return ({
            text: `SELECT * FROM incidents WHERE status = 1`,
            values: [status]
        })
    },

    createIncident(newIncident) {
        return ({
            text: `INSERT INTO incidents (createdby, type, location, comment, status)
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [
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
            text: `UPDATE incidents SET
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
            text: `UPDATE incidents SET
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
            text: `DELETE FROM incidents WHERE incidentid = $1
            RETURNING *`,
            values: [id]

        })
    },

    getUserById(id) {
        return ({
            text: `SELECT * FROM users WHERE id = $1`,
            values: [id]
        })
    },

    regUser(firstName, lastName, otherNames, email, phoneNumber, userName, hashedpassword) {
        return ({
            text: `INSERT INTO users (first_name, last_name, other_names, 
                email, phone_number, user_name, password)
                VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,

            values: [
                firstName,
                lastName,
                otherNames,
                email,
                phoneNumber,
                userName,
                hashedpassword]
        })
    },

    getAllUsers() {
        return ({
            text: `SELECT * FROM users`,
            values: []
        })
    },

    getUserByEmail(email) {
        return ({
            text: `SELECT * FROM users WHERE email = $1`,
            values: [email]
        })
    },

    getUserByUserName(userName) {
        return ({
            text: `SELECT * FROM users WHERE LOWER(user_name) = $1`,
            values: [userName]

        })
    },

    getUserByPhone(phoneNumber) {
        return ({
            text: `SELECT * FROM users WHERE phone_number = $1`,
            values: [phoneNumber]

        })
    },

    updateUserEmail(email, userId) {
        return ({
            text: `UPDATE users SET
            email = COALESCE($1, email) WHERE id = $2`,
            values: [email, userId]
        })
    },
    updateUserPassword(newHashedPassword, userId) {
        return ({
            text: `UPDATE users SET
            password = COALESCE($1, password) WHERE id = $2`,
            values: [newHashedPassword, userId]
        })
    },
    updateUser(email, phoneNumber, userName, userId) {
        return ({
            text: `UPDATE users SET
            email = COALESCE($1, email),
            phone_number = COALESCE($2, phone_number),
            user_name = COALESCE($4, user_name) 
            WHERE id = $5 RETURNING *`,
            values: [email, phoneNumber, userName, userId]
        })
    },

    getUserReportsCount(status, userId) {
        return ({
            text: `SELECT COUNT(*) FROM incidents WHERE createdby = $1 AND status = $2`,
            values: [userId, status]
        })
    },

    getUserIncidents(userId) {
        return ({
            text: `SELECT * FROM incidents WHERE createdby = $1`,
            values: [userId]
        })
    },

  
    getOne(id) {
        return ({

        })
    },

    deleteUser(userId) {
        return ({
            text: `DELETE FROM users WHERE id = $1`,
            values: [userId]
        })
    }

};

export default query;

