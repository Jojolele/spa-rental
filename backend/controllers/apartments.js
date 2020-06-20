const Apartment = require("../models/apartment");

exports.createApartment = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const apartment = new Apartment({
    title: req.body.title,
    address: req.body.address,
    price: req.body.price,
    phoneNumber: req.body.phoneNumber,
    bedroomCount: req.body.bedroomCount,
    bathroomCount: req.body.bathroomCount,
    kitchenCount: req.body.kitchenCount,
    garageCount: req.body.garageCount,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  apartment
    .save()
    .then((createdApartment) => {
      res.status(201).json({
        message: "Apartment added successfully!",
        apartment: {
          id: createdApartment._id,
          title: createdApartment.title,
          address: createdApartment.address,
          price: createdApartment.price,
          phoneNumber: createdApartment.phoneNumber,
          bedroomCount: createdApartment.bedroomCount,
          bathroomCount: createdApartment.bathroomCount,
          kitchenCount: createdApartment.kitchenCount,
          garageCount: createdApartment.garageCount,
          imagePath: createdApartment.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.updateApartment = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const apartment = new Apartment({
    _id: req.body.id,
    title: req.body.title,
    address: req.body.address,
    price: req.body.price,
    phoneNumber: req.body.phoneNumber,
    bedroomCount: req.body.bedroomCount,
    bathroomCount: req.body.bathroomCount,
    kitchenCount: req.body.kitchenCount,
    garageCount: req.body.garageCount,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Apartment.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    apartment
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.getApartments = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const apartmentQuery = Apartment.find();
  let fetchedApartments;
  if (pageSize && currentPage) {
    apartmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  apartmentQuery
    .then((documents) => {
      fetchedApartments = documents;
      return Apartment.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Apartments fetched successfully!",
        apartments: fetchedApartments,
        maxApartments: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getApartment = (req, res, next) => {
  Apartment.findById(req.params.id)
    .then((apartment) => {
      if (apartment) {
        res.status(200).json(apartment);
      } else {
        res.status(404).json({ message: "Apartment not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.deleteApartment = (req, res, next) => {
  Apartment.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};
