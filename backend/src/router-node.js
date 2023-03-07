const express = require("express")
const router = express.Router()
const fs = require("fs")
const myDockerHelper = require("./docker-helpers")
const myUtils = require("./utils")
const { error } = require("console")
const { log } = console
var Docker = require('dockerode')
var docker = new Docker({socketPath: '/var/run/docker.sock'})
module.exports =  router

const BALANCE = "0x200000000000000000000000000000000000000000000000000000000000000"

const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

async function doit(network,node) {
    await delay(1000)
    console.log("Let's the party start again")
    const parameters = await myUtils.generateParameter(network, node)

    const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH, BOOTNODE_PORT } = parameters

    console.log("parameters " + JSON.stringify(parameters))

    myUtils.createIfNotExists(DIR_NODE)

    let _account_after_promise
    const account = await myUtils.createAccount(DIR_NODE,"havingFunIsTheKeyofthehaPpineZZ", network, node)
    .then(resultado => {
        const CUENTAS_ALLOC = [
            resultado
        ]       
        myUtils.generateGenesis(NETWORK_CHAINID, resultado, BALANCE, CUENTAS_ALLOC, NETWORK_DIR)
        _account_after_promise = resultado
        return _account_after_promise
        
    }).then(
        await myDockerHelper.createNodeNetwork('ethereum/client-go:stable', `node_${node}_network_${network}`, DIR_NODE, network, node)
    ).then(
        async => {
            myDockerHelper.startContainer(`node_${node}_network_${network}`)
        }
    ).then(() => {
        const enode =  fs.readFileSync(`${NETWORK_DIR}/enode.txt`, 'utf8')
        log("enode stored " + JSON.stringify(enode))
        myDockerHelper.launchNode(`network_${network}_node_${node}`, network, _account_after_promise , enode, node)      
    })
    .then(async () => {
        return delay(2000).then(()=>myDockerHelper.startContainer(`network_${network}_node_${node}`))
    })
        
    return {network_id: network, node_id: node}
}

router.post("/add", async (req, res) => {
    try {

        let network = req.body.networkid
        let node = req.body.nodeid
        let addNode

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
            addNode = await doit(network, node)
        }
        
        res.status(200).send(addNode)

    } catch (error) {
        res.statusCode = 500
        res.json({ error: error.message || error.toString() })
    }
})
