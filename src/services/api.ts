import { UserData, RegisterPropertyFormData, PropertyFilterData } from '../types/formData';
import SHA256 from 'crypto-js/sha256';
import { MessageGroup } from '../types/types';
import { PropertyListModeEnum } from '../types/enums';

//const API_BASE_URL = 'https://0.0.0.0:88/api';
const API_BASE_URL = 'http://0.0.0.0:99/api';

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

export const signIn = async (formData: UserData) => {
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


// export const uploadPropertyImages = async (propertyID: number, files: File[]) => {
//   const formData = new FormData();
//   files.forEach(file => formData.append('files', file));
//   formData.append('parentID', propertyID.toString());
//   formData.append('parentType', 'Property');

//   const response = await fetch(`${API_BASE_URL}/attachment/upload-multiple`, {
//     method: 'POST',
//     headers: {
//       ...getAuthHeaders(),
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error('Image upload failed');
//   }

//   return await response.json();
//   return true;
// };

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

export const updateProperty = async (data: FormData) => {
  try {

    const response = await fetch(API_BASE_URL + '/property/update', {
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
        `Failed to update this property: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPropertyList = async (data: PropertyFilterData) => {

  console.log('getPropertyList', data)
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

export const toggleWishlist = async (propertyID: number, userID: number, addToWishlist: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/property/toggleWishlist`, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
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
    const response = await fetch(`${API_BASE_URL}/property/get/${propertyID}`, {
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


export const getMessageList = async (userID: number): Promise<{ data: MessageGroup[] }> => {
  return {
    data: [
      {
        property: {
          propertyID: 18,
          userID: 14,
          propertyTypeID: 1,
          description: "Modern Apartment in Auckland",
          price: 4200,
          location: "123 Queen Street, Auckland, NZ",
          bedRoom: 2,
          bathRoom: 1,
          parking: 1,
          area: 75.0,
          propertyFeatureIDs: "1,2,5",
          availableFromDate: "2025-05-10T00:00:00Z",
          status: 1,
          createdDate: "2025-05-01T12:00:00Z",
          modifiedDate: null,
          attachments: null,
          user: {
            userID: 14,
            userTypeID: 1,
            firstName: "Robin",
            lastName: "Hood",
            agencyName: "NZ Property Co.",
            phoneNo: "0987654321",
            password: "",
            gender: 1,
            email: "robin@example.com",
            createdDate: "2025-04-01T09:00:00Z",
            modifiedDate: null,
          },
          propertyType: {
            propertyTypeID: 1,
            description: "Apartment",
          },
          isInWishlist: null
        },
        messages: [
          {
            user: {
              firstName: "Alice",
              lastName: "Ng",
              email: "alice@example.com",
            },
            messageDetails: "'The quick brown fox jumps over the lazy dog' is an English-language pangram – a sentence that contains all the letters of the alphabet. The phrase is commonly used for touch-typing practice, testing typewriters and computer keyboards, displaying examples of fonts, and other applications involving text where the use of all letters in the alphabet is desired.",
            date: "2025-05-04T10:23:00Z",
          },
          {
            user: {
              firstName: "John",
              lastName: "Doe",
              email: "john@example.com",
            },
            messageDetails: "Can I visit next weekend?",
            date: "2025-05-05T11:12:00Z",
          },
        ],
      },
      {
        property: {
          propertyID: 24,
          userID: 14,
          propertyTypeID: 2,
          description: "Spacious Condo in Mount Eden",
          price: 5200,
          location: "88 Dominion Road, Mount Eden, Auckland",
          bedRoom: 3,
          bathRoom: 2,
          parking: 2,
          area: 110.0,
          propertyFeatureIDs: "3,4,6",
          availableFromDate: "2025-06-01T00:00:00Z",
          status: 1,
          createdDate: "2025-04-20T15:30:00Z",
          modifiedDate: null,
          attachments: null,
          user: {
            userID: 14,
            userTypeID: 1,
            firstName: "Robin",
            lastName: "Hood",
            agencyName: "NZ Property Co.",
            phoneNo: "0987654321",
            password: "",
            gender: 1,
            email: "robin@example.com",
            createdDate: "2025-04-01T09:00:00Z",
            modifiedDate: null,
          },
          propertyType: {
            propertyTypeID: 2,
            description: "Condominium",
          },
          isInWishlist: null
        },
        messages: [
          {
            user: {
              firstName: "Emily",
              lastName: "Tan",
              email: "emily@example.com",
            },
            messageDetails: "Can I bring a pet? I have a small dog.",
            date: "2025-05-06T08:45:00Z",
          },
          {
            user: {
              firstName: "Mark",
              lastName: "Lee",
              email: "mark@example.com",
            },
            messageDetails: "Is the rent negotiable for long-term stay?",
            date: "2025-05-07T14:10:00Z",
          },
          {
            user: {
              firstName: "Sophia",
              lastName: "Kaur",
              email: "sophia@example.com",
            },
            messageDetails: "Can I schedule a virtual tour?",
            date: "2025-05-08T17:55:00Z",
          },
        ],
      },
      {
        property: {
          propertyID: 23,
          userID: 14,
          propertyTypeID: 3,
          description: "Cozy Studio in Wellington CBD",
          price: 3000,
          location: "456 Lambton Quay, Wellington",
          bedRoom: 1,
          bathRoom: 1,
          parking: 0,
          area: 50.0,
          propertyFeatureIDs: "1,7",
          availableFromDate: "2025-05-15T00:00:00Z",
          status: 1,
          createdDate: "2025-04-25T09:00:00Z",
          modifiedDate: null,
          attachments: null,
          user: {
            userID: 14,
            userTypeID: 1,
            firstName: "Robin",
            lastName: "Hood",
            agencyName: "NZ Property Co.",
            phoneNo: "0987654321",
            password: "",
            gender: 1,
            email: "robin@example.com",
            createdDate: "2025-04-01T09:00:00Z",
            modifiedDate: null,
          },
          propertyType: {
            propertyTypeID: 3,
            description: "Studio",
          },
          isInWishlist: null
        },
        messages: [
          {
            user: {
              firstName: "David",
              lastName: "Chen",
              email: "david@example.com",
            },
            messageDetails: "I'm a student—any discount for 6-month lease?",
            date: "2025-05-09T12:30:00Z",
          },
        ],
      },
    ],
  };
};
