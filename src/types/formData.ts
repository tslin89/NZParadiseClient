export interface FormData {
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
    propertyTypeID: number;
    PropertyFeatureIDs: string;
    availableDate: string | null;
    userID: number;
  }