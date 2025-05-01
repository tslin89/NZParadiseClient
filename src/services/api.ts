import { FormData, RegisterPropertyFormData, PropertyFilterData } from '../types/formData';
import SHA256 from 'crypto-js/sha256';

const API_BASE_URL = 'https://0.0.0.0:88/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (formData: Omit<FormData, 'confirmPassword'>) => {
  try {
    const response = await fetch(API_BASE_URL + '/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserTypeID: 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        agencyName: formData.agencyName,
        phoneNo: formData.phoneNo,
        gender: formData.gender,
        email: formData.email,
        password: SHA256(formData.password).toString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const signIn = async (formData: FormData) => {
  try {
    const response = await fetch(API_BASE_URL + '/user/signin', {
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
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const registerProperty = async (data: RegisterPropertyFormData) => {
  try {
    const response = await fetch(API_BASE_URL + '/property/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
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

export const updateProperty = async (data: RegisterPropertyFormData) => {
  try {
    const response = await fetch(API_BASE_URL + '/property/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update this property: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPropertyList = async (data: PropertyFilterData) => {
  try {
    const queryParams = new URLSearchParams();
    if (data.userID !== undefined && data.userID !== null) {
      queryParams.append('UserID', data.userID.toString());
    }
    if (data.description) {
      queryParams.append('Description', data.description);
    }
    if (data.bedRoom) {
      queryParams.append('BedRoom', data.bedRoom.toString());
    }
    if (data.bathRoom) {
      queryParams.append('BathRoom', data.bathRoom.toString());
    }
    if (data.propertyTypeID) {
      queryParams.append('PropertyTypeID', data.propertyTypeID.toString());
    }
    if (data.location) {
      queryParams.append('Location', data.location);
    }
    if (data.parking) {
      queryParams.append('Parking', data.parking.toString());
    }

    const url = `${API_BASE_URL}/property/getlist${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('Fetching:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch property list: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('getPropertyList error:', error);
    throw error;
  }
};

export const getPropertyDetails = async (propertyID: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/property/get/${propertyID}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to register new property: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return await response.json();
  }
  catch (error) {
    throw error;
  }
}

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
    return result;
  } catch (error) {
    throw error;
  }
};