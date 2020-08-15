import express from 'express';
import router from './routes/router.js';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import http from 'http'
import sanitizeNosqlQuery from 'express-mongo-sanitize';
import rateLimiter from 'express-rate-limit';
import cookieParser from 'cookie-parser';
//import preventCrossSiteScripting from 'xss-clean';
import preventParameterPollution from 'hpp';
import compression from 'compression';
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.options('*', cors());

app.use(helmet());
app.use('/api', rateLimiter({
    max: 200,
    windowMs: 1000 * 60 * 60,
    message: 'Too many requests from this IP. Try again in an hour.'
}));

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use(sanitizeNosqlQuery());
//app.use(preventCrossSiteScripting());
app.use(preventParameterPollution());

app.use(compression());

app.use(router);
//app.use(express.static(path.join(__dirname, '../UI')))

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);

  if (process.env.NODE_ENV === 'production') {
      err.statusCode = err.status || 500;
      err.message = err.statusCode === 500 ? "Something has gone very wrong" : err.message;
  }
  return res.json({ status: err.status, message: err.message });
});
const server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
});

process.on('uncaughtException', (error) => {
    console.log(error.name, error.message);
    console.log(error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated!');
    });
});

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