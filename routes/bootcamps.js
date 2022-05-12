const express = require("express")
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps")

const Bootcamp = require("../models/Bootcamp")
const advancedResults = require("../middleware/advancedResults")

const courseRoute = require("./courses")

const router = express.Router()

router.use("/:bootcampId/courses", courseRoute)

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)

router.route("/:id/photo").put(bootcampPhotoUpload)

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp)

router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router
