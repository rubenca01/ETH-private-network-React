var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
const fs = require("fs")
const {resolve} = require('path')
const absolutePath = resolve('../');
const { exec } = require('child_process');
const { log } = console;

async function pullImage(imageId) {  
  docker.pull(imageId,{"disable-content-trust":"false"},function(err, data) {
    if (err){
      throw Error("cannot pull image " + imageId)
    } else{
      log("pulling docker image " + imageId)
      return imageId
    }
  })  
}

async function imageAlreadyOnServer(imageName) {
  try {
    const image = await docker.getImage(imageName).inspect()
    return image
  } catch(e){
    log(`Image ${imageName} does not exist on this server ` + e)
  }
}

async function getImage(imageName) {
  const alreadyPresent = await imageAlreadyOnServer(imageName);
  if (alreadyPresent == undefined) {
    await pullImage(imageName);
  }
  return imageName;
}

function createDockerNETWORK(networkid){
  return new Promise((resolve, reject)=>{
    docker.createNetwork({
      Name:`blockchain_network_${networkid}`
    }, (error, data) => {
      if(error) {
        console.error(`Docker Network error when creating :${networkid}` + error);
        reject(error)
      } else {
        console.log(`Docker Network created on network:${networkid}`);
        resolve(data)
      }
    })    
  })
}

function createNodeNetwork(imageId, accountName, data_dir, networkid, node){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: accountName,
      Cmd: ["--datadir", `/codecrypto/network${networkid}/node${node}`, "init", `/codecrypto/network${networkid}/genesis.json`],
      'Volumes': {
        '/codecrypto': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/Ethereum/network${networkid}:/codecrypto/network${networkid}`]
      },
      User:"1000:1000"
    }, (error, data) => {
      if(error) {
        console.error(`Docker error when creating node ${node} initialization on networkid:${networkid}` + error);
        reject(error)
      } else {
        console.log(`Docker node ${node} initialization created on network:${networkid}`);
        resolve(data)
      }
    })    
  })
}

function launchNode(accountName, networkid, account, enode, node, docker_net){
  var val1 = Math.floor(8710 + Math.random() * 20);
  var val2 = Math.floor(3001 + Math.random() * 20);
  const imageId = 'ethereum/client-go:stable'
  const cmd = [ "--networkid", networkid.toString() , 
                "--ipcpath",`\\\\.\\pipe\\geth${networkid}-${networkid}.ipc`, 
                "--datadir", `/codecrypto/network${networkid}/node${node}`,
                "--syncmode","full",
                "--http",
                "--dev",
                "--http.api","admin,eth,miner,net,txpool,personal",
                "--http.addr","0.0.0.0",
                "--http.port","8541",
                "--http.corsdomain",'"'+'*'+'"',
                "--allow-insecure-unlock",
                "--unlock",`0X${account}`,
                "--password",`/codecrypto/network${networkid}/node${node}/pwd.txt`,
                "--mine",
                "--port","30031",
                "--bootnodes",enode,
                "--miner.etherbase",`0X${account}`,
              ]
  return new Promise((resolve, reject)=>{ 
    console.log("launching node cmd into promise: " + cmd + " ")
    docker.createContainer({
      Image: imageId, 
      name: accountName, 
      Cmd: cmd, 
      "Volumes": {
        '/codecrypto': {}
      },
      "HostConfig": {
        'Binds': [`${absolutePath}/Ethereum:/codecrypto`],
        'PortBindings' : {
          "8541/tcp" : [{"HostPort": val1.toString()}],
          "30031/tcp" : [{"HostPort": val2.toString()}]
        }, 
        "Links":[`bootnode_enode_network_${networkid}`],
        "NetworkMode" : `${docker_net}`
      },
      "ExposedPorts":{
        "8541/tcp":{},
        "30031/tcp":{}
      },
      User:"1000:1000"
    }, (err,stream)=>{
      if(err){
        console.error(`Docker error when trying to start Blockchain on network${networkid} ` + err);
        reject(err);
      }else {
        console.log(`Docker Blockchain started on network:${networkid}`);
        resolve(stream);
      }
    })
  })
}

function createContainerNode(imageId, accountName, data_dir, networkid, node){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: accountName,
      Cmd: ["--password", "/codecrypto/pwd.txt", "account", "new", "--datadir", "/codecrypto"],
      'Volumes': {
        '/codecrypto': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/Ethereum/network${networkid}/node${node}:/codecrypto:rw`]
      },
      User:'1000:1000'
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when creating node ${node} on networkid:${networkid} ` + err);
        reject(err);
      }else {
        console.log(`Docker node ${node} created on network:${networkid}`);
        resolve(stream);
      }
    })
  })
}

function createContainerBootNodeKey(imageId, networkid){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: 'bootnode_'+'genkey'+'_'+'network'+'_'+networkid,
      Cmd: ["bootnode", "--genkey", "/opt/bootnode/boot.key"],
      'Volumes': {
        '/opt/bootnode': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/Ethereum/network${networkid}/:/opt/bootnode`]
      }
      //User:'1000:1000'
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when creating BootNodeKey on networkid:${networkid} ` + err);
        reject(err);
      }else {
        console.log(`Docker BootNodeKey created on network:${networkid}`);
        resolve(stream);
      }
    })
  })
}

function createContainerBootNodeEnode(imageId, networkid, enodePort, docker_net){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: 'bootnode_'+'enode'+'_network_'+networkid,
      Cmd: ["bootnode", "--nodekey", "/opt/bootnode/boot.key", "--verbosity", "7", "-addr", ":"+enodePort],
      'Volumes': {
        '/opt/bootnode': {}
      },
      'HostConfig': {
        'PortBindings' : {"8710/tcp" : [{"HostPort": enodePort.toString()}]},
        'Binds': [`${absolutePath}/Ethereum/network${networkid}/:/opt/bootnode`],
        "NetworkMode" : `${docker_net}`
      },
      ExposedPorts:{
        "8710/tcp":{}
      },
      User:""
    }, (err,stream)=>{
      if(err){
        console.error(`Docker error when creating bootNode enode container:${networkid}` + err);
        reject(err);
      }else {
        console.log(`Docker container bootNode enode created:${networkid}`);
        resolve(stream);
      }
    })
  })
}

function startContainer(containerid){
  return new Promise((resolve, reject)=> {
    const container = docker.getContainer(containerid)
    container.start(function(err, data) {
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when starting container:${containerid}` + err);
        reject(err);
      }else {
        console.log(`Docker container started:${containerid}`);
        resolve(stream);
      }
    });
  })
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.warn(error);
      reject(error)
    }
    resolve(stdout? stdout : stderr);
    });
  });
}

function execCommandContainer(containerid){
  return new Promise((resolve, reject)=>{
    const container = docker.getContainer(containerid)
    container.start(function(err, data) {
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when starting container:${containerid}` + err);
        reject(err);
      }else {
        console.log(`Docker container started:${containerid}`);
        resolve(stream);
      }
    });
  })
}

function listContainer() {
  return new Promise((resolve, reject) => {
    docker.listContainers({'all':true}, (error, list) => {
      if(error) {
        reject(error)
      } else {
        resolve(list)
      }
    })
  }) 
}

module.exports = {
  pullImage,
  createContainerBootNodeKey,
  startContainer,
  createContainerBootNodeEnode,
  execShellCommand,
  createContainerNode,
  createNodeNetwork,
  execCommandContainer,
  launchNode,
  listContainer,
  imageAlreadyOnServer,
  getImage,
  createDockerNETWORK
}