import express from "express";
import { Admin, Property } from "../db";
import jwt from "jsonwebtoken";
import { SECRET } from "../middleware/auth";
import { authenticateJwt } from "../middleware/auth";



const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  const user: any = req.headers["user"];
  const admin: any = await Admin.findOne({ username: user.username });
  if (!admin) {
    res.json({ message: "Admin does not exist" });
  }
  res.json({
    username: admin.username,
    id: admin._id,
  });
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin) {
      res.status(403).json({ message: "Admin already exists" });
    } else {
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();
      const token = jwt.sign({ username, role: "user" }, SECRET, {
        expiresIn: "24h",
      });
      res.json({ message: "Admin created successfully", token });
    }
  } catch (error: any) {
    // Zod validation error
    res
      .status(400)
      .json({ message: "Invalid input data", errors: error.errors });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.headers;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username, role: "admin" }, SECRET, {
        expiresIn: "24h",
      });
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(403).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid input" });
  }
});

router.post("/property", authenticateJwt, async (req, res) => {
  try {
    const user: any = req.headers["user"];
    const admin: any = await Admin.findOne({ username: user.username });
    const property = new Property(req.body);
    property.addedBy.push(admin._id);
    await property.save();
    admin.addedProperties.push(property);
    await admin.save();
    res.json({
      message: "Property details added successfully",
      id: property.id,
      addedby: property.addedBy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/property/:id", authenticateJwt, async (req, res) => {
  try {
    // Get the property to be updated by its ID
    const propertyId = req.params.id;
    const user: any = req.headers["user"];
    const admin: any = await Admin.findOne({ username: user.username });
    const property = await Property.findById(propertyId);

    // Check if the property exists
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the admin is the owner of the property
    const adminId = admin._id; // Assuming user information is in headers
    if (!property.addedBy.includes(adminId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this property" });
    }

    // Update the property details
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: req.body }, // Update with the request body
      { new: true }
    );

    if (updatedProperty) {
      return res.json({
        message: "Property details updated successfully",
        updatedProperty,
      });
    } else {
      return res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/list-properties", async (req, res) => {
  const properties = await Property.find({});
  res.json({ properties });
});

router.get("/list-filter-property", async (req, res) => {
  try {
    const filters = req.query; // Get the query parameters from the request
    console.log("Received filters:", filters);
    const properties = await filterProperties(filters);
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/my-properties", authenticateJwt, async (req, res) => {
  const user: any = req.headers["user"];
  const admin: any = await Admin.findOne({ username: user.username });
  const properties = await Property.find({ addedBy: admin._id });
  res.json({properties});
});

router.delete("/property/:id", authenticateJwt, async (req, res) => {
  try {
    // Get the property to be deleted by its ID
    const propertyId = req.params.id;
    const user: any = req.headers["user"]; // Assuming user information is in headers
    const admin: any = await Admin.findOne({ username: user.username });

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the admin is the owner of the property
    if (!property.addedBy.includes(admin._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this property" });
    }

    // Remove the property ID from the admin's addedProperties array
    await Admin.findByIdAndUpdate(admin._id, {
      $pull: { addedProperties: propertyId },
    });

    // Delete the property
    const deletedProperty = await Property.findByIdAndRemove(propertyId);
    const remainProperties = await Property.find({});

    if (deletedProperty) {
      return res.json({ message: "Property deleted successfully", remainProperties });
    } else {
      return res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



async function filterProperties(filters: any) {
  let query = Property.find({});

  if (filters.city) {
    query = query.where("city").equals(filters.city);
  }

  if (filters.availableFrom) {
    query = query.where("available_from").gte(filters.availableFrom);
  }

  if (filters.priceMin) {
    query = query.where("price").gte(filters.priceMin);
  }

  if (filters.priceMax) {
    query = query.where("price").lte(filters.priceMax);
  }

  if (filters.propertyType) {
    query = query.where("property_type").equals(filters.propertyType);
  }

  const properties = await query.exec();
  return properties;
}




export default router;
// module.exports = router   this way is used in javascript
