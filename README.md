# NZParadise Client

NZParadise is a property rental web application built to help users discover rental properties, manage listings, and communicate with property owners. This repository contains the **React frontend** for the NZParadise application.

## Features

- **Browse and search rental properties** with filters for location, price range, property type, bedrooms, bathrooms, parking, and description.
- **Property details** with listing information, images, and location previews.
- **User accounts** with registration, sign-in, and profile editing.
- **Property management** to create, edit, and manage personal listings.
- **Wishlist** to save properties for later.
- **Messaging and enquiries** to contact property owners and view inbox messages.
- **User dashboard** with listing summary information.
- **User management** for administrator accounts.
- **Location search and map previews** powered by Google Maps APIs.
- **Responsive interface** built with Material UI.

## Tech Stack

- React
- TypeScript
- React Router
- Material UI (MUI)
- React Hook Form
- Google Maps JavaScript API / Places integration
- Fetch API for backend communication
- date-fns and MUI Date Pickers
- Recharts

## Screenshots

_Add screenshots to the repository and update the paths below._

<!-- Example:
![Property search](docs/images/property-search.png)
![Property details](docs/images/property-details.png)
-->

## Getting Started

### Prerequisites

- Node.js and npm
- The NZParadise backend API running
- A Google Maps API key with the required Maps/Places services enabled

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd NZParadiseClient
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

`REACT_APP_API_URL` should point to the backend API base address. The frontend appends `/api` when making API requests.

`REACT_APP_GOOGLE_MAPS_API_KEY` is used for Google Maps and Places functionality.

> Do not commit real credentials or API keys. Configure appropriate API key restrictions for your deployment.

### Run Locally

Start the development server:

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

The optimized production build is generated in the `build` directory.

### Tests

```bash
npm test
```

Runs the Create React App test runner.

## Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Property search and browsing | Public |
| `/search` | Property search and browsing | Public |
| `/property/:id` | Property details | Public |
| `/signup` | User registration | Public |
| `/signin` | User sign-in | Public |
| `/profile` | View profile | Authenticated |
| `/edit-profile` | Edit profile | Authenticated |
| `/mylistings` | Manage own property listings | Authenticated |
| `/register-property` | Create a property listing | Authenticated |
| `/edit-property/:id` | Edit a property listing | Authenticated |
| `/messages` | Inbox and enquiries | Authenticated |
| `/wishlist` | Saved properties | Authenticated |
| `/dashboard` | Dashboard summary | Authenticated |
| `/userlist` | User management | Authenticated / administrator |

## Project Structure

```text
src/
├── components/       # Shared UI, forms, context providers, route protection
├── config/          # Property-related configuration and options
├── pages/           # Page-level views and routes
├── services/        # API communication
├── theme/           # Material UI theme and component customizations
└── types/           # TypeScript types and enums
```

## Backend Integration

The frontend communicates with the NZParadise backend through API endpoints under the `/api` path. The API service layer (`src/services/api.ts`) centralizes requests for user accounts, property listings, wishlists, messaging, metadata, and dashboard data.

## Deployment

This project includes Azure Static Web Apps workflow configuration under `.github/workflows/` for deployment through GitHub Actions. Configure the required environment variables in your deployment environment before publishing.

## Team

This project was developed as part of an AUT Cloud Computing team project.

