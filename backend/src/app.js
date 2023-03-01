// https://expressjs.com/
const express = require("express") 
// https://expressjs.com/en/resources/middleware/cors.html
const cors = require("cors") 
// https://expressjs.com/en/resources/middleware/morgan.html
const morgan = require("morgan")
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log("Listening ", PORT)
})

const networks = require("./router-network")

app.use(morgan('combined'))
app.use(cors())

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/network", networks)

// ruta not found
app.use("*", (req, res) =>{
    res.status(404).send("NOT FOUND ")
})

