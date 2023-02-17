// https://expressjs.com/
const express = require("express")
const fs = require("fs")
const router = express.Router()
const bodyParser = require('body-parser')
const myDockerHelper = require("./docker-helpers")

module.exports = router

//pulling ethereum/client-go image form Docker Hub locally
myDockerHelper.pullImage('ethereum/client-go:latest',{}).then((v)=>{
    console.log("pull image successful, let's party start", v);
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

function createAccount(DIR_NODE) {
  fs.writeFileSync(`${DIR_NODE}/pwd`, PASSWORD)
  execSync(`geth  --datadir ${DIR_NODE}  account new --password ${DIR_NODE}/pwd`)

  // pillamos el address que hemos creado 
  const lista = fs.readdirSync(`${DIR_NODE}/keystore`)
  const CUENTA = JSON.parse(fs.readFileSync(`${DIR_NODE}/keystore/${lista[0]}`).toString()).address
  return CUENTA
}

function generateParameter(network, node) {
  const NUMERO_NETWORK = parseInt(network)
  const NUMERO_NODO = parseInt(node)
  const NODO = `nodo${NUMERO_NODO}`
  const NETWORK_DIR = `ETH/eth${NUMERO_NETWORK}`
  const NETWORK_CHAINID = 333444 + NUMERO_NETWORK

  const HTTP_PORT = 9545 + NUMERO_NODO + NUMERO_NETWORK * 20
  const DIR_NODE = `${NETWORK_DIR}/${NODO}`
  const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
  const PORT = 30404 + NUMERO_NODO + NUMERO_NETWORK * 20
  const AUTHRPC_PORT = 9553 + NUMERO_NODO + NUMERO_NETWORK * 20

  return {
      NUMERO_NETWORK, NUMERO_NODO, NODO, NETWORK_DIR, NETWORK_CHAINID, HTTP_PORT,
      DIR_NODE, IPCPATH, PORT, AUTHRPC_PORT
  }
}


//Lets creates the network
router.post('/create', async (req, res) => {
  try {
    const NUMERO_NETWORK = parseInt(req.body.network)
    const NUMERO_NODO = 1
    const NUMERO_CUENTA = req.body.cuenta
    const parametros = generateParameter(NUMERO_NETWORK, NUMERO_NODO)

    const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH } = parametros

    createIfNotExists("ETH")
    deleteIfExists(NETWORK_DIR)
    createIfNotExists(NETWORK_DIR)
    createIfNotExists(DIR_NODE)
    
    const result = { network_id: 9999 }

    res.json(result)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error.message || error.toString() });
  }  
})

//Lets list all networks
router.get('/list', async (req, res) => {
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
})