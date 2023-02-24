var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
const fs = require("fs")
const {resolve} = require('path')

const absolutePath = resolve('');

//var stream = require('stream');

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

function createNetwork(imageId, networkID){
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
}

function createETHAccount(imageId, accountName, data_dir){
  return new Promise((resolve, reject)=>{
      const pwd = fs.readFileSync(`${data_dir}/pwd`)
      console.log(`dir node content password for node ${pwd}`)
      docker.run(imageId, ["--password", '/root/pwd', "account", "new"], process.stdout, {
          "name": accountName,
          'Volumes': {
            '/root': {}
          },
          'Binds': ['/${data_dir}:/root:rw']
        }, function(err, data, container) {
          if (err){
            return console.error(err);
          }
          console.log(data.StatusCode);
        });
  })    
}

function handleError (err) {
  if (err) {
    console.log(err);
  }
}

function a(imageId, accountName, data_dir, networkid){
  //return new Promise((resolve, reject)=>{
      const pwd = fs.readFileSync(`${data_dir}/pwd`)
      
      docker.createContainer({
        Image: imageId,
        name: accountName,
        Cmd: ["--password", "/root/pwd", "account", "new", "--datadir", "/root"],
        'Volumes': {
          '/root': {}
        },
        'HostConfig': {
          'Binds': [`${absolutePath}/ETH/eth${networkid}/nodo1:/root:rw`]
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

/*function generateBootNodeBootKey(imageId, networkid){
  return new Promise((resolve, reject)=>{
      docker.createContainer({
        Image: imageId,
        name: 'bootnode_'+'genkey'+'_'+'network'+'_'+networkid,
        Cmd: ["bootnode", "--genkey", "/opt/bootnode/boot.key"],
        'Volumes': {
          '/opt/bootnode': {}
        },
        'HostConfig': {
          'Binds': [`${absolutePath}/ETH/network${networkid}/:/opt/bootnode`]
        },
        //User:'1000:1000'
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
          
          if(err){
            console.error(`Docker error when creating bootkey on networkid:${networkid}` + err);
            reject(err)
          }else {
              console.log(`Docker bootkey created on network:${networkid}`);
              resolve(container);
          }

        });

      });
      
  });
}*/


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
          'Binds': [`${absolutePath}/ETH/network${networkid}/:/opt/bootnode`]
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



/*function generateBootNodeBootKey(imageId, networkid){
  return new Promise((resolve, reject)=>{
      docker.createContainer({
        Image: imageId,
        name: 'bootnode_'+'genkey'+'_'+'network'+'_'+networkid,
        Cmd: ["bootnode", "--genkey", "/opt/bootnode/boot.key"],
        'Volumes': {
          '/opt/bootnode': {}
        },
        'HostConfig': {
          'Binds': [`${absolutePath}/ETH/network${networkid}/:/opt/bootnode`]
        },
        //User:'1000:1000'
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
          
          if(err){
            console.error(`Docker error when creating bootkey on networkid:${networkid}` + err);
            reject(err)
          }else {
              console.log(`Docker bootkey created on network:${networkid}`);
              resolve(container);
          }

        });

      });
      
  });
}*/

function createContainerNode(imageId, accountName, data_dir, networkid){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: accountName,
      Cmd: ["--password", "/root/pwd", "account", "new", "--datadir", "/root"],
      'Volumes': {
        '/root': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/ETH/eth${networkid}/nodo1:/root:rw`]
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
        'Binds': [`${absolutePath}/ETH/network${networkid}/:/opt/bootnode`]
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

function createContainerBootNodeEnode(imageId, networkid){
  return new Promise((resolve, reject)=>{
    docker.createContainer({
      Image: imageId,
      name: 'bootnode_'+'enode'+'_network_'+networkid,
      Cmd: ["bootnode", "--nodekey", "/opt/bootnode/boot.key", "--verbosity", "3"],
      'Volumes': {
        '/opt/bootnode': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/ETH/network${networkid}/:/opt/bootnode`]
      },
      User:""
    },(err,stream)=>{
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

/*function getBootNodeAddress(imageId, networkid){
    docker.createContainer({
      Image: imageId,
      name: 'bootnode_'+'network_'+networkid,
      Cmd: ["bootnode", "--nodekey", "/opt/bootnode/boot.key", "--verbosity", "3"],
      'Volumes': {
        '/opt/bootnode': {}
      },
      'HostConfig': {
        'Binds': [`${absolutePath}/ETH/network${networkid}/:/opt/bootnode`]
      },
      User:""
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
}*/

/**
 * Get logs from running container
 */
/*function containerLogs(containerid) {

  // create a single stream for stdin and stdout
  var logStream = new stream.PassThrough();
  logStream.on('data', function(chunk){
    console.log(chunk.toString('utf8'));
  });

  container = docker.getContainer(containerid)
  console.log("container " + JSON.stringify(container))
  container.logs({
    follow: true,
    stdout: true,
    stderr: true
  }, function(err, stream){
    if(err) {
      console.log(err.message)
      return
    }
    container.modem.demuxStream(stream, logStream, logStream);
    stream.on('end', function(){
      logStream.end('!stop!');
    });

    setTimeout(function() {
      stream.destroy();
    }, 2000);
  });
}*/

function execScript(command){
  //./docker_scripts/getbootnodeurl.sh bootnode_network_9874
  exec(`sh ${command}`, (error, stdout, stderr) => {      
      if (stderr !== null) {
          console.log(`exec error: ${stderr}`);
      }
      console.log(stdout);
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

function getMyContainerLogs(containerName){
    const container = docker.getContainer(containerName)
    return container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      details: false,
      tail: 50,
      timestamps: true
    })
}

module.exports = {
  pullImage,
  createNetwork,
  createETHAccount,
  getMyContainerLogs,
  a,
  generateBootNodeBootKey,
  execScript,
  generateBootNodeBootKey,
  createContainerBootNodeKey,
  startContainer,
  createContainerBootNodeEnode,
  execShellCommand,
  createContainerNode
}