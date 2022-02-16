'use strict'

const express = require('express')


class Controllerv1 {
  constructor() {
    this._trainMotor = null
    this._hub = null
    this._router = express.Router()

    this._router.all('/', (req, res) => {
      res.send('Hi! API functions list is under construction\n')
    })

    this._router.all('/list/devices', (req, res) => {
      let devCount = 0
      let devices = []
      // this._hub.getDevices().forEach(dev => {
      //   res.send(`><><><><><> Device number: ${devCount} <><><><><><><`)
      //   res.send(`Connected: ${dev.connected}`)
      //   res.send(`Hub name: ${dev.hub.name}`)
      //   res.send(`Port ID: ${dev.portId}`)
      //   res.send(`Port name: ${dev.portName}`)
      //   res.send(`Type: ${dev.type}`)
      //   res.send(`Type name: ${dev.typeName}`)
      //   res.send(`Mode: ${dev.mode}`)
      //   res.send(`WeDo2SmartHub: ${dev.isWeDo2SmartHub}`)
      //   res.send(`Virtual port: ${dev.isVirtualPort}`)
      //   devCount++
      // })

      this._hub.getDevices().forEach(dev => {
        devices[devCount] = {
          "connected": dev.connected,
          "type": dev.type
        }
        devCount++
      })
      const devicesStr = JSON.stringify(devices)
      res.send(`{"devices": ${devicesStr}}`)
    })

    this._router.post('/forward/:power', (req, res) => {
      const power = req.params.power
      if (power >= 1 && power <= 100) {
        res.send(`Moving forward with power: ${power}\n`)
        this._trainMotor.setPower(power)
      } else {
        res.status(500).send(`Set power level from 1 to 100 as "${req.baseUrl}/forward/<level>"\n`)
      }
    })

    this._router.post('/backward/:power', (req, res) => {
      const power = req.params.power
      if (power >= 1 && power <= 100) {
        res.send(`Moving backward with power: ${power}\n`)
        this._trainMotor.setPower(-power)
      } else {
        res.status(500).send(`Set power level from 1 to 100 as "${req.baseUrl}/backward/<level>"\n`)
      }
    })

    this._router.post('/stop', (req, res) => {
      res.send('Stop\n')
      this._trainMotor.stop()
    })

    this._router.post('/brake', (req, res) => {
      res.send('Braking\n')
      this._trainMotor.brake()
    })
  }

  setTrainMotor(trainMotor) {
    this._trainMotor = trainMotor
  }

  setHub(hub) {
    this._hub = hub
  }

  getRouter() {
    return this._router
  }
}


exports.Controllerv1 = Controllerv1
