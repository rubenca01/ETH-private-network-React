// https://expressjs.com/
const express = require("express")
const bodyParser = require('body-parser')
// https://expressjs.com/en/resources/middleware/cors.html
const cors = require("cors") 
// https://expressjs.com/en/resources/middleware/morgan.html
const morgan = require("morgan") 
const app = express()
const socket = require("./socket")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const port = 3000

//const networks = require("./router-network")

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

app.get('/listNetworks', async (req, res) => {
  try {
    const [r] = await socket.myCurlGet(2375,'/v1.41/containers/json')
    //const [r] = await socket.myCurlGet()
    res.send(r)
  } catch (error) {
    res.send({error})
  }  
})

app.post('/createNetwork', async (req, res) => {
  try {
    const image = req.body
    const [r] = await socket.myCurlPost('/var/run/docker.sock','/v1.41/containers/create',image)
    
    res.send("Network created")
  } catch (error) {
    res.send({error})
  }  
})