
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
    createIncident(newIncident) {
        return ({
            text: `INSERT INTO incidents (createdby, type, location, comment)
            VALUES($1, $2, $3, $4) RETURNING *`,
            values: [
                newIncident.createdby,
                newIncident.type,
                newIncident.location,
                newIncident.comment
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
            text:`UPDATE incidents SET
            status = $1
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
            title: `DELETE FROM incidents WHERE incidentid = $1`,
            values: [id]

        })
    },
    getOne(id) {
        return ({

        })
    }

};

export default query;

