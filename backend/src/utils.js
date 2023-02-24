const fs = require('fs')

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

module.exports = {
    readFile,
    writeFile,
    readdirec
}