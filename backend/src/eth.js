const Web3=require('web3')
const web3 = new Web3("http://localhost:8722")

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



module.exports = {
    getLastBlock,
    getChainId
}