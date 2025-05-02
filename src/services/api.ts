import { FormData } from '../types/formData';
import SHA256 from 'crypto-js/sha256';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    return await response.json(); // Returns { status, message, data: { token, user } }
  } catch (error) {
    throw error;
  }
};

export const registerProperty = async (data: {
  title: string;
  description: string;
  price: number;
  userID: number;
  userType: number;
}) => {
  try {
    const response = await fetch('https://0.0.0.0:88/api/property/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // Include Authorization header with JWT
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to register property');
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

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

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