import mongoose from 'mongoose';
//mongoose schemas
  
  const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    addedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
  });
  
  const propertySchema = new mongoose.Schema({
    city: String,
    locality: String,
    imageLink: String,
    available_from: String,
    price: Number,
    property_type: String,
    property_name: String,
    area: String,
    bedrooms: Number,
    bathrooms: Number,
    addedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }]
  });
  
export const Admin = mongoose.model('Admin', adminSchema);
export const Property = mongoose.model('Properties', propertySchema);

// module.exports = {
//     User,
//     Admin,
//     Course
// }