import React from 'react';
import PropertyList from '../components/PropertyList';
import { PropertyFilter } from '../components/PropertyFilter';

const SearchProperty = () => {
  return (
    <div>
      <PropertyFilter />
      <PropertyList useContextFilter={true} />
    </div>
  );
};

export default SearchProperty;