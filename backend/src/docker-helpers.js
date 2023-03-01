var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
const fs = require("fs")
const {resolve} = require('path')

const absolutePath = resolve('');

const { exec } = require('child_process');

function pullImage(imageId){
    return new Promise((resolve, reject)=>{
        docker.pull(imageId,{"disable-content-trust":"false"},(err,stream)=>{
            if(err){
                console.error("Docker pull failed for:" + imageId + "error:" + err);
                reject(err);
            }else {
                console.log("Docker image installed: " + imageId);
                resolve(stream);
            }
        })
    })
}

function createNodeNetwork(imageId, accountName, data_dir, networkid){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: accountName,
      Cmd: ["--datadir", `/codecrypto/network${networkid}/node1`, "init", `/codecrypto/network${networkid}/genesis.json`],
      'Volumes': {
        '/codecrypto': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/Ethereum/network${networkid}:/codecrypto/network${networkid}`]
      },
      //User:"`$(id -u $UID):$(id -g $UID)`"
      User:"1000:1000"
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when creating node initializarion on networkid:${networkid} ` + err);
        reject(err);
      }else {
        console.log(`Docker node initialization created on network:${networkid}`);
        resolve(stream);
      }
    })
  })
}

//docker run -it -u $(id -u $UID):$(id -g $UID) 
// -p {exposed}:8541
// -p {exposed}:30031 
// -v ${absolutePath}/ETH-private-NET/backend/src/Ethereum:/codecrypto ethereum/client-go 
// --networkid "{networkid}" 
// --ipcpath "\\.\pipe\geth{networkid}-{nodeid}.ipc" 
// --datadir /codecrypto/network{id}/node1 
// --syncmode full 
// --http 
// --http.api admin,eth,miner,net,txpool,personal 
// --http.addr 0.0.0.0 
// --http.port 8541  
// --http.corsdomain "*" 
// --allow-insecure-unlock 
// --unlock 0x{45ffb6e1ad014bdb230dae7735085e4f09adae9c} 
// --password /codecrypto/network{id}/node1/pwd.txt 
// --mine 
// --port 30031 
// --bootnodes "{enode://07b81ea8d5fa868348b8bd0e724dc5ec6e911ebbc773d815ab5c22bfc81f394a3fe942fe5b1409a431b27ba705171a066b1d63b0e8cb2ac5e6dfb57c09b78cb1@172.17.0.3:{bootnodeExposedPort}"
// --miner.etherbase 0x4187495fb415468d0622ebec0f7dca70fa6c1ec0

function launchNode(accountName, networkid, account, enode){
  var val1 = Math.floor(8710 + Math.random() * 20);
  var val2 = Math.floor(3001 + Math.random() * 20);
  const imageId = 'ethereum/client-go:stable'
  const cmd = [ "--networkid", networkid.toString() , 
                "--ipcpath",`\\\\.\\pipe\\geth${networkid}-${networkid}.ipc`, 
                "--datadir", `/codecrypto/network${networkid}/node1`,
                "--syncmode","full",
                "--http",
                "--dev",
                "--http.api","admin,eth,miner,net,txpool,personal",
                "--http.addr","0.0.0.0",
                "--http.port","8541",
                "--http.corsdomain",'"'+'*'+'"',
                "--allow-insecure-unlock",
                "--unlock",`0X${account}`,
                "--password",`/codecrypto/network${networkid}/node1/pwd.txt`,
                "--mine",
                "--port","30031",
                "--bootnodes",enode,
                "--miner.etherbase",`0X${account}`
              ]

  const options =  {
                      "name": accountName,
                      "Volumes": {
                        '/codecrypto': {}
                      },
                      "HostConfig": {
                        'Binds': [`${absolutePath}/Ethereum:/codecrypto`],
                        'PortBindings' : {
                          "8541/tcp" : [{"HostPort": val1.toString()}],
                          "30031/tcp" : [{"HostPort": val2.toString()}]
                        },
                      },
                      "ExposedPorts":{
                        "8541/tcp":{},
                        "30031/tcp":{}
                      },
                      "User":"1000:1000"
                    }          
  return new Promise((resolve, reject)=>{
    console.log("launching node cmd into promise: " + cmd + " ")
    docker.run(imageId, cmd, [
      process.stdout,
      process.stderr
    ], options, function (err, data, container) {
      console.log("dasdsdsdddddddddddddddddddddddddddd")
      if (err) {
        console.error(`@@@@@@@@@@@@@@@@@@@@ Error when launching Blockchain node on networkid:${networkid} @@@@@@@@@@@@@@@@@@@@@` + err);
        //reject(err)
        return console.error(err);
      } else {
        if (data.StatusCode === '0') {
          console.log(`******************** Blockchain launched on network:${networkid} **************************`);
          resolve()
        } else {
          console.error(`@@@@@@@@@@@@@@@@@@@@ Error when launching Blockchain node on networkid:${networkid} @@@@@@@@@@@@@@@@@@@@@` + err);
          reject('Container exit code: ' + data.StatusCode)
        }
      } 
    })
  })
}


