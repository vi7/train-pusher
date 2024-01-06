'use strict'

const express = require('express')
const PoweredUP = require('node-poweredup');

const POWER_STEP = 50;

class Controllerv1 {
  constructor() {
    this._trainMotor = null;
    this._trainSpeaker = null;
    this._trainLED = null;
    this._hub = null;
    this._router = express.Router();
    this.currentPower = 0;
    this.currentColor = PoweredUP.Consts.Color.WHITE;

    this._router.all('/list/devices', (req, res) => {
      let devCount = 0;
      const devices = [];
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
          connected: dev.connected,
          type: dev.type
        }
        devCount++
      })
      const devicesStr = JSON.stringify(devices);
      res.send(`{"devices": ${devicesStr}}`);
    })

    this._router.get('/forward/:power', (req, res) => {
      const power = req.params.power
      if (power >= 1 && power <= 100) {
        res.send(`Moving forward with power: ${power}\n`)
        this._trainMotor.setPower(power);
      } else {
        res.status(500).send(`Set power level from 1 to 100 as "${req.baseUrl}/forward/<level>"\n`);
      }
    })

    this._router.get('/backward/:power', (req, res) => {
      const power = req.params.power;
      if (power >= 1 && power <= 100) {
        res.send(`Moving backward with power: ${power}\n`);
        this._trainMotor.setPower(-power);
      } else {
        res.status(500).send(`Set power level from 1 to 100 as "${req.baseUrl}/backward/<level>"\n`);
      }
    })

    this._router.get('/forward/powerup', (req, res) => {
      if (this.currentPower >= 0 && this.currentPower <= 50) {
        res.send(`Increasing power by: ${POWER_STEP}\n`);
        this.currentPower += POWER_STEP;
        this._trainMotor.setPower(this.currentPower);
      } else {
        res.send('Stopping\n');
        this.currentPower = 0;
        this._trainMotor.setPower(this.currentPower);
      }
    })

    this._router.get('/backward/powerup', (req, res) => {
      if (this.currentPower <= 0 && this.currentPower >= -50) {
        res.send(`Decreasing power by: ${POWER_STEP}\n`);
        this.currentPower -= POWER_STEP;
        this._trainMotor.setPower(this.currentPower);
      } else {
        res.send('Stopping\n');
        this.currentPower = 0;
        this._trainMotor.setPower(this.currentPower);
      }
    })

    this._router.get('/stop', (req, res) => {
      this.currentPower = 0;
      this._trainSpeaker.playSound(PoweredUP.Consts.DuploTrainBaseSound.BRAKE);
      res.send('Stop\n');
      this._trainMotor.setPower(this.currentPower);
    })

    this._router.get('/brake', (req, res) => {
      this.currentPower = 0;
      this._trainSpeaker.playSound(PoweredUP.Consts.DuploTrainBaseSound.BRAKE);
      res.send('Braking\n');
      this._trainMotor.brake();
    })

    this._router.get('/sound/:sound', (req, res) => {
      const sound = req.params.sound;
      res.send(`Woo Woo! Sound: ${sound}\n`);
      this._trainSpeaker.playSound(sound);
    })

    this._router.get('/led/:color', (req, res) => {
      const color = req.params.color;
      res.send(`LED ON with color: ${color}\n`);
      this._trainLED.setColor(color);
    })

    this._router.get('/led/changecolor', (req, res) => {
      if (this.currentColor > 0 && this.currentColor <= 10) {
        this.currentColor--;
        res.send(`LED ON with color: ${this.currentColor}\n`);
        this._trainLED.setColor(this.currentColor);
      } else {
        this.currentColor = PoweredUP.Consts.Color.WHITE;
        res.send(`LED ON with color: ${this.currentColor}\n`);
        this._trainLED.setColor(this.currentColor);
      }
    })
  }

  setTrainMotor(trainMotor) {
    this._trainMotor = trainMotor;
  }

  setTrainSpeaker(trainSpeaker) {
    this._trainSpeaker = trainSpeaker;
  }

  setTrainLED(trainLED) {
    this._trainLED = trainLED;
  }

  setHub(hub) {
    this._hub = hub;
  }

  getRouter() {
    return this._router;
  }
}


exports.Controllerv1 = Controllerv1;
