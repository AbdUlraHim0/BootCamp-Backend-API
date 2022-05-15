const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const fileupload = require("express-fileupload")
const path = require("path")
dotenv.config({ path: "./config/config.env" })
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const expressLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")

const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require("./routes/auth")
const users = require("./routes/users")
const reviews = require("./routes/reviews")

const connectDB = require("./config/DB")
const errorHandler = require("./middleware/errorMiddleware")

// Connect to database
connectDB()

const app = express()

// Body Parser
app.use(express.json())

app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(fileupload())

// Sanitize data to prevent noSQL Injection
app.use(mongoSanitize())

// Security Headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

//Rate Limiting
const limiter = expressLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100,
})

app.use(limiter)

// prevent http param pollution
app.use(hpp())

// Enable Cors
app.use(cors())

app.use(express.static(path.join(__dirname, "public")))

app.use("/api/v1/bootcamps", bootcamps)
app.use("/api/v1/courses", courses)
app.use("/api/v1/auth", auth)
app.use("/api/v1/users", users)
app.use("/api/v1/reviews", reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server Listening on ${PORT} `))
