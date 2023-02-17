var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

function pullImage(imageId){
    return new Promise((resolve, reject)=>{
        docker.pull(imageId,{"disable-content-trust":"false"},(err,stream)=>{
            if(err){
                console.error("Docker pull failed for:" + imageId + "error:" + err);
                reject(err);
            }else {
                console.log("Docker image installed: " + imageId);
                resolve(true);
            }
        })
    })
}

module.exports = {
    pullImage
}