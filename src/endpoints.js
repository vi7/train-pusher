const apiVersion = 1

class Endpoints {
  // TODO: migrate to router and attach them to /v1 endpoint with app.use()
  registerEndpoints(app, trainMotor) {
    app.get('/', (req, res) => {
      res.send('Hi!')
    })

    app.get(`/v${apiVersion}`, (req, res) => {
      res.send(`Train Pusher API v${apiVersion}`)
    })

    app.post(`/v${apiVersion}/forward/:power`, (req, res) => {
      const power = req.params.power
      if (power) {
        res.send(`Moving forward with power: ${power}\n`)
        trainMotor.setPower(power)
      } else {
        res.status(500).send(`Set power level from 1 to 100 as \"${req.baseUrl}/<level>\"`)
      }
    })

    app.post(`/v${apiVersion}/backward/:power`, (req, res) => {
      const power = req.params.power
      if (power) {
        res.send(`Moving backward with power: ${power}\n`)
        trainMotor.setPower(-power)
      } else {
        res.status(500).send(`Set power level from 1 to 100 as \"${req.baseUrl}/<level>\"`)
      }
    })

    app.post(`/v${apiVersion}/stop\n`, (req, res) => {
      res.send('Stop')
      trainMotor.stop()
    })

    app.post(`/v${apiVersion}/brake\n`, (req, res) => {
      res.send('Braking')
      trainMotor.brake()
    })
  }
}

exports.Endpoints = Endpoints
