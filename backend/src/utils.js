const fs = require('fs')
const myDockerHelper = require("./docker-helpers")
const {resolve} = require('path')
const absolutePath = resolve('');

const readFile = (path, opts = 'utf8') =>
  new Promise((resolve, reject) => {
    console.log("pora qui")
    fs.readFile(path, opts, (err, data) => {
      console.log("otro")
      if (err) reject(err)
      else {
        console.log("log data" + data)
        resolve(data)
      }
    })
  })

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, (err) => {
        if (err) reject(err)
        else resolve()
    })
})

const readdirec = (path) =>    
    new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
        if (err) reject(err)
        else resolve(files)
    })
})

function createIfNotExists(path) {
  if (!fs.existsSync(path))
      fs.mkdirSync(path)
}
function deleteIfExists(path) {
  if (fs.existsSync(path))
      fs.rmdirSync(path, { recursive: true, })
}

function createAccount(DIR_NODE, password, networkid,node,callback) {

  function cuentaPromise () { return new Promise((resolve, reject )=> {
    setTimeout(async () => {
      console.log("node dir " + DIR_NODE);
      myDockerHelper.execShellCommand(`chmod 777 -R ${DIR_NODE}/keystore`)
      .then(() =>  readdirec(`${DIR_NODE}/keystore`))
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
    writeFile(`${DIR_NODE}/pwd.txt`, password)
    .then(await myDockerHelper.createContainerNode('ethereum/client-go:stable', `node_${node}_account_${networkid}`, DIR_NODE, networkid, node))
    .then(await myDockerHelper.startContainer(`node_${node}_account_${networkid}`))
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

module.exports = {
    readFile,
    writeFile,
    readdirec,
    createIfNotExists,
    createAccount,
    deleteIfExists,
    generateGenesis,
    generateParameter

}