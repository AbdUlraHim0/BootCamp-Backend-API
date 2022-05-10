const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")

dotenv.config({ path: "./config/config.env" })

const bootcamps = require("./routes/bootcamps")
const connectDB = require("./config/DB")

// Connect to database
connectDB()

const app = express()

// Body Parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use("/api/v1/bootcamps", bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server Listening on ${PORT} `))
