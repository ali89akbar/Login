const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json());
app.use(cors());

const PORT = 5000;

app.get('/',(req,res)=>{
    res.send("Alive")
})




app.use("/auth",require("./routes/jwtAuth"))

app.use("/dashboard",require("./routes/dashboard"))
app.listen(PORT,()=>{
    console.log("App is Running")
})