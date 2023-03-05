// https://expressjs.com/
const express = require("express")
const fs = require("fs")
const router = express.Router()
const bodyParser = require('body-parser')
const myDockerHelper = require("./docker-helpers")
const listar = require('./list')
const myeth= require('./eth')
const myUtils = require("./utils")
const {resolve} = require('path')
const absolutePath = resolve('');

var Docker = require('dockerode');
const { error } = require("console")
var docker = new Docker({socketPath: '/var/run/docker.sock'});

module.exports = router

const BALANCE = "0x200000000000000000000000000000000000000000000000000000000000000"

//pulling ethereum/client-go image form Docker Hub locally
myDockerHelper.pullImage('ethereum/client-go:stable',{}).then((v)=>{
   
}).catch((ex)=>{
    console.error("exception in pull image", ex);
});

//pulling ethereum/client-go image form Docker Hub locally
myDockerHelper.pullImage('ethereum/client-go:alltools-v1.8.12',{}).then((v)=>{
  
}).catch((ex)=>{
  console.error("exception in pull image", ex);
});

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
  // leemos la plantilla del genesis
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


//Lets creates the network
router.get('/create/:numRed', (req, res) => {
  var result
  async function doit() {try {
    const NUMERO_NETWORK = parseInt(req.params.numRed)
    const NUMERO_NODO = 1
    //const NUMERO_CUENTA = req.body.cuenta
    const parametros = await generateParameter(NUMERO_NETWORK, NUMERO_NODO)

    const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH, BOOTNODE_PORT } = parametros

    console.log("parameters " + JSON.stringify(parametros))

    createIfNotExists("Ethereum")
    //deleteIfExists(NETWORK_DIR)
    createIfNotExists(NETWORK_DIR)
    createIfNotExists(DIR_NODE)
    
    await myDockerHelper.createContainerBootNodeKey('ethereum/client-go:alltools-v1.8.12', NUMERO_NETWORK)
    await myDockerHelper.startContainer(`bootnode_genkey_network_${NUMERO_NETWORK}`)

    await myDockerHelper.createContainerBootNodeEnode('ethereum/client-go:alltools-v1.8.12', NUMERO_NETWORK, BOOTNODE_PORT)
    await myDockerHelper.startContainer(`bootnode_enode_network_${NUMERO_NETWORK}`)

    const enodeAddress = await myDockerHelper.execShellCommand(`sh ./docker_scripts/getbootnodeurl.sh bootnode_enode_network_${NUMERO_NETWORK}`)
    console.log(`enode for bootnode_enode_network_${NUMERO_NETWORK} is ${enodeAddress}`)
    var _account_after_promise
    const account = await createAccount(DIR_NODE,"1234",NUMERO_NETWORK)    
    .then(resultado => {
        console.log("here we go " + resultado)
        const CUENTAS_ALLOC = [
            resultado
        ]       
        generateGenesis(NETWORK_CHAINID, resultado, BALANCE, CUENTAS_ALLOC, NETWORK_DIR)
        _account_after_promise = resultado
        return _account_after_promise
        
    }).then(
      await myDockerHelper.createNodeNetwork('ethereum/client-go:stable', `node_network_${NUMERO_NETWORK}`, DIR_NODE, NUMERO_NETWORK) 
    ).then(
      async function startNode() {
        console.log(`initializing node node_network_${NUMERO_NETWORK} data`)
        myDockerHelper.startContainer(`node_network_${NUMERO_NETWORK}`)
      }
    ).then(
        async function launchNode() {
          myDockerHelper.launchNode(`network_${NUMERO_NETWORK}_node_${NUMERO_NETWORK}`, NUMERO_NETWORK, _account_after_promise , enodeAddress)
        }
    ).then(
      async function startNode() {
        console.log(`starting blockchain network_${NUMERO_NETWORK}_node_${NUMERO_NETWORK}`)
        myDockerHelper.startContainer(`network_${NUMERO_NETWORK}_node_${NUMERO_NETWORK}`)
      }
    )
    
    result = { network_id: NUMERO_NETWORK }
  } catch (error) {
    res.statusCode = 500
    result = { error: error.message || error.toString() }
  } finally {
    res.json(result)
  }
}
doit()
})

//Lets list all networks
/* router.get('/list', async (req, res) => {
  try {

    const networks = [];
    const cuentas = { "alloc": {
      "704765a908962e25626f2bea8cdf96c84dedaa0b": {
        "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
      }
    }}
    networks.push({ number: "NETWORK1", chainid: 'XXXXXXX', cuentas: cuentas });
    networks.push({ number: "NETWORK2", chainid: 'YYYYYYY', cuentas: cuentas });
    networks.push({ number: "NETWORK2", chainid: 'ZZZZZZZ', cuentas: cuentas });
        
    const result = { networks }

    res.json(result)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }  
}) */

router.get('/list', async (req, res) => {
  try {
    const result = {networks: await listar.listNetwork()}
    console.log(result)
    res.json(result)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }  
})


router.get('/node/list/:networkid', async (req, res) => {
  try {
    const result = {nodos: await listar.listNodes(req.params.networkid, "8541")}
    res.json(result)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }  
})

/* router.get('/block', async (req, res) => {
  try {
    const block = await myeth.getLastBlock()
    res.send(block.toString())
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  } 
}) */

router.get('/:networkid/block', async (req, res) => {
  try {
    const block = await listar.getPort(req.params.networkid, "8541")
    .then(puerto => myeth.getLastBlock(puerto))
    res.send(block.toString())
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  } 
})

router.get('/:networkid/chainID', async (req, res) => {
  try {
    const block = await listar.getPort(req.params.networkid, "8541")
    .then(puerto => myeth.getChainId(puerto))
    res.send(block.toString())
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  } 
})

router.post('/charge', async (req, res) => {
  try{
    console.log(req.body)
    const importe = req.body.amount
    const direccion = req.body.address
    const networkid = req.body.networkid
    const respuesta = await listar.getPortNodo(networkid, "8541")
    .then(async node =>{
      return await myeth.getChainId(node.puerto)  
      .then(async chainID => myeth.cargar(networkid, node.nodo, node.puerto, chainID, importe, direccion))
    })
    console.log("réponse", respuesta)
    res.send(respuesta.transactionHash.toString())
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }
})