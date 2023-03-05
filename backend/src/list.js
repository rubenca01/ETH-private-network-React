const Dockerode = require("dockerode")
const myDockerHelper = require("./docker-helpers")
const myeth = require("./eth")


async function listNetwork() {
    try {
        var list = []
        const containers = await myDockerHelper.listContainer()
        containers.filter(x => x.Names[0].substr(1,8)=="network_").map(x => {
            list = [...list, {"number": x.Names[0].slice(9, x.Names[0].indexOf("_node_")), "chainid": "to be added", "puerto": null}]
        })
        return list
    } catch (error) {
        //console.log("error getting container list")
        throw new Error(error)
    }
}

async function listNetwork2() {
    const list2 = await listNetwork().then(list => list.map(async x => x.puerto = await getPort(x.number,"8541")))
    .then(list => list.map(async x => {
        console.log(x.puerto)
        if(x.puerto!= null && x.puerto[0]!=null) {
            x.chainid= await myeth.getChainId(Puerto[0])
        } else {
            x.chainid="none"
        }

    }))
    return list2
}

async function listNodes(networkid, Port) {
    try {
        var list = []
        const containers = await myDockerHelper.listContainer()
        containers.filter(x => x.Names[0].substr(1,x.Names[0].indexOf("_node_")-1)==`network_${networkid}`).map(x => {
            //console.log(x)
            list = [...list, {
                "numero": x.Names[0].slice(x.Names[0].indexOf("_node_")+6, x.Names[0].length),
                "puerto": x.Ports.filter(x => x.IP=="0.0.0.0" && x.PrivatePort == Port).map(x => x.PublicPort),
                "status": x.Status
            }]
        })
        //console.log(list)
        return list
    } catch (error) {
        console.log("error getting container list")
        throw new Error(error)
    }
}

async function getPort(networkid, Port) {
    const puerto = await listNodes(networkid, Port)
    .then(x => x.filter(item => item.puerto != null))
    .then(x => {
        //console.log(x[0])
        return x[0].puerto
    })
    return puerto
}

async function getPortNodo(networkid, Port) {
    const nodo = await listNodes(networkid, Port)
    .then(x => x.filter(item => item.puerto != null))
    .then(x => {
        //console.log(x[0])
        return  {puerto: x[0].puerto, nodo: x[0].numero}
    })
    return nodo
}

module.exports = {
    listNetwork,
    listNodes,
    getPort,
    getPortNodo
}