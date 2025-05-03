export interface UserData {
  firstName: string;
  lastName: string;
  agencyName: string;
  phoneNo: string;
  gender: number;
  email: string;
  password: string;
  confirmPassword: string;
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
  bedRoom: number;
  bathRoom: number;
  parking: number;
  area: number;
  PropertyFeatureIDs: string; // Comma-separated string, e.g., "1,2,3"
  availableDate: string | null; // Changed to string | null
  propertyTypeID: number;
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
}