const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const fileupload = require("express-fileupload")
const path = require("path")
dotenv.config({ path: "./config/config.env" })

const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const connectDB = require("./config/DB")
const errorHandler = require("./middleware/errorMiddleware")

// Connect to database
connectDB()

const app = express()

// Body Parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(fileupload())

app.use(express.static(path.join(__dirname, "public")))

app.use("/api/v1/bootcamps", bootcamps)
app.use("/api/v1/courses", courses)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server Listening on ${PORT} `))
