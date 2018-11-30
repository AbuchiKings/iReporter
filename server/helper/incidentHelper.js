import incidents from '../models/incidents'

class IncidentHelper {
    static create(data) {
        const newIncident = {
            id: incidents.length + 1,
            createdOn: new Date(),
            createdBy: data.username,
            type: data.type,
            location: data.location,
            status: data.status,
            comment: data.comment
        };
        incidents.push(newIncident);
        return newIncident;
    }

    static findOne(id) {
        return incidents.find(incident => incident.id === id);
    }

    static findAll() {
        return incidents;
    }

    static update(id, data) {
        const incident = incidents.find(incident => incident.id === id);
        const index = incidents.indexOf(incident);
        incidents[index].comment = data.comment || incident.comment;
        incidents[index].modifiedDate = new Date();
        return incidents[index];
    }

    static updateLocation(id, data) {
        const incident = incidents.find(incident => incident.id === id);
        const index = incidents.indexOf(incident);
        incidents[index].location = data.location || incident.location;
        incidents[index].modifiedDate = new Date();
        return incidents[index];
    }

    static delete(id) {
        const incident = incidents.find(incident => incident.id === id);
        const index = incidents.indexOf(incident);
        const erasedIncident = incidents.splice(index, 1);
        return erasedIncident;
    }

}

export default IncidentHelper;