const express = require("express")
const cors = require('cors');   // frontend to backend
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const product = require("./routes/product")
const user = require("./routes/user")

const app = express()
app.use(express.json())

app.get("/", (req,res) => {
    res.send("hello world 2")
})

app.get("/api", (req, res) => {
    res.json({ message: "Hello from RAsoft pys!" });
});


//app.use("/product", product)
//app.use("/user", user)

app.listen(process.env.PORT || 5000, () => {
    console.log("server")
})