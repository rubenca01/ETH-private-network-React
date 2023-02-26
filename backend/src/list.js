const Dockerode = require("dockerode")
const myDockerHelper = require("./docker-helpers")

async function listNetwork() {
    try {
        var list = []
        const containers = await myDockerHelper.listContainer()
        containers.filter(x => x.Names[0].substr(1,8)=="network_").map(x => {
            list = [...list, {"number": x.Names[0].slice(9, x.Names[0].indexOf("_node_")), "chainid": "to be added"}]
        })
        return list
    } catch (error) {
        console.log("error getting container list")
        throw new Error(error)
    }
}

async function listNodes(networkid, Port) {
    try {
        var list = []
        const containers = await myDockerHelper.listContainer()
        containers.filter(x => x.Names[0].substr(1,x.Names[0].indexOf("_node_")-1)==`network_${networkid}`).map(x => {
            console.log(x)
            list = [...list, {
                "numero": x.Names[0].slice(x.Names[0].indexOf("_node_")+6, x.Names[0].length),
                "puerto": x.Ports.filter(x => x.IP=="0.0.0.0" && x.PrivatePort == Port).map(x => x.PublicPort),
                "status": x.Status
            }]
        })
        console.log(list)
        return list
    } catch (error) {
        console.log("error getting container list")
        throw new Error(error)
    }
}

module.exports = {
    listNetwork,
    listNodes
}