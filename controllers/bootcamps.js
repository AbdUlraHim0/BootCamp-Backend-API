const Bootcamp = require("../models/Bootcamp.js")

// @description   Get all bootcamps
//@route          GET /api/v1/bootcamps
//access          Public
exports.getBootcamps = async (req, res, next) => {
  const bootcamps = await Bootcamp.find()

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps })
}

// @description   Get single bootcamps
//@route          GET /api/v1/bootcamps/:id
//access          Public
exports.getBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return res.status(400).json({ success: false })
  }
  res.status(200).json({ success: true, data: bootcamp })
}

// @description   create a new bootcamp
//@route          POST /api/v1/bootcamps
//access          Private
exports.createBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({ success: true, data: bootcamp })
}

// @description   update a bootcamp
//@route          PUT /api/v1/bootcamps/:id
//access          Private
exports.updateBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!bootcamp) {
    return res.status(400).json({ success: false })
  }
  res.status(200).json({ success: true, data: bootcamp })
}

// @description   delete a bootcamp
//@route          DELETE /api/v1/bootcamps/:id
//access          Private
exports.deleteBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findOneAndDelete(req.params.id)

  if (!bootcamp) {
    return res.status(400).json({ success: false })
  }

  res.status(200).json({ success: true, data: {} })
}
