//require('dotenv').config()

const express = require('express')
const api = require("./routers/api")
const path = require("path")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard", "build", "index.html"))
})
app.use(express.static(path.join(__dirname, "dashboard", "build")));

app.use("/api", api)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})