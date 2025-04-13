import { FormData } from '../types/formData';
import SHA256 from 'crypto-js/sha256';

export const registerUser = async (formData: Omit<FormData, 'confirmPassword'>) => {
  try {
    debugger;
    let hashed = SHA256(formData.password).toString();

    const response = await fetch('https://0.0.0.0:88/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserTypeID: 1, // temp
        firstName: formData.firstName,
        lastName: formData.lastName,
        agencyName: formData.agencyName,
        phoneNo: formData.phoneNo,
        gender: formData.gender, // 1=male, 2=female, 0=other
        email: formData.email,
        password: SHA256(formData.password).toString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
    // return responseObj;
    return await response.json();
  } catch (error) {
    //throw error instanceof Error ? error : new Error('Unknown error');
    throw error;
  }
};

export const signIn = async (formData: FormData) => {
  try {
    
    const response = await fetch('https://0.0.0.0:88/api/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: SHA256(formData.password).toString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }
    // return responseObj;
    return await response.json();
  } catch (error) {
    //throw error instanceof Error ? error : new Error('Unknown error');
    throw error;
  }
};