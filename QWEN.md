# QWEN.md - n8n Goldylocks Node Project Context

## Project Overview

This is a custom n8n node package called `n8n-nodes-goldylocks` that provides integration with the Goldylocks ERP system. The project is built using TypeScript and follows the n8n node development guidelines. It allows n8n workflows to interact with Goldylocks ERP data including customers, items, documents, and document lines.

### Key Features

- **Customer Management**: Create, update, get, delete, and list customers
- **Item Management**: Create, update, get, delete, and list items with detailed fields like price, tax, family ID
- **Document Management**: Create, get, list, and anul (cancel) documents
- **Document Line Management**: Create, get, delete document lines with quantity and pricing information

### Project Structure

```
n8n-goldylocks-node/
├── credentials/
│   └── GoldylocksApi.credentials.ts (API credentials configuration)
├── nodes/
│   └── Goldylocks/
│       ├── Goldylocks.node.ts (Main node implementation)
│       └── goldylocks.svg (Node icon)
├── dist/ (compiled output)
├── package.json (Project metadata and dependencies)
├── tsconfig.json (TypeScript configuration)
├── .eslintrc.js (ESLint configuration)
├── .prettierrc.js (Prettier formatting configuration)
└── gulpfile.js (Build tasks for icons)
```

### Technical Details

- **Language**: TypeScript
- **Target**: n8n workflow automation platform
- **Authentication**: API key-based authentication with base URL configuration
- **API Documentation**: Available at `https://app.goldylocks.pt/empresademonstrativa/api/`
- **Node Version**: Minimum Node 20.x required

### Building and Running

To build and use this node package:

1. **Prerequisites**:
   - Node.js (>=20.15)
   - npm
   - n8n installed globally: `npm install n8n -g`

2. **Development Setup**:
   ```bash
   # Install dependencies
   npm install
   
   # Build the project (compiles TypeScript to JavaScript)
   npm run build
   
   # Watch for changes during development
   npm run dev
   
   # Lint the code
   npm run lint
   
   # Fix linting issues
   npm run lintfix
   ```

3. **Testing Locally**:
   - After building, the node can be tested in a local n8n instance
   - Follow n8n's guide for testing nodes locally

4. **Code Formatting**:
   - Format code using Prettier: `npm run format`

### Development Conventions

- **TypeScript**: All code is written in TypeScript with strict type checking
- **ESLint**: Code follows n8n's ESLint rules via `eslint-plugin-n8n-nodes-base`
- **Modular Design**: Node logic is separated into different sections for each resource
- **Error Handling**: Proper error handling with `NodeOperationError` and continue-on-fail support
- **Documentation**: All fields and operations have descriptive documentation for n8n UI

### Node Capabilities

The Goldylocks node supports the following resources and operations:

#### Items
- **Operations**: Create/Update (upsert), Delete, Get, Get All
- **Fields**: Barcode ID, name, family ID, cost price, tax, price line 1, type (Product/Service/Other)
- **Filters**: Search text (p), active status (activos), family ID (f) for Get All

#### Customers
- **Operations**: Create/Update (upsert), Delete, Get, Get All
- **Fields**: Name, tax ID (NIF), address, postal code, email, mobile phone
- **Filters**: Search text (p) for Get All

#### Documents
- **Operations**: Create, Get, Get All, Anul (cancel)
- **Create fields**: Customer ID, document type, document series
- **Filters**: Status (estado), customer ID (p), date range (data_inicial/data_final)

#### Document Lines
- **Operations**: Create, Delete, Get All from Document
- **Fields**: Document ID, item ID, quantity, price, discount

### Authentication

The node uses a credential type called `GoldylocksApi` that requires:
- Base URL: The API endpoint for the Goldylocks instance
- API Key: The authentication key for API access

The credentials include a test function that checks the connection by making a request to `/status/` endpoint.

### HTTP Request Handling

The node leverages n8n's `httpRequestWithAuthentication` helper method for all API calls, ensuring credentials are properly handled and secured.

### Deployment

To publish this node package:
1. Update the `package.json` with your details
2. Replace the README with documentation for your node
3. Publish the package to npm registry
4. Optionally submit to n8n for verification to be available on n8n cloud

### Current State

The project is currently in development with recent changes made to:
- The main node implementation file (`nodes/Goldylocks/Goldylocks.node.ts`)
- The credentials file (`credentials/GoldylocksApi.credentials.ts`)
- The package.json file (likely updating project metadata or dependencies)

The node appears to be fully functional with support for common ERP operations in the Goldylocks system.