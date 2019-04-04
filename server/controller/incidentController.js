import IncidentHelper from '../helper/incidentHelper';

class IncidentController {

  static async createIncident(req, res) {
    try {
      const result = await IncidentHelper.create(req.body);
      return res.status(201).json({
        status: 201,
        data: [result]
      });
    } catch (error) {
      return error;
    }

  }

  static async get0ne(req, res) {
    try {
      const id = parseInt(req.params.id, 10)
      const incident = await IncidentHelper.findOne(id);
      if (incident === 404) {
        res.status(404).json({
          status: 404,
          error: "Incident not found"
        });
        return;
      }
      return res.status(200).json({
        status: 200,
        data: [incident]
      });
    } catch (error) {
      return error
    }
  }

  static async getAll(req, res) {
    try {
      const incidents = await IncidentHelper.findAll();
      if (incidents === 404) {
        res.status(404).json({
          status: 404,
          error: "You have not created any incident"
        });
        return;
      }
      return res.status(200).json({
        status: 200,
        data: [incidents]
      });
    } catch (error) {

    }
  }

  static async updateIncident(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await IncidentHelper.updateIncident(id, req.body);
      if (result === 404) {
        res.status(404).json({
          status: 404,
          error: "Incident not found"
        });
        return;
      }
      return res.status(200).json({
        status: 200,
        data: [result]
      });
    } catch (error) {

    }
  }

  static async updateIncidentStaus(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await IncidentHelper.updateStatus(id, req.body);
      if (result === 404) {
        res.status(404).json({
          status: 404,
          error: "Incident not found"
        });
        return;
      }
      return res.status(200).json({
        status: 200,
        data: [result]
      });
    } catch (error) {  
console.log(error);
    }
  }

  static updateLocation(req, res) {

  }

  static deleteIncident(req, res) {

  }
}

export default IncidentController;