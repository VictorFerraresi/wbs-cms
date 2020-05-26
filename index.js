const express = require('express');
const https = require('https');
const app = express();
const fs = require('fs');

const port = 3007;

const privateKey = fs.readFileSync('./ssl/private.key');
const certificate = fs.readFileSync('./ssl/certificate.crt');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/static', express.static('images'));

app.get('/pages/:page', function (req, res) {
  const filePath = `./pages/${req.params.page}.json`;
  if (!fs.existsSync(filePath)) {
    return res.status(400).send({ "message": "Esta página não existe no CMS." });
  }
  const rawdata = fs.readFileSync(filePath);
  return res.send(JSON.parse(rawdata));
});

https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(port);