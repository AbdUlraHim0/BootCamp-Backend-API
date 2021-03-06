const jwt = require("jsonwebtoken")
const asyncHandler = require("./asyncHandlerMiddleware")
const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/User")

// protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return next(new ErrorResponse("Not authrized", 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)

    req.user = await User.findById(decoded.id)

    next()
  } catch (error) {
    return next(new ErrorResponse("Not authrized", 401))
  }
})

// access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is un authorized`, 403)
      )
    }
    next()
  }
}
