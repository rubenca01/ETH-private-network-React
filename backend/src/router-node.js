const express = require("express")
const router = express.Router()
const fs = require("fs")
const myDockerHelper = require("./docker-helpers")
const { error } = require("console")
const { log } = console
var Docker = require('dockerode')
var docker = new Docker({socketPath: '/var/run/docker.sock'})
module.exports =  router

async function doit(network,node_initial) {
    //TODO
}

router.post("/add", async (req, res) => {
    try {

        let network = req.body.networkid
        let node = req.body.nodeid

        const containers = await myDockerHelper.listContainer()
        let containerExist = false
        let container
        containers.forEach(containerInfo => {
          if (containerInfo.Names[0].includes(`network_${network}`)) { //TODO, get rid of previous container (those to create accounts)
            container = docker.getContainer(containerInfo.Names[0])
            let status = containerInfo.State
            log(`container ${JSON.stringify(containerInfo.Names[0])} is ${JSON.stringify(status)}`)
            if(status == 'running')
                containerExist = true
          }
        });

        if (!containerExist) {
            throw new Error(`Blockchain network ${network} does not exist/or all its nodes are stopped`)
        } else {
            const addNode = await doit(network, node)
        }
        
        res.status(200).send({network_id: network, node_id: node})

    } catch (error) {
        res.statusCode = 500
        res.json({ error: error.message || error.toString() })
    }
})
