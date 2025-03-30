import React from "react";

interface Property {
  id: number;
  title: string;
  price: string;
  image: string;
}

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {properties.map((property) => (
        <div key={property.id} className="bg-white shadow-lg rounded-lg p-4">
          <img src={property.image} alt={property.title} className="w-full h-40 object-cover rounded" />
          <h3 className="text-lg font-semibold mt-2">{property.title}</h3>
          <p className="text-gray-600">{property.price}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
