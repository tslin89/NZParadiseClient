
export interface ApiResponse {
  transactionID: string; // UUID as string
  status: number; // e.g., 1
  message: string; // e.g., "Found 6"
  data: Property[]; // Array of properties
}

// Property object
export interface Property {
  propertyID: number;
  userID: number;
  propertyTypeID: number;
  propertyTypeName: string;
  description: string;
  price: number; // Decimal
  location: string;
  bedroom: number;
  bathroom: number;
  parking: number;
  area: number; // Decimal
  propertyFeatureIDs: string; // Comma-separated string, e.g., "1,2,3"
  availableFromDate: string | null; // Nullable datetime
  status: number; // e.g., 0
  createdDate: string; // Datetime as ISO string
  modifiedDate: string | null; // Nullable datetime
  user: User; // Nested object
  //propertyType: PropertyType | null; // Nested object
  isInWishlist: boolean | false;
  attachments: Attachment[] | null;
}

// User object
export interface User {
  userID: number;
  userTypeID: number;
  firstName: string;
  lastName: string;
  agencyName: string;
  phoneNo: string;
  password: string; // Note: Consider omitting sensitive data in production
  gender: number; // e.g., 1 (consider enum or union like 0 | 1)
  email: string;
  createdDate: string; // Datetime as ISO string
  modifiedDate: string | null; // Nullable datetime
}

// PropertyType object
export interface PropertyType {
  propertyTypeID: number;
  description: string; // e.g., "Condominium"
}

export interface Message {
  messageDetails: string;
  date: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

// export interface MessageGroup {
//   property: Property;
//   messages: Message[];
// }

export interface Attachment {
  attachmentID: number;
  filePath: string;
}

export interface PropertyMessage {
  propertyID: number;
  propertyDesc: string;
  propertyImage: string;
  price: number;
  location: string;
  messageList: MessageDTO[];
}

export interface MessageDTO {
  fromUserID: number;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  messageDesc: string;
  createdDate: Date;
}