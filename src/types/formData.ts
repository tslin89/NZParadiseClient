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