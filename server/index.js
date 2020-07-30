import express from 'express';
import router from './routes/router.js';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import cookieParser from 'cookie-parser';
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.use(express.json());
app.use(helmet());

app.use(router);
app.use(express.static(path.join(__dirname, '../UI')))

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({ status: err.status, message: err.message });
  next();
});

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});

process.on('uncaughtException', function(err) {
  console.log(err);
  process.exit(1);
})

export default app;

// var cluster = require('cluster');

// var numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   for (var i = 0; i < numCPUs; ++i) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   var http = require('http');
//   var httpServer = http.createServer(app).listen(httpPort, function () {
//       console.log('process id local', process.pid)
//       console.log("http server started at port " + httpPort);
//   });
// }

// process.on('uncaughtException', function (err) {
//   console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
//   console.error(err.stack)
//   process.exit(1)
// })