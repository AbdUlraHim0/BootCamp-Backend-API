// @description   Get all bootcamps
//@route          GET /api/v1/bootcamps
//access          Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show al bootcamps" })
}

// @description   Get single bootcamps
//@route          GET /api/v1/bootcamps/:id
//access          Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `show bootcamp ${req.params.id}` })
}

// @description   create a new bootcamp
//@route          POST /api/v1/bootcamps
//access          Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, msg: "Create new bootcamp" })
}

// @description   update a bootcamp
//@route          PUT /api/v1/bootcamps/:id
//access          Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update bootcamp ${req.params.id}` })
}

// @description   delete a bootcamp
//@route          DELETE /api/v1/bootcamps/:id
//access          Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` })
}
