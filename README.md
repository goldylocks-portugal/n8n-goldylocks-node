![n8n.io - Workflow Automation](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-goldylocks

This repository contains a custom n8n node that integrates with the [Goldylocks ERP system](https://www.goldylocks.pt/). The node allows n8n workflows to interact with Goldylocks data including customers, items, documents, and document lines.

## Features

- **Customer Management**: Create, update, retrieve, delete, and list customers with fields like name, NIF, address, and contact information
- **Item Management**: Create, update, retrieve, delete, and list items with detailed attributes like barcode, name, price, tax, and family ID
- **Document Management**: Create, retrieve, list, and cancel documents with support for filtering by status and date range
- **Document Line Management**: Create, retrieve, and delete document lines with quantity and pricing information

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
  ```
  npm install n8n -g
  ```

## Installation

To use this node in your n8n instance:

1. Install the package in your n8n working directory:
   ```
   npm install n8n-nodes-goldylocks
   ```

2. Restart n8n to load the new node.

## Configuration

1. In n8n, go to Credentials and create a new "Goldylocks API" credential
2. Enter your Goldylocks instance Base URL (typically in the format `https://app.goldylocks.pt/yourcompany/api`)
3. Enter your API Key for authentication
4. Test the connection to ensure it's working properly

## Usage

This node supports multiple resources and operations:

### Items
- **Operations**: Create/Update (upsert), Delete, Get, Get All
- **Key fields**: Barcode ID (cod_barras), name (nome), family ID (familia), cost price (preco_custo), tax (imposto)
- **Filters**: Search text, active status, family ID for Get All operations

### Customers
- **Operations**: Create/Update (upsert), Delete, Get, Get All
- **Key fields**: Name (nome), tax ID (nif), address (morada), postal code (cp), email, mobile phone (telemovel)
- **Filters**: Search text for Get All operations

### Documents
- **Operations**: Create, Get, Get All, Anul (cancel)
- **Create fields**: Customer ID, document type, document series
- **Filters**: Status (Open/Finished/Anulled), customer ID, date range for Get All operations

### Document Lines
- **Operations**: Create, Delete, Get All from Document
- **Key fields**: Document ID, item ID, quantity, price, discount

## Development

If you want to contribute or modify this node:

1. Clone the repository:
   ```
   git clone https://github.com/goldylocks-portugal/n8n-goldylocks-node.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make your changes to the node definition in `nodes/Goldylocks/Goldylocks.node.ts`

4. Build the project:
   ```
   npm run build
   ```

5. Test your changes locally by linking the package to your n8n instance

## Contributing

If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

## Support

For support with this node, please open an issue in the GitHub repository. For Goldylocks ERP API questions, please contact Goldylocks support directly.
