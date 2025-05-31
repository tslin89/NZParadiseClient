import { PropertyListModeEnum } from "./enums";

export interface UserData {
  userID?: number;
  firstName: string;
  lastName: string;
  agencyName: string;
  phoneNo: string;
  gender: number;
  email: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
}

export interface UserDataDisplay {
  userID: number;
  firstName: string;
  lastName: string;
  agencyName: string;
  phoneNo: string;
  gender: number;
  email: string;
  userTypeID: number;
  createdDate: string;
  propertyCount: number;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
  gender?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface RegisterPropertyFormData {
  description: string;
  price: number;
  location: string;
  bedroom: number;
  bathroom: number;
  parking: number;
  area: number;
  propertyFeatureIDs: string; // Comma-separated string, e.g., "1,2,3"
  availableFromDate: string | null; // Changed to string | null
  propertyTypeID: number;
  propertyType: {
    propertyTypeID: number;
  }
}

export interface PropertyType {
  propertyTypeID: number;
  description: string;
}

export interface PropertyFeature {
  propertyFeatureID: number;
  description: string;
}

export interface PropertyFilterData {
  userID: number | null;
  description: string | null;
  bedRoom: number | null;
  bathRoom: number | null;
  propertyTypeID: number | null;
  location: string | null;
  area: number | null;
  parking: number | null;
  mode: PropertyListModeEnum;
  minPrice: number | null;
  maxPrice: number | null;
}