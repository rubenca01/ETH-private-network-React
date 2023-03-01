const express = require("express")
const fs = require("fs")
const router = express.Router()
const bodyParser = require('body-parser')
const myDockerHelper = require("./docker-helpers")
const listar = require('./list')
const myUtils = require("./utils")
const {resolve} = require('path')
const absolutePath = resolve('');

var Docker = require('dockerode');
const { error } = require("console")
const { log } = console;
var docker = new Docker({socketPath: '/var/run/docker.sock'});

module.exports = router

const BALANCE = "0x200000000000000000000000000000000000000000000000000000000000000"

function createIfNotExists(path) {
  if (!fs.existsSync(path))
      fs.mkdirSync(path)
}
function deleteIfExists(path) {
  if (fs.existsSync(path))
      fs.rmdirSync(path, { recursive: true, })
}

function createAccount(DIR_NODE, password, networkid ,callback) {

  function cuentaPromise () { return new Promise((resolve, reject )=> {
    setTimeout(async () => {
      myDockerHelper.execShellCommand(`chmod 777 -R ${DIR_NODE}/keystore`)
      .then(() =>  myUtils.readdirec(`${DIR_NODE}/keystore`))
      .then(async listFS => {
        console.log("ListFS: ", listFS[0])
        return await fs.readFileSync(`${DIR_NODE}/keystore/${listFS[0]}`, 'utf8')})
      .then(x => {
        console.log("fichero " + x)
        resolve(JSON.parse(x).address)
      })
    },5000)
  })}
  return new Promise(async (resolve, reject) => {
    myUtils.writeFile(`${DIR_NODE}/pwd.txt`, password)
    .then(await myDockerHelper.createContainerNode('ethereum/client-go:stable', `node_account_${networkid}`, DIR_NODE, networkid))
    .then(await myDockerHelper.startContainer(`node_account_${networkid}`))
    .then(async () => await cuentaPromise())
    .then(result => {
      console.log("Cuenta: ", result)
      resolve(result) 

    })
  }) 
}

function generateGenesis(NETWORK_CHAINID, CUENTA, BALANCE, CUENTAS_ALLOC, NETWORK_DIR) {
  const timestamp = Math.round(((new Date()).getTime() / 1000)).toString(16)
  let genesis = JSON.parse(fs.readFileSync(`${absolutePath}/genesisbase.json`).toString())

  console.log(`myGenesis ${genesis}`)

  genesis.config.chainId = NETWORK_CHAINID
  genesis.extraData = `0x${'0'.repeat(64)}${CUENTA}${'0'.repeat(130)}`


  genesis.alloc = CUENTAS_ALLOC.reduce((acc, item) => {
      acc[item] = { balance: BALANCE }
      return acc
  }, {})

  fs.writeFileSync(`${NETWORK_DIR}/genesis.json`, JSON.stringify(genesis))

}

function generateParameter(network, node) {
  return new Promise((resolve, reject)=>{
    const NUMERO_NETWORK = parseInt(network)
    const NUMERO_NODO = parseInt(node)
    const NODO = `node${NUMERO_NODO}`
    const NETWORK_DIR = `Ethereum/network${NUMERO_NETWORK}`
    const NETWORK_CHAINID = 333444 + NUMERO_NETWORK

    const HTTP_PORT = 9545 + NUMERO_NODO + NUMERO_NETWORK * 20
    const DIR_NODE = `${NETWORK_DIR}/${NODO}`
    const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
    const PORT = 30404 + NUMERO_NODO + NUMERO_NETWORK * 20
    const AUTHRPC_PORT = 9553 + NUMERO_NODO + NUMERO_NETWORK * 20
    const BOOTNODE_PORT = 8710 + NUMERO_NODO + NUMERO_NETWORK * 20

    const params = {
      NUMERO_NETWORK, NUMERO_NODO, NODO, NETWORK_DIR, NETWORK_CHAINID, HTTP_PORT,
      DIR_NODE, IPCPATH, PORT, AUTHRPC_PORT, BOOTNODE_PORT
    }
    
    if (params == null){
      reject(new Error('Oops!.. '))
    }
    resolve(params)
  }) 
}

const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration));

async function doit(network) {
  await delay(17000);
  console.log("Let's the party start")
  const net_number = parseInt(network)
  const node_initial = 1
  log("NET number " + net_number)
  const parameters = await generateParameter(net_number, node_initial)

  const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH, BOOTNODE_PORT } = parameters

  console.log("parameters " + JSON.stringify(parameters))

  createIfNotExists("Ethereum")
  deleteIfExists(NETWORK_DIR)
  createIfNotExists(NETWORK_DIR)
  createIfNotExists(DIR_NODE)
  
  await myDockerHelper.createContainerBootNodeKey('ethereum/client-go:alltools-v1.8.12', net_number)
  await myDockerHelper.startContainer(`bootnode_genkey_network_${net_number}`)

  await myDockerHelper.createContainerBootNodeEnode('ethereum/client-go:alltools-v1.8.12', net_number, BOOTNODE_PORT)
  await myDockerHelper.startContainer(`bootnode_enode_network_${net_number}`)
  const enodeAddress = await myDockerHelper.execShellCommand(`sh ./docker_scripts/getbootnodeurl.sh bootnode_enode_network_${net_number}`)
  log(`enode for bootnode_enode_network_${net_number} is ${enodeAddress}`)
  var _account_after_promise
  const account = await createAccount(DIR_NODE,"havingFunIsTheKeyofthehaPpineZZ", net_number)    
  .then(resultado => {
    const CUENTAS_ALLOC = [
        resultado
    ]       
    generateGenesis(NETWORK_CHAINID, resultado, BALANCE, CUENTAS_ALLOC, NETWORK_DIR)
    _account_after_promise = resultado
    return _account_after_promise
    
  }).then(
    await myDockerHelper.createNodeNetwork('ethereum/client-go:stable', `node_network_${net_number}`, DIR_NODE, net_number) 
  ).then(
    async function startNode() {
      //console.log(`initializing node node_network_${net_number} data ${_account_after_promise}`)
      myDockerHelper.startContainer(`node_network_${net_number}`)
    }
  ).then(
    async function launchNode() {
      //log("_account_after_promise " +_account_after_promise)
      myDockerHelper.launchNode(`network_${net_number}_node_${net_number}`, net_number, _account_after_promise , enodeAddress)
    }
  ).then(
        async function startNode() {
          log(`starting blockchain network_${net_number}_node_${net_number}`)
          await myDockerHelper.startContainer(`network_${net_number}_node_${net_number}`)
        }
   )
      
  log("still accomplishing my Promise, 'I am a good person'....... ")

  return network
}

router.get('/create/:numRed', async (req, res) => {
    try {
      const [image1, image2] = await Promise.all([await myDockerHelper.getImage('ethereum/client-go:stable'),await myDockerHelper.getImage('ethereum/client-go:alltools-v1.8.12')])
      
      const myNetworkEthereum = await doit(req.params.numRed)
      res.json({ network_id: myNetworkEthereum })
          
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