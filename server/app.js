import express from 'express';
import router from './routes/router.js';
//import IncidentController from './controller/incidentController';
//import incidents from './models/incidents'

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});

export default app;