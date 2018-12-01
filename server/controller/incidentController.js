import IncidentHelper from '../helper/incidentHelper';
import validator from '../middleware/inputValidation';
import { runInNewContext } from 'vm';

class IncidentController {

 static createIncident(req, res) {
    const newIncident = IncidentHelper.create(req.body);
    return res.status(201).json({
      status: 201,
      data: [
        {
          id: newIncident.id,
          message: "Created red-flag record",
          newIncident
        }
      ]
    });
  }

  static get0ne(req, res) {
    const id = parseInt(req.params.id, 10)
    const incident = IncidentHelper.findOne(id);
    if (!incident) {
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
  }

  static getAll(req, res) {
    const incidents = IncidentHelper.findAll();
    return res.status(200).send({
      'status': 200,
      'data': incidents
    });
  }

  static update(req, res) {
    const id = parseInt(req.params.id, 10)
    const incident = IncidentHelper.findOne(id);
    if (!incident) {
      res.status(404).json({ status: 404, error: "Incident not found" });
      return;
    }
    const updatedIncident = IncidentHelper.updateIncident(req.params.id, req.body);
    res.status(200).json({
      status: 200,
      data: [
        {
          id: updatedIncident.id,
          message: "updated red-flag record's comment"
        }
      ]
    });
  }

  static updateLocation(req, res) {
    const incident = IncidentHelper.findOne(req.params.id);
    if (!incident) {
      res.status(404).json({ status: 404, error: "Incident not found" });
      return;
    }
    const updatedIncident = IncidentHelper.updateLocation(req.params.id, req.body);
    res.status(200).json({
      status: 200,
      data: [
        {
          id: updatedIncident.id,
          message: "Updated red-flag record's location"
        }
      ]
    });
  }

  static deleteIncident(req, res) {
    const id = parseInt(req.params.id, 10);
    const incident = IncidentHelper.findOne(id);
   if (!incident) {
      res.status(404).json({ status: 404, error: "Incident not found" });
      return;
    }
    const deletedIncident = IncidentHelper.delete(req.params.id);
    res.json({
      status: 204,
      data: [
        {
          id: id,
          message: "red-flag record has been deleted"
        }
      ]
    });
  }
}

export default IncidentController;