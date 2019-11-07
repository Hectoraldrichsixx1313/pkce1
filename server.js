var express = require('express');
var app = express();
const path = require('path')
const crypto = require('crypto');
const bodyParser = require("body-parser");

// setup ports
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


const base64URLEncode = (str) => {
  return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}
const sha256 = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest();
}
app.use(bodyParser());


// Servicio index.html file 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

//verifier
app.post('/verifier', (req, res) => {
  res.json({ verifier: base64URLEncode(crypto.randomBytes(32)) })
})

//challenge.
app.post('/challenger', (req, res) => {
  if (!req.body.verifier) {
    res.json({ error: "No se ha especificado el verifier" })
  }

  res.json({ challenge: base64URLEncode(sha256(req.body.verifier)) })
})


// server listens in on port
app.listen(server_port, server_ip_address, function () {
	 console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});