import { FormData, RegisterPropertyFormData } from '../types/formData';
import SHA256 from 'crypto-js/sha256';

const API_BASE_URL = 'https://0.0.0.0:88/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (formData: Omit<FormData, 'confirmPassword'>) => {
  try {
    // hashedPwd = SHA256(formData.password).toString();

    const response = await fetch(API_BASE_URL + '/user/register', {
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

export const registerProperty = async (data: RegisterPropertyFormData) => {
  try {
    const response = await fetch(API_BASE_URL + '/property/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // Include Authorization header with JWT
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to register new property: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPropertyMetadata = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/property/metadata', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      } as HeadersInit,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch property metadata');
    }
    const result = await response.json();
    if (result.status === -1) {
      throw new Error(result.message || 'Failed to fetch property metadata');
    }
    return result; // { transactionID, status, message, data: { propertyTypes, propertyFeatures } }
  } catch (error) {
    throw error;
  }
};
