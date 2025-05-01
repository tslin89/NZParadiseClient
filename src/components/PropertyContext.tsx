import React, { createContext, useState, useCallback } from 'react';
import { getPropertyMetadata } from '../services/api';
import { PropertyType, Property } from '../types/types';

interface PropertyContextType {
  propertyTypes: PropertyType[];
  fetchPropertyTypes: () => Promise<void>;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

export const PropertyContext = createContext<PropertyContextType>({
  propertyTypes: [],
  fetchPropertyTypes: async () => {},
  properties: [],
  setProperties: () => {},
});

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const fetchPropertyTypes = useCallback(async () => {
    try {
      const response = await getPropertyMetadata();
      setPropertyTypes(response.data.propertyTypes || []);
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  }, []);

  return (
    <PropertyContext.Provider value={{ propertyTypes, fetchPropertyTypes, properties, setProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};