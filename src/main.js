'use strict'

const LISTEN_PORT = 8080;

require('log-timestamp');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const args = require('minimist')(process.argv.slice(2));
const express = require('express');
const PoweredUP = require('node-poweredup');
const Controllerv1 = require('./controllers/api_v1');

const app = express();
const poweredUP = new PoweredUP.PoweredUP();
const controllerv1 = new Controllerv1.Controllerv1();


poweredUP.on('discover', async (hub) => { // Wait to discover a Hub
  console.log(`Discovered: ${hub.name}`);

  if (hub.type === PoweredUP.Consts.HubType.DUPLO_TRAIN_BASE) {
    await hub.connect();
    controllerv1.setHub(hub);
    const trainMotor = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.DUPLO_TRAIN_BASE_MOTOR);
    const trainSpeaker = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.DUPLO_TRAIN_BASE_SPEAKER);
    const trainLED = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.HUB_LED);
    console.log(`Connected to: ${hub.name}`);
    controllerv1.setTrainMotor(trainMotor);
    controllerv1.setTrainSpeaker(trainSpeaker);
    controllerv1.setTrainLED(trainLED);
  };

  hub.on('disconnect', () => {
    console.log('Hub disconnected');
  });
});

// setInterval(async () => {
//  // TODO: create train info api endpoint from the below
//   const train = poweredUP.getHubByPrimaryMACAddress(macAddress)

//   if (train) {
//     console.log(`=== Hub: ${train.name} ===`)
//     console.log(`Connected: ${train.connected}`)
//     console.log(`Ports: ${train.ports}`)
//     console.log(`Type: ${train.type}`)
//     console.log(`FW ver: ${train.firmwareVersion}`)
//     console.log(`HW ver: ${train.hardwareVersion}`)
//     console.log(`MAC: ${train.primaryMACAddress}`)
//     console.log(`UUID: ${train.uuid}`)
//     console.log(`Bat level: ${train.batteryLevel}`)
//   }
// }, 2000)

const main = () => {
  console.log('App is up with CLI args:');
  Object.entries(args).forEach(([key, value]) => {
    console.log(key, value);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  app.use('/api/v1', controllerv1.getRouter());

  if (!module.parent) {
    const server = app.listen(LISTEN_PORT, () => {
      const host = server.address().address;
      const port = server.address().port;
      console.log('Server is running.\nAPI documentation: http://%s:%s/api-docs', host, port);
    });
  };

  poweredUP.scan(); // Start scanning for Hubs
  console.log('Scanning for Hubs...');
}


main();
