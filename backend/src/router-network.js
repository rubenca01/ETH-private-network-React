const express = require("express")
const fs = require("fs")
const router = express.Router()
const bodyParser = require('body-parser')
const myDockerHelper = require("./docker-helpers")
const listar = require('./list')
const myUtils = require("./utils")
var Docker = require('dockerode');
const { error } = require("console")
const { del } = require("request")
const { log } = console;
var docker = new Docker({socketPath: '/var/run/docker.sock'});

module.exports = router

const BALANCE = "0x200000000000000000000000000000000000000000000000000000000000000"

const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

async function doit(network) {
  console.log("Let's the party start")
  const net_number = parseInt(network)
  const node_initial = 1
  let jambo
  log("NET number " + net_number)
  const parameters = await myUtils.generateParameter(net_number, node_initial)

  const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH, BOOTNODE_PORT } = parameters

  console.log("parameters " + JSON.stringify(parameters))

  myUtils.createIfNotExists("../Ethereum")
  myUtils.deleteIfExists(NETWORK_DIR)
  myUtils.createIfNotExists(NETWORK_DIR)
  myUtils.createIfNotExists(DIR_NODE)

  let docker_net
  const netList = await docker.listNetworks()
  let netExist = false
  netList.forEach(net => {
    if(net.Name == `blockchain_network_${net_number}`)
      netExist = true
  })
  
  if(!netExist) {
    docker_net = await myDockerHelper.createDockerNETWORK(net_number)
  } else{
    docker_net = await docker.getNetwork(`blockchain_network_${net_number}`)
  }
  
  await myDockerHelper.createContainerBootNodeKey('ethereum/client-go:alltools-v1.8.12', net_number)
  await myDockerHelper.startContainer(`bootnode_genkey_network_${net_number}`)
  

  await myDockerHelper.createContainerBootNodeEnode('ethereum/client-go:alltools-v1.8.12', net_number, BOOTNODE_PORT, docker_net.id)
  await myDockerHelper.startContainer(`bootnode_enode_network_${net_number}`)
  const enodeAddress = await myDockerHelper.execShellCommand(`sh ./docker_scripts/getbootnodeurl.sh bootnode_enode_network_${net_number}`)
  myUtils.writeFile(`${NETWORK_DIR}/enode.txt`, enodeAddress)
  var _account_after_promise
  const account = await myUtils.createAccount(DIR_NODE,"havingFunIsTheKeyofthehaPpineZZ", net_number, node_initial)    
  .then(resultado => {
    const CUENTAS_ALLOC = [
        resultado
    ]       
    _account_after_promise = {acc:resultado, acc_alloc:CUENTAS_ALLOC}
    jambo = _account_after_promise.acc
    return _account_after_promise
    
  }).then(async result => {
    return await myUtils.generateGenesis(NETWORK_CHAINID, result.acc, BALANCE, result.acc_alloc, NETWORK_DIR)
  })
  .then(async () => {
    return delay(2000).then(()=>myDockerHelper.createNodeNetwork('ethereum/client-go:stable', `node_${node_initial}_network_${net_number}`, DIR_NODE, net_number, node_initial),log("que hacemos? ")) 
  })
  .then(async () => {
    return delay(3000).then(()=>myDockerHelper.startContainer(`node_${node_initial}_network_${net_number}`),log("una fiesta? "))  
  })
  .then(async () => {
    return delay(4000).then(()=>myDockerHelper.launchNode(`network_${net_number}_node_${net_number}`, net_number, jambo , enodeAddress, node_initial, docker_net.id, NETWORK_CHAINID),log("con muchas cervezas!!!"))
  })
  .then(async () => {
    return delay(5000).then(()=>myDockerHelper.startContainer(`network_${net_number}_node_${net_number}`),log("TODA LA NOCHE!!!"))
  })
  
  return network
}

router.get('/create/:numRed', async (req, res) => {
    try {
      const [image1, image2] = await Promise.all([await myDockerHelper.getImage('ethereum/client-go:stable'),await myDockerHelper.getImage('ethereum/client-go:alltools-v1.8.12')])
      
      const myNetworkEthereum = await doit(req.params.numRed)
      . then(async result => {
        const containers = await myDockerHelper.listContainer()
        
        let containerExist = false;
        let d
        containers.forEach(containerInfo => {
          if (containerInfo.Names[0] == `/network_${result}_node_${result}`) {
            d = docker.getContainer(`/network_${result}_node_${result}`)
            containerExist = true;
          }
        })

        if (!containerExist) {
          throw new Error(`something was wrong when creating the network, start container network_${result}_node_${result} manually`)
        } else {
          res.json({ network_id: result })
        }               
      })
          
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() })
  }
})

router.get('/list', async (req, res) => {
  try {
    const result = {networks: await listar.listNetwork()}

    res.json(result)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }  
})

router.get('/node/list/:networkid', async (req, res) => {
  try {
    const result = {nodos: await listar.listNodes(req.params.networkid, "8545")}

    res.json(result)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }  
})

router.get("/delete/:networkid", async (req, res) => {
  try {

    const network = req.params.networkid
    /*const NETWORK_DIR = `ETH/${NETWORK}`
    const nodos = fs.readdirSync(NETWORK_DIR, { withFileTypes: true }).filter(i => !i.isFile())
    const pids = nodos.map(i => {
        try {
            return JSON.parse(fs.readFileSync(`${NETWORK_DIR}/${i.name}/paramsNodo.json`)).subproceso.pid
        } catch (error) {
            console.log(error)
            return null
        }

    }
    )*/

    const containers = await myDockerHelper.listContainer()

    containers.forEach(container => {
      //log("containerInfo " + JSON.stringify(containerInfo.State))
      if (containerInfo.Names[0] == `/network_${result}_node_${result}`) {
        d = docker.getContainer(`/network_${result}_node_${result}`)
        containerExist = true;
      }
    })
      
    fs.rmSync(NETWORK_DIR, {recursive:true})
    res.status(200).send(":)")

  } catch (error) {
      res.statusCode = 500
      res.json({ error: error.message || error.toString() })
  }
})