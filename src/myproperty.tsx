import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';



const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = process.env.VITE_BASE_URL


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

export const MyPropertyListing: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/my-properties`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Data received:', response.data.properties); // Debugging
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]); // Set properties as an empty array in case of an error
      }
    };
  
    fetchData(); // Call the async function
  }, []);
  
  

  const handleFilterChange = () => {
     };

  console.log(properties)
  return (
    <div className=" mx-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Properties Added by You</h1>

      {/* Filters */}
      <div className="flex justify-between w-full bg-gray-200 py-4 px-2">
            <div className="flex items-center">
                <label className="text-gray-600 mx-2">city:</label>
                <select
                    className="border rounded p-2"
                >
                    <option value="">All</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                </select>
            </div>
            <div className="flex items-center">
                <label className="text-gray-600 ">Available from:</label>
                <DatePicker
                    className="border rounded p-2 w-20 "
                    onChange={() => handleFilterChange()}
                />
            </div>
            <div className="relative flex items-center">
                <label className="text-gray-600 mx-2">Price Range:</label>
            
            </div>
            <div className="flex items-center">
            <label className="text-gray-600 ">Property Type:</label>
            <select
                className="border rounded p-2"
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
                >
                Apply
                </button>
            </div>
      </div>

      {/* Property Listings */}
      <div className="flex flex-wrap justify-center">
        <h2 className="w-full text-xl font-semibold mb-2">Property Listings</h2>
          
           
           
            {properties && properties.length > 0 ? (properties.map((property) => (
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
                            <Button variant="contained" size="large" onClick={async () => {
                                    try {
                                    const response = await axios.delete(`${BASE_URL}/property/${property._id}`, 
                                    {
                                        headers: {
                                        'content-type': 'application/json',
                                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                                        },
                                    });

                                    const data = response.data;
                                    const remainingProperties = data.remainProperties;
                                    console.log(remainingProperties);
                                    setProperties(remainingProperties);
                                    alert('Property deleted successfully!');
                                    } catch (error) {
                                    console.log(error);
                                    }
                                    }}
                            >
                            Delete
                            </Button>
                        </div>
                    </Card>
            </div>
        ))
        ) : (
            <p>No properties found.</p>
          ) 
        }
      </div>
    </div>
  );
};

