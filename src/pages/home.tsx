import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import PropertyList from "../components/PropertyList";

const LandingPage: React.FC = () => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = async (query: string, category: string, priceRange: string) => {
    try {
      const response = await fetch("https://api.example.com/properties"); // Replace with actual API
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  return (
    <div className="p-6">
      <FilterBar onSearch={fetchProperties} />
      <PropertyList properties={properties} />
    </div>
  );
};

export default LandingPage;
