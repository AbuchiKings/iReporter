import IncidentHelper from '../helper/incidentHelper';

class IncidentController {

  static async createIncident(req, res) {
    try {
      const result = await IncidentHelper.create(req.body);
      return res.status(201).json({
        status: 201,
        data: [result],
        message: 'Report was submitted successfully'
      });
    } catch (error) {
      console.log(error);
    }

  }

  static async getOne(req, res) {
    try {
      const id = parseInt(req.params.id, 10)
      const incident = await IncidentHelper.findOne(id);
      if (incident === 404) {
        res.status(404).json({
          status: 404,
          message: "Incident not found"
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
      const incidents = await IncidentHelper.findAll(req);
      if (incidents === 404) {
        res.status(404).json({
          status: 404,
          message: "No incident report found"
        });
        return;
      }
      return res.status(200).json({
        status: 200,
        data: [incidents]
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateIncident(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await IncidentHelper.updateIncident(id, req.body);
      if (result === 404) {
        res.status(404).json({
          status: 404,
          message: "Incident not found"
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
          message: "Incident not found"
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

  static async deleteIncident(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      await IncidentHelper.deleteIncident(id);
      if (result === 404) {
        res.status(404).json({
          status: 404,
          message: "Incident not found"
        });
        return;
      }
      return res.send({
        status: 204,
        message: 'Incident deleted'
      });
    } catch (error) {
      return error;
    }

  }

  static updateLocation(req, res) {

  }
}

export default IncidentController;