const Web3=require('web3')

const fs = require("fs")
const myUtils = require("./utils")

/* async function getLastBlock() {
    const block = await web3.eth.getBlockNumber()
    console.log(block)
    return block
} */

async function getLastBlock(puerto) {
    try {
        const data = await fetch(`http://localhost:${puerto}`, {
            method : "POST",
            headers: {
                'Content-Type': "application/json"
            },   
            body: JSON.stringify({"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83})
        })
        .then(x => x.json())
        //.then(x => console.log(x))
        .then(x => {
            //console.log(x)
            if(x.result) {
                return parseInt(x.result)
            } else {
                throw new Error("no result")
            }
        })
        return data
    } catch (e) {
        throw new Error(e)
    }
}

async function getChainId(puerto) {
    try {
        const data = await fetch(`http://localhost:${puerto}`, {
            method : "POST",
            headers: {
                'Content-Type': "application/json"
            },   
            body: JSON.stringify({"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":18})
        })
        .then(x => x.json())
        //.then(x => console.log(x))
        .then(x => {
            console.log(x.result.protocols.eth.config.chainId)
            if(x.result.protocols.eth.config.chainId) {
                return x.result.protocols.eth.config.chainId
            } else {
                throw new Error("no result")
            }
        })
        return data
    } catch (e) {
        throw new Error(e)
    }
}

async function cargar(networkid, nodo, puerto, chainID, importe, direccion) {
    const web3 = new Web3(`http://localhost:${puerto}`)
    const directorio =`./Ethereum/network${networkid}/node1`
    const pwd = fs.readFileSync(`${directorio}/pwd.txt`).toString()
    //console.log(pwd)
    return await myUtils.readdirec(`${directorio}/keystore`)
    .then(async listFS => {
        // console.log(listFS)
        return await fs.readFileSync(`${directorio}/keystore/${listFS[0]}`,'utf-8')
    })
    .then(x=> {
        //console.log(x)
        return JSON.parse(x)
    })
    .then(async json => {
        //console.log(json)
        return await web3.eth.accounts.decrypt(json,pwd)
    } )
    .then(async account => {
        const tx = {
            chainid: chainID,
            to: direccion,
            from: account.address,
            gas: 30000,
            value: web3.utils.toWei(`${importe}`, 'ether')
        }
        // console.log(tx)
        return account.signTransaction(tx)
    })
    .then(async txSigned => await web3.eth.sendSignedTransaction(txSigned.rawTransaction))
}



module.exports = {
    getLastBlock,
    getChainId,
    cargar
}