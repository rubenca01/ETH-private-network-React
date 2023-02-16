const express = require("express")
const router = express.Router()
const app = express()
const socket = require("./socket")

module.exports = router

 
/*app.get('/listNetworks', async (req, res) => {
    try {
        const [r] = await socket.mySocket('/var/run/docker.sock','/v1.41/containers/json')
        res.send(r)
    } catch (error) {
        res.send({error})
    }  
})

app.get('/createNetwork', async (req, res) => {
    try {
        const [r] = await socket.mySocket('/var/run/docker.sock','/v1.41/containers/json')
        res.send(r)
    } catch (error) {
        res.send({error})
    }  
})*/