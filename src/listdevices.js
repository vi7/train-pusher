'use strict'

const PoweredUP = require('node-poweredup')

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

let devCount = 0

setInterval(() => {
  const hubs = poweredUP.getHubs() // Get an array of all connected hubs
  hubs.forEach(async (hub) => {
    console.log('======================================')
    hub.getDevices().forEach(dev => {
      console.log(`><><><><><> Device number: ${devCount} <><><><><><><`)
      console.log(`Connected: ${dev.connected}`)
      console.log(`Hub name: ${dev.hub.name}`)
      console.log(`Port ID: ${dev.portId}`)
      console.log(`Port name: ${dev.portName}`)
      console.log(`Type: ${dev.type}`)
      console.log(`Type name: ${dev.typeName}`)
      console.log(`Mode: ${dev.mode}`)
      console.log(`WeDo2SmartHub: ${dev.isWeDo2SmartHub}`)
      console.log(`Virtual port: ${dev.isVirtualPort}`)
      devCount++
    })
    devCount = 0
  })
}, 2000)

