const http = require('http')
const { stringify } = require('querystring')

function optGet (port,path) {
    return {
        //socketPath:a,
        URL:'http://localhost',
        port:port,
        path:path,
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }
}

/*const optGet = {
    URL:'http://localhost',
    path:'/v1.41/containers/json',
    port:2375,
    method:'GET',
    headers:{'Content-Type':'application/json'},
}*/
    

function optPost (a,b,body) {
    const data = stringify(body)    
    console.log(data)  
    return {socketPath:a,path:b,method:'POST',headers:{'Content-Type':'application/json','Content-Length': Buffer.byteLength(data)}}
}
  
const callback = res => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', data => console.log(data));
    res.on('error', data => console.log(data));
}

function myCurlGet(a,b) {
//function myCurlGet() {
    return new Promise((resolve, reject) => {
        const clientRequest = http.request(optGet(a,b), callback)
        //const clientRequest = http.request(optGet, callback)
        clientRequest.end(function(error, result){
            if (error) {
                reject(error)
                return
            }
            return resolve([result])
        })
    })    
}

function myCurlPost(a,b,body) {
    return new Promise((resolve, reject) => {
        const clientRequest = http.request(optPost(a,b,body), (res) => {
            res.setEncoding('utf8')
            console.log("statusCode: ", res.statusCode);  
            console.log("headers: ", res.headers);

            res.on('data', (d) => {
                console.log(`d : ${d}`)
                process.stdout.write(d)
            })
        })
        //const clientRequest = http.request(optPost(a,b,body), callback)
        //clientRequest.write()
        clientRequest.end(function(error, result){
            if (error) {
                console.error(error)
                reject(error)
                return
            }
            return resolve([result])
        })
    })    
}

module.exports = {
    myCurlGet,
    myCurlPost
}