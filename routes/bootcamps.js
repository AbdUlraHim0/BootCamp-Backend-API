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

const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router.use("/:bootcampId/courses", courseRoute)

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload)

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp)

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp)

module.exports = router
