import { UserData, PropertyFilterData, UserDataDisplay } from '../types/formData';
import SHA256 from 'crypto-js/sha256';
import { PropertyListModeEnum } from '../types/enums';
import { PropertyMessage } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_API_URL + '/api';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');

  if (!token) return {};

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = Date.now() >= payload.exp * 1000;

    if (isExpired) {
      console.warn('JWT expired, logging out');
      localStorage.removeItem('token');
      window.location.href = '/signin';
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  } catch {
    localStorage.removeItem('token');
    window.location.href = '/signin';
    return {};
  }
};

export const registerUser = async (formData: Omit<UserData, 'confirmPassword'>) => {
  try {
    const response = await fetch(API_BASE_URL + '/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserTypeID: 1, // Default to Member
        firstName: formData.firstName,
        lastName: formData.lastName,
        agencyName: formData.agencyName,
        phoneNo: formData.phoneNo,
        gender: formData.gender,
        email: formData.email,
        password: SHA256(formData.password || '').toString(),
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

export const updateUser = async (formData: Omit<UserData, 'confirmPassword'>) => {
  try {
    const response = await fetch(API_BASE_URL + `/user/${formData.userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        userID: formData.userID,
        UserTypeID: 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        agencyName: formData.agencyName,
        phoneNo: formData.phoneNo,
        gender: formData.gender,
        email: formData.email,
        password: formData.password ? SHA256(formData.password).toString() : 'qm6K0DKJqgKcac4P42flvijZ5I7wFe',
        currentPassword: formData.currentPassword ? SHA256(formData.currentPassword).toString() : 'NA',
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

export const signIn = async (formData: UserData) => {
  try {
    const response = await fetch(API_BASE_URL + '/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password ? SHA256(formData.password).toString() : ''
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

export const registerProperty = async (data: FormData) => {
  try {
    const response = await fetch(API_BASE_URL + '/property/register', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: data
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

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

export const updateProperty = async (propertyID: number, data: FormData) => {
  try {

    const response = await fetch(API_BASE_URL + `/property/${propertyID}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
      },
      body: data
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

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
    queryParams.append("mode", data.mode || PropertyListModeEnum.Search);
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
    if (data.minPrice && data.minPrice > 0) {
      queryParams.append("MinPrice", data.minPrice.toString());
    }
    if (data.maxPrice && data.maxPrice > 0) {
      queryParams.append("MaxPrice", data.maxPrice.toString())
    }

    const url = `${API_BASE_URL}/property/getlist${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

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

export const toggleWishlist = async (propertyID: number, userID: number, addToWishlist: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/property/toggleWishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        propertyID,
        userID,
        addToWishlist,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    return result.data;

  } catch (err) {
    console.error('toggleWishlist error:', err);
    throw err;
  }
};

export const getPropertyDetails = async (propertyID: number) => {

  try {
    const response = await fetch(`${API_BASE_URL}/property/${propertyID}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

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

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

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

export const submitMessage = async (userID: number, propertyID: number, messageDesc: string): Promise<boolean> => {
  try {

    const response = await fetch(`${API_BASE_URL}/message/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        propertyID,
        fromUserID: userID,
        messageDesc,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    return result;

  } catch (err) {
    console.error('Message submission error:', err);
    throw err;
  }
  //return true;
}

export const getMessageList = async (userID: number): Promise<{ data: PropertyMessage[] }> => {

  try {
    const response = await fetch(API_BASE_URL + `/message/getMessages/${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      } as HeadersInit,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

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

export const getUserList = async (adminUserID: number): Promise<{ data: UserDataDisplay[] }> => {

  try {
    const response = await fetch(API_BASE_URL + `/user/getList/${adminUserID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      } as HeadersInit,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Session expired. Redirecting...');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user list');
    }
    const result = await response.json();
    if (result.status === -1) {
      throw new Error(result.message || 'Failed to fetch user list');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteProperty = async (propertyID: number, userID: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/property/${propertyID}/user/${userID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      }
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json()

  } catch (err) {
    console.error('Message submission error:', err);
    throw err;
  }
}

export const fetchDashboardSummary = async (userID: number) => {
  try {
    const url = `${API_BASE_URL}/property/summary/${userID}`;

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
        `Failed to fetch dashboard data: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    //console.error('getPropertyList error:', error);
    //throw error;
  }
};
