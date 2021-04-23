const express = require("express")
const mongoose = require('mongoose')
const authRouter = require('./routes/auth/authRouter')
const userRouter = require('./routes/user/userRouter')
const latencyRouter = require('./routes/latency/latencyRouter')
require("dotenv").config()
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(authRouter)
app.use(userRouter)
app.use(latencyRouter)

const mongoURI = process.env.mongoURI
const mongoConnectionEssentials = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const start = async () => {
  try {
    await mongoose.connect(mongoURI, mongoConnectionEssentials)
    app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    })
  } catch(e) {
    console.log(e);
  }
}

start()