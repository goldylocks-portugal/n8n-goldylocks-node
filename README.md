![n8n.io - Workflow Automation](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-goldylocks

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-green)](https://docs.n8n.io/integrations/community-nodes/)

This repository contains an official n8n community node that integrates with the [Goldylocks ERP system](https://www.goldylocks.pt/), developed by Goldylocks Portugal. The node enables n8n workflows to interact with Goldylocks ERP data including customers, items, documents, and document lines.

## About Goldylocks ERP

[Goldylocks ERP](https://www.goldylocks.pt/) is a comprehensive enterprise resource planning solution developed by Goldylocks Portugal, a leading Portuguese software company specializing in business management solutions. The ERP system is designed to streamline business operations and enhance productivity for companies of various sizes across different industries.

Goldylocks ERP features include:
- Customer relationship management
- Inventory and product management
- Financial management and accounting
- Document management and invoicing
- Sales and purchase order processing
- Production planning and management
- Reporting and analytics

The Goldylocks ERP API enables seamless integration with third-party applications like n8n, allowing businesses to automate complex workflows and connect their business processes with other systems.

## Features

- **Customer Management**: Create, update, retrieve, delete, and list customers with fields like name, tax ID (NIF), address, and contact information
- **Item Management**: Create, update, retrieve, delete, and list items with detailed attributes like barcode, name, price, tax, and family ID
- **Document Management**: Create, retrieve, list, and cancel documents with support for filtering by status and date range
- **Document Line Management**: Create, retrieve, and delete document lines with quantity and pricing information
- **Email Operations**: Send emails with document templates directly from workflows
- **Family Management**: Create, edit, delete, get all families, retrieve family images/thumbnails, and get creation order with support for hierarchical organization

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
- **Operations**: Create, Get, Get All, Anul (cancel), Fechar Encomenda (close order), Change Document Status, Update Customer
- **Create fields**: Customer ID, document type, document series
- **Change Document Status fields**: Document ID, New Status ID, Show Print option
- **Update Customer fields**: Document ID, Customer data (ID, Name, Tax ID, Address, Postal Code, Email, Phone, Mobile Phone, Country, Country Code, Default Tax), Update Lines option
- **Filters**: Status (estado), customer ID (p), date range (data_inicial/data_final) for Get All operations

#### Document Lines
- **Operations**: Create, Delete, Get All from Document
- **Key fields**: Document ID, item ID, quantity, price, discount

#### Email
- **Operations**: Send emails with document templates
- **Fields**: Recipients, subject, message content, attachments

#### Families
- **Operations**: Create, Edit, Delete, Get All, Get Image/Thumbnail, Get Creation Order

**Create Family**
- **Fields**:
  - Family Name (d): The name of the new family
  - Parent Family ID (p): The ID of the parent family (0 for root families)
  - Family ID (id_familia): Optional custom ID for the family
  - Allow Duplicates (permitir_duplicadas): Whether to allow families with the same name in the same parent family (0 = no, 1 = yes)
  - Available in POS (disponivel_pos): Whether the family is available in Point of Sale (0 = no, 1 = yes)
- Creates a new family in the hierarchy with specified parameters

**Edit Family**
- **Fields**:
  - Family ID (id): The ID of the family to edit
  - New Family Name (f): The new name for the family (optional)
  - New Parent Family ID (fp): The new parent family ID (optional)
  - Available in POS (disponivel_pos): Whether the family is available in Point of Sale (0 = no, 1 = yes)
- Updates an existing family with new information

**Delete Family**
- **Fields**: Family ID (p)
- Removes a family from the system

**Get All Families**
- **Filters**:
  - Parent Family ID (p): Filter by parent family ID (0 for root families)
  - Available in POS (disponivel_pos): Filter by POS availability (true = available, false = not available)
- Retrieves a list of all families based on specified filters

**Get Family Image/Thumbnail**
- **Fields**:
  - Family ID (p): The ID of the family whose image is requested
  - Get as Thumbnail (thumbnail): Whether to retrieve as thumbnail (true = thumbnail, false = full size)
  - Get as Base64 (base64): Whether to retrieve image as base64 encoded string (optional)
- Retrieves the image associated with a family in the requested format

**Get Creation Order**
- No additional fields required
- Returns the order in which families should be created to maintain hierarchy

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

### Changing Document Status
1. Add the Goldylocks node to your workflow
2. Set Resource to "Document" and Operation to "Change Document Status"
3. Specify the Document ID and the New Status ID
4. Optionally set the Show Print option to display the document after status change
5. The node will update the document status accordingly

### Updating Customer Information for a Document
1. Add the Goldylocks node to your workflow
2. Set Resource to "Document" and Operation to "Update Customer"
3. Specify the Document ID
4. Fill in the customer data fields you want to update (ID, Name, Tax ID, Address, etc.)
5. Optionally set the Update Lines option to adapt Document Lines to Customer
6. The node will update the customer information for the specified document

### Managing Families
1. Add the Goldylocks node to your workflow
2. Set Resource to "Family" and select the appropriate Operation (Create, Edit, Get All, etc.)
3. Fill in the required fields based on the operation:
   - For Create: Provide Family Name (d) and Parent Family ID (p)
   - For Get All: Optionally specify filters like Parent Family ID (p)
4. The node will perform the specified family operation

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