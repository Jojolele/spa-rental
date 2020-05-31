const express = require("express");

const ApartmentController = require("../controllers/apartments");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, ApartmentController.createApartment);

router.put("/:id", checkAuth, extractFile, ApartmentController.updateApartment);

router.get("", ApartmentController.getApartments);

router.get("/:id", ApartmentController.getApartment);

router.delete("/:id", checkAuth, ApartmentController.deleteApartment);

module.exports = router;
