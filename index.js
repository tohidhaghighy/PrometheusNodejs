const express = require('express');
const client = require('prom-client');

const app = express();

let collectDefaultMetrics = client.collectDefaultMetrics;
const register = new client.Registry();

const gauge = new client.Counter({
    name: 'metric_name',
    help: 'metric_help',
    // add `as const` here to enforce label names
    labelNames: ['Desktop','Next','Farabixo','Helium','SRE','MDP'],
  });
  register.registerMetric(gauge);
  // Ok
  gauge.inc({ method: 1 });
// Add your custom metric to the registry


client.collectDefaultMetrics({
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

// Create a route to expose /
app.get('/', (req, res) => {
    try{
        gauge.inc({ 'Desktop': 1,'SRE':1 });
    }catch{

    }
	console.log(register.metrics());
	res.send("test");
});

app.get('/SRE', (req, res) => {
    gauge.inc({ SRE: 1 });
	console.log(register.metrics());
	res.send("test");
});

app.get('/Desktop', (req, res) => {
    gauge.inc({ MDP: 1 });
	console.log(register.metrics());
	res.send("test");
});

// Create a route to expose metrics
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});