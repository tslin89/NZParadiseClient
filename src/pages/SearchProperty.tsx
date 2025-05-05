import React from 'react';
import PropertyList from '../components/PropertyList';
import { PropertyFilter } from '../components/PropertyFilter';
import { PropertyListModeEnum } from '../types/enums';

const SearchProperty = () => {
  return (
    <div>
      <PropertyFilter />
      <PropertyList mode={PropertyListModeEnum.Search} useContextFilter={true} />
    </div>
  );
};

export default SearchProperty;