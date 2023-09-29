import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';



// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = process.env.VITE_BASE_URL

interface Property {
  _id: string;
  city: string;
  locality: string,
  imageLink: string,
  available_from: string;
  price: number;
  property_type: string;
  property_name: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
}

const PropertyListing: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState({
    city: '',
    availableFrom: null,
    showPriceRange: false,
    price: { min: 0, max: 10000000 },
    propertyType: '',
  });

  useEffect(() => {
    // Fetch properties from the API based on filters
    axios.get(`${BASE_URL}/list-filter-property`, { params: filter }).then((response) => {
      setProperties(response.data.properties);
    });
  }, [filter]);

  const handleFilterChange = (key: string, value: any) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Fetching filtered properties when Apply is clicked
    axios.get(`${BASE_URL}/list-filter-property`, { params: filter }).then((response) => {
      setProperties(response.data.properties);
    });
  };

  return (
    <div className=" mx-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Property Listing Page</h1>

      {/* Filters */}
      <div className="flex justify-between w-full bg-gray-200 py-4 px-2">
            <div className="flex items-center">
                <label className="text-gray-600 mx-2">city:</label>
                <select
                    className="border rounded p-2"
                    value={filter.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                    {/* will implement options dynamically based on property types */}
                    <option value="">All</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    
                </select>
            </div>

            <div className="flex items-center">
                <label className="text-gray-600 ">Available from:</label>
                <DatePicker
                    className="border rounded p-2 w-20 "
                    selected={filter.availableFrom}
                    onChange={(date) => handleFilterChange('availableFrom', date)}
                />
            </div>

            <div className="relative flex items-center">
                <label className="text-gray-600 mx-2">Price Range:</label>
                <button
                    className="text-black focus:outline-none ml-2"
                    onClick={() => handleFilterChange('showPriceRange', !filter.showPriceRange)}
                >
                    {filter.showPriceRange ? 'Hide' : 'Show'}
                </button>
                {filter.showPriceRange && (
                <div className="absolute top-10 left-0 bg-white rounded-lg p-2 shadow-md">
                    {/* price range slider */}
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        value={filter.price.min}
                        onChange={(e) =>
                        handleFilterChange('price', { ...filter.price, min: parseInt(e.target.value) })
                        }
                    />
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        value={filter.price.max}
                        onChange={(e) =>
                        handleFilterChange('price', { ...filter.price, max: parseInt(e.target.value) })
                        }
                    />
                <div className="flex justify-between mt-2">
                    <span>{filter.price.min}</span>
                    <span>{filter.price.max}</span>
                </div>
               </div>
               )}
            </div>


            <div className="flex items-center">
            <label className="text-gray-600 ">Property Type:</label>
            <select
                className="border rounded p-2"
                value={filter.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
                {/* will implement options dynamically based on property types */}
                <option value="">All</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
               
            </select>
            </div>

            {/* Apply Button */}
            <div className="flex items-center ">
                <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mx-16 ml-16"
                onClick={handleApplyFilters}
                >
                Apply
                </button>
            </div>
      </div>

      {/* Property Listings */}
      <div className="flex flex-wrap justify-center">
        <h2 className="w-full text-xl font-semibold mb-2">Property Listings</h2>
        {properties.map((property) => (
          <div key={property._id} className="w-64 m-24 p-8">
            {/* Displaying property details */}
              
            <Card
                        style={{
                        margin: 10,
                        width: 400,
                        minHeight: 300, // Set a minimum height for the card
                        padding: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column', // Make the card's content stack in a column
                        justifyContent: 'space-between', // Align content vertically, buttons will be at the bottom
                        }}
                    >
                    <div>
                       <div className="flex justify-center items-center mb-4">
                        <div style={{ height: 300, width: 300, overflow: 'hidden', borderRadius: 8, marginTop: 20}}>
                            <img
                            src={property.imageLink}
                            alt={property.property_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                       </div>
                        <Typography variant='h6' align="left" color="blue" gutterBottom>
                                <p> Rs {property.price}</p>
                        </Typography>
                        <Typography variant="h6" align="left" gutterBottom>
                                {property.property_name}
                        </Typography>
                        <Typography variant="subtitle1" align="left" color="gray" gutterBottom>
                                {property.locality}, {property.city}, India
                        </Typography>
                        <Divider variant="middle" />
                        <Typography variant="subtitle1" align="center" gutterBottom>
                                {property.bedrooms} beds , {property.bathrooms} bathrooms, {property.area}
                        </Typography>
                    </div>
                    <div  className="flex justify-center mt-2">
                        
                    </div>
                </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyListing;
