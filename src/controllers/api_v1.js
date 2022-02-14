
'use strict'

const express = require('express')
const apiv1 = express.Router()

apiv1.get('/', (req, res) => {
  res.send('Hi! API functions list is under construction')
})

apiv1.post('/forward/:power', (req, res) => {
  const power = req.params.power
  if (power) {
    res.send(`Moving forward with power: ${power}\n`)
    trainMotor.setPower(power)
  } else {
    res.status(500).send(`Set power level from 1 to 100 as "${req.baseUrl}/<level>"`)
  }
})

apiv1.post('/backward/:power', (req, res) => {
  const power = req.params.power
  if (power) {
    res.send(`Moving backward with power: ${power}\n`)
    trainMotor.setPower(-power)
  } else {
    res.status(500).send(`Set power level from 1 to 100 as "${req.baseUrl}/<level>"`)
  }
})

apiv1.post('/stop\n', (req, res) => {
  res.send('Stop')
  trainMotor.stop()
})

apiv1.post('/brake\n', (req, res) => {
  res.send('Braking')
  trainMotor.brake()
})

module.exports = apiv1
