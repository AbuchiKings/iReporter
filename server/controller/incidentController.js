import IncidentHelper from '../helper/incidentHelper';

class IncidentController {

  static async createIncident(req, res) {
    try {
      const result = await IncidentHelper.create(req.body, req.user);
      if (result === 'notAllowed') return res.status(403).json({
        status: 403,
        message: 'Creation of incident by an admin user is not allowed'
      })
      return res.status(201).json({
        status: 201,
        data: [result]
      });
    } catch (error) {
      console.log(error);
    }

  }

  static async get0ne(req, res) {
    try {
      const incident = await IncidentHelper.findOne(req);

      if (incident === 404) {
        return res.status(404).json({
          status: 404,
          error: "Incident not found"
        });

      } else if (incident === 'noIncidentWithId') {
        return res.status(405).json({
          status: 405,
          error: "You can only view reports created by you"
        });
      }

      return res.status(200).json({
        status: 200,
        data: [incident]
      });

    } catch (error) {
      console.log(error);
    }
  }

  static async getAll(req, res) {
    try {
      const incidents = await IncidentHelper.findAll(req);
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
      console.log(error);
    }
  }

  static async updateIncident(req, res) {
    try {
      const result = await IncidentHelper.updateIncident(req);
      if (result === 404) {
        return res.status(404).json({
          status: 404,
          error: "Incident not found"
        });
        
      } else if(result === 405){
        return res.status(405).json({
          status: 405,
          error: "You are not allowed to update this incident"
        });
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

    }
  }

  static async deleteIncident(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      await IncidentHelper.deleteIncident(id);
      if (result === 404) {
        res.status(404).json({
          status: 404,
          error: "Incident not found"
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