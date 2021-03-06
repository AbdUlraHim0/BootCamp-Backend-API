const path = require("path")
const Bootcamp = require("../models/Bootcamp.js")
const ErrorResponse = require("../utils/errorResponse.js")
const asyncHandler = require("../middleware/asyncHandlerMiddleware")
const geocoder = require("../utils/geocoder")

// @description   Get all bootcamps
//@route          GET /api/v1/bootcamps
//access          Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @description   Get single bootcamps
//@route          GET /api/v1/bootcamps/:id
//access          Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})

// @description   create a new bootcamp
//@route          POST /api/v1/bootcamps
//access          Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id

  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

  //if the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with Id ${req.user.id} has already published a bootcamp`,
        400
      )
    )
  }

  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({ success: true, data: bootcamp })
})

// @description   update a bootcamp
//@route          PUT /api/v1/bootcamps/:id
//access          Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    )
  }

  bootcamp = await Bootcamp.findById(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: bootcamp })
})

// @description   delete a bootcamp
//@route          DELETE /api/v1/bootcamps/:id
//access          Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    )
  }

  bootcamp.remove()

  res.status(200).json({ success: true, data: {} })
})

// @description   Get bootcamps within a radius
//@route          GET /api/v1/bootcamps/radius/:zipcode/:distance
//access          Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // get lat/lng from a geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //calc radius using radians
  //Divide dist by radius of Earth
  //Earth radius = 3.963 mi || 6.378 km

  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps })
})

// @description   upload a photo for bootcamp
//@route          PUT /api/v1/bootcamps/:id/photo
//access          Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    )
  }

  if (!req.files) {
    return next(new ErrorResponse("please upload a file", 400))
  }

  const file = req.files.file

  //make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("please upload an image file", 400))
  }

  //check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse("please upload an image less than 1 MB", 400))
  }

  //create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err)
      return next(new ErrorResponse("Problem with file upload", 500))
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({ success: true, data: file.name })
  })
})
