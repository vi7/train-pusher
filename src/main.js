'use strict'

const listenPort = 8081
const apiVersion = 1

require('log-timestamp')
const args = require('minimist')(process.argv.slice(2))
const express = require('express')
const PoweredUP = require('node-poweredup')

const app = express()
const poweredUP = new PoweredUP.PoweredUP()

let trainMotor = null

poweredUP.on('discover', async (hub) => { // Wait to discover a Hub
  console.log(`Discovered: ${hub.name}`)

  if (hub.type === PoweredUP.Consts.HubType.DUPLO_TRAIN_BASE) {
    await hub.connect()
    trainMotor = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.DUPLO_TRAIN_BASE_MOTOR)
    console.log(`Connected to: ${hub.name}`)
  }

  hub.on('disconnect', () => {
    console.log('Hub disconnected')
  })
})

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
  console.log('App is up with CLI args:')
  Object.entries(args).forEach(([key, value]) => {
    console.log(key, value)
  })

  app.use(`/api/v${apiVersion}`, require('./controllers/api_v1'));

  app.get('/', function(req, res) {
    res.send(`Get /api/v${apiVersion} to see API functions`)
  });

  if (!module.parent) {
    const server = app.listen(listenPort, () => {
      const host = server.address().address
      const port = server.address().port
      console.log('Serving requests at http://%s:%s', host, port)
    })
  }

  poweredUP.scan() // Start scanning for Hubs
  console.log('Scanning for Hubs...')

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated')
    })
  })
}

main()
