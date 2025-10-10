![n8n.io - Workflow Automation](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-goldylocks

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-green)](https://docs.n8n.io/integrations/community-nodes/)

This repository contains an official n8n community node that integrates with the [Goldylocks ERP system](https://www.goldylocks.pt/). The node enables n8n workflows to interact with Goldylocks ERP data including customers, items, documents, and document lines.

## Features

- **Customer Management**: Create, update, retrieve, delete, and list customers with fields like name, tax ID (NIF), address, and contact information
- **Item Management**: Create, update, retrieve, delete, and list items with detailed attributes like barcode, name, price, tax, and family ID
- **Document Management**: Create, retrieve, list, and cancel documents with support for filtering by status and date range
- **Document Line Management**: Create, retrieve, and delete document lines with quantity and pricing information
- **Email Operations**: Send emails with document templates directly from workflows

### Supported Operations

#### Items
- **Operations**: Create/Update (upsert), Delete, Get, Get All
- **Key fields**: Barcode ID (cod_barras), name (nome), family ID (familia), cost price (preco_custo), tax (imposto), price line (psi1)
- **Filters**: Search text (p), active status (activos), family ID (f) for Get All operations

#### Customers
- **Operations**: Create/Update (upsert), Delete, Get, Get All
- **Key fields**: Name (nome), tax ID (nif), address (morada), postal code (cp), email, mobile phone (telemovel)
- **Filters**: Search text (p) for Get All operations

#### Documents
- **Operations**: Create, Get, Get All, Anul (cancel), Fechar Encomenda (close order)
- **Create fields**: Customer ID, document type, document series
- **Filters**: Status (estado), customer ID (p), date range (data_inicial/data_final) for Get All operations

#### Document Lines
- **Operations**: Create, Delete, Get All from Document
- **Key fields**: Document ID, item ID, quantity, price, discount

#### Email
- **Operations**: Send emails with document templates
- **Fields**: Recipients, subject, message content, attachments

## Prerequisites

You need the following installed on your n8n instance:

* [n8n](https://docs.n8n.io/getting-started/installation.html) version 1.0 or higher
* Valid Goldylocks ERP account with API access

## Installation

The node can be installed directly in your n8n instance:

1. In your n8n instance, go to Settings > Community Nodes
2. Search for "n8n-nodes-goldylocks"
3. Click Install
4. Restart n8n to load the new node

Alternatively, from the command line:

```bash
cd ~/.n8n/custom
npm install n8n-nodes-goldylocks
```

Then restart your n8n instance.

## Configuration

1. In n8n, go to Credentials and create a new "Goldylocks API" credential
2. Enter your Goldylocks instance Base URL (typically in the format `https://app.goldylocks.pt/yourcompany/api`)
3. Enter your API Key for authentication
4. Test the connection to ensure it's working properly

## Usage Examples

### Creating a Customer
1. Add the Goldylocks node to your workflow
2. Set Resource to "Customer" and Operation to "Create or Update"
3. Use an "Update Customer ID" field to specify the customer ID or leave empty to create new
4. Fill in the customer details in the Fields section

### Fetching Items
1. Add the Goldylocks node to your workflow
2. Set Resource to "Item" and Operation to "Get Many"
3. Optionally configure filters to narrow down results
4. Use "Return All" to fetch all matching items or set a "Limit"

### Creating a Document
1. Add the Goldylocks node to your workflow
2. Set Resource to "Document" and Operation to "Create"
3. Specify the Customer ID, Document Type ID, and Document Series
4. The node will return the new document ID

## Best Practices

- Always use appropriate error handling in your workflows
- For bulk operations, consider using the "Get Many" operations with appropriate limits
- Use the "Create or Update" operations to avoid duplicate entries
- When using date filters, ensure dates are in the correct format (YYYY-MM-DD)

## Development

To contribute to this node or run it locally:

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

5. Install the local node in your n8n instance:
   ```
   npm link
   cd ~/.n8n/custom
   npm link n8n-nodes-goldylocks
   ```

6. Restart your n8n instance

## Contributing

We welcome contributions to this node. Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

If you find any issues or have suggestions for improvements, please open an issue in the GitHub repository.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

## Support

For support with this node, please open an issue in the GitHub repository. For Goldylocks ERP API questions, please contact Goldylocks support directly.

## About n8n Community Nodes

This node was developed following n8n's community node standards and best practices. It has been reviewed and approved for the n8n community node directory.

For more information about n8n and community nodes, visit [n8n.io](https://n8n.io/).

---

**Disclaimer**: This is a community node not officially maintained by n8n GmbH. While efforts are made to maintain quality and compatibility, use at your own discretion.