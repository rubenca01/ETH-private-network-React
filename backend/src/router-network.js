// https://expressjs.com/
const express = require("express")
const router = express.Router()
const bodyParser = require('body-parser')
// https://expressjs.com/en/resources/middleware/cors.html
//const cors = require("cors") 
// https://expressjs.com/en/resources/middleware/morgan.html
//const morgan = require("morgan") 
//const app = express()
const myDockerHelper = require("./docker-helpers")

module.exports = router

//const { Router } = require("express")
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }))
//const port = 3000

/*app.listen(port, () => {
  console.log(`listening on port ${port}`)
})*/

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
router.post('/create', (req, res) => {
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


    
    
    res.send("Network created")
  } catch (error) {
    res.send({error})
  }  
})