/*function createNetwork(imageId, networkID){
    return new Promise((resolve, reject)=>{
        docker.run(imageId, ["--networkid", networkID, "--http", "--http.addr", "0.0.0.0", "--http.api", "eth,web3,net,admin,personal", "--http.corsdomain"
        //docker.run(imageId, ["version"
          ,"*"], process.stdout, {
            "name": 'geth',
            'ExposedPorts': {
              '9090/tcp': {}
            },
            'Hostconfig': {
              'Binds': ['/home/vagrant:/stuff'],
            }
          }, function(err, data, container) {
            if (err){
              return console.error(err);
            }
            console.log(data.StatusCode);
          });
    })    
}*/

function a(imageId, accountName, data_dir, networkid){
  //return new Promise((resolve, reject)=>{
      const pwd = fs.readFileSync(`${data_dir}/pwd.txt`)
      
      docker.createContainer({
        Image: imageId,
        name: accountName,
        Cmd: ["--datadir", "/codecrypto", "account", "new", "--password", "/codecrypto/pwd.txt"],
        'Volumes': {
          '/codecrypto': {}
        },
        'HostConfig': {
          'Binds': [`${absolutePath}/Ethereum/network${networkid}:/codecrypto:rw`]
        },
        User:'1000:1000'
      }, function(err, container) {
        container.attach({
          stream: true,
          stdout: true,
          stderr: true,
          tty: true
        }, function(err, stream) {

          stream.pipe(process.stdout);
          container.start(function(err, data) {
            //console.log(data);
          });
        
        });
      });
  //})    
}


function generateBootNodeBootKey(imageId, networkid){
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
        },
        //User:'1000:1000'
      },(err,stream)=>{
        if(err){
          console.error(`Docker error when creating(createContainer) bootkey on networkid:${networkid} ` + err);
          reject(err);
        }else {
          console.log(`Docker bootkey created(createContainer) on network:${networkid}`);
          resolve(stream);
        }
      }), function(err, container) {
        container.attach({
          stream: true,
          stdout: true,
          stderr: true,
          tty: true
        },(err,stream)=>{
          if(err){
            console.error(`Docker error when creating(attach) bootkey on networkid:${networkid}` + err);
            reject(err);
          }else {
            console.log(`Docker bootkey created(attach) on network:${networkid}`);
            resolve(stream);
          }
        }), function(err, stream) {
          stream.pipe(process.stdout);
          container.start(function(err, data) {

          },(err,stream)=>{
            if(err){
              console.error(`Docker error when creating(start) bootkey on networkid:${networkid}` + err);
              reject(err);
            }else {
              console.log(`Docker bootkey created(start) on network:${networkid}`);
              resolve(stream);
            }
          });
        }
      }
      
  });
}


function createContainerNode(imageId, accountName, data_dir, networkid){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: accountName,
      Cmd: ["--password", "/codecrypto/pwd.txt", "account", "new", "--datadir", "/codecrypto"],
      'Volumes': {
        '/codecrypto': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/Ethereum/network${networkid}/node1:/codecrypto:rw`]
      },
      User:'1000:1000'
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when creating node on networkid:${networkid} ` + err);
        reject(err);
      }else {
        console.log(`Docker node created  on network:${networkid}`);
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
      },
      //User:'1000:1000'
    },(err,stream)=>{
      if(err){
        console.error(`Docker error when creating BootNodeKey on networkid:${networkid} ` + err);
        reject(err);
      }else {
        console.log(`Docker BootNodeKey created  on network:${networkid}`);
        resolve(stream);
      }
    })
  })
}



function createContainerBootNodeEnode(imageId, networkid, enodePort){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: 'bootnode_'+'enode'+'_network_'+networkid,
      Cmd: ["bootnode", "--nodekey", "/opt/bootnode/boot.key", "--verbosity", "3", "-addr", ":"+enodePort],
      'Volumes': {
        '/opt/bootnode': {}
      },
      'HostConfig': {
        'PortBindings' : {"8010/tcp" : [{"HostPort": enodePort.toString()}]},
        'Binds': [`${absolutePath}/Ethereum/network${networkid}/:/opt/bootnode`]
      },
      ExposedPorts:{
        "8010/tcp":{}
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
       // console.log(list)
        resolve(list)
      }
    })
  }) 
}

module.exports = {
  pullImage,
  //createNetwork,
  a,
  generateBootNodeBootKey,
  generateBootNodeBootKey,
  createContainerBootNodeKey,
  startContainer,
  createContainerBootNodeEnode,
  execShellCommand,
  createContainerNode,
  createNodeNetwork,
  execCommandContainer,
  launchNode,
  listContainer
}