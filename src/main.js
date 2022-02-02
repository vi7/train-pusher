const macAddress = 'e4:e1:12:9a:0a:85' // Steam Train 10874
const listenPort = 8081

const args = require('minimist')(process.argv.slice(2))
const express = require('express')
const PoweredUP = require('node-poweredup')

const app = express()
const poweredUP = new PoweredUP.PoweredUP()
poweredUP.scan() // Start scanning for Hubs
console.log('Scanning for Hubs...')

poweredUP.on('discover', async (hub) => { // Wait to discover a Hub
  console.log(`Discovered: ${hub.name}!`)
  await hub.connect()
  console.log(`Connected to: ${hub.name}!`)

  hub.on('disconnect', () => {
    console.log('Hub disconnected')
  })
})

setInterval(async () => {
  const train = poweredUP.getHubByPrimaryMACAddress(macAddress)

  if (train) {
    console.log(`=== Hub: ${train.name} ===`)
    console.log(`Connected: ${train.connected}`)
    console.log(`Ports: ${train.ports}`)
    console.log(`Type: ${train.type}`)
    console.log(`FW ver: ${train.firmwareVersion}`)
    console.log(`HW ver: ${train.hardwareVersion}`)
    console.log(`MAC: ${train.primaryMACAddress}`)
    console.log(`UUID: ${train.uuid}`)
    console.log(`Bat level: ${train.batteryLevel}`)
  }
}, 2000)

const main = () => {

  console.log('App is up with args:')
  Object.entries(args).forEach(([key, value]) => {
    console.log(key, value)
  })

  app.get('/', (req, res) => {
    res.send('Hi!')
  })

  const server = app.listen(listenPort, () => {
    const host = server.address().address
    const port = server.address().port
    console.log("Serving requests at http://%s:%s", host, port)
  })

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated')
    })
  })
}

main()
