import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Goldylocks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Goldylocks',
		name: 'goldylocks',
		icon: 'file:goldylocks.svg', // You'll need to create this SVG icon
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Goldylocks ERP API',
		defaults: {
			name: 'Goldylocks',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'goldylocksApi',
				required: true,
			},
		],
		properties: [
			// ----------------------------------------
			//         RESOURCE SELECTOR
			// ----------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Document Line',
						value: 'documentLine',
					},
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'Family',
						value: 'familia',
					},
					{
						name: 'Item',
						value: 'item',
					},
				],
				default: 'item',
			},

			// ----------------------------------------
			//         OPERATIONS
			// ----------------------------------------
			// Item Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['item'],
					},
				},
				options: [
					{
						name: 'Create or Update',
						value: 'upsert',
						action: 'Create or update an item',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete an item',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get an item by ID',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many items',
					},
				],
				default: 'getAll',
			},
			// Customer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{
						name: 'Create or Update',
						value: 'upsert',
						action: 'Create or update a customer',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a customer',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a customer by ID',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many customers',
					},
				],
				default: 'getAll',
			},
			// Document Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Anular Documento',
						value: 'anul',
						action: 'Anular a documento',
					},
					{
						name: 'Change Document Status',
						value: 'changeStatus',
						action: 'Change the status of a document',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create a document',
					},
					{
						name: 'Fechar Encomenda',
						value: 'fecharEncomenda',
						action: 'Close an order',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get document details',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many documents',
					},
					{
						name: 'Update Customer',
						value: 'updateCustomer',
						action: 'Update customer information for a document',
					},
				],
				default: 'getAll',
			},
			// Document Line Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['documentLine'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a document line',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a document line',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many lines from a document',
					},
				],
				default: 'getAll',
			},
			// Email Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['email'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						action: 'Send an email',
					},
				],
				default: 'send',
			},
			// Family Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['familia'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a family',
					},
					{
						name: 'Edit',
						value: 'edit',
						action: 'Edit a family',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a family',
					},
					{
						name: 'Get All',
						value: 'getAll',
						action: 'Get all families',
					},
					{
						name: 'Get Image/Thumbnail',
						value: 'getImage',
						action: 'Get family image/thumbnail',
					},
					{
						name: 'Get Creation Order',
						value: 'getCreationOrder',
						action: 'Get family creation order',
					},
				],
				default: 'getAll',
			},

			// ----------------------------------------
			//         FIELDS FOR OPERATIONS
			// ----------------------------------------

			// ------------------ ITEM: GET ALL ------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Search Text (P)',
						name: 'p',
						type: 'string',
						default: '',
						description: 'Text to search in item code or name',
					},
					{
						displayName: 'Only Active (Activos)',
						name: 'activos',
						type: 'boolean',
						default: true,
						description: 'Whether to return only active items',
					},
					{
						displayName: 'Family ID (F)',
						name: 'f',
						type: 'string',
						default: '',
						description: 'Filter by family ID',
					},
				],
			},

			// ------------------ ITEM: GET / DELETE ------------------
			{
				displayName: 'Item ID (P)',
				name: 'itemId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['get', 'delete'],
					},
				},
				description: 'The barcode or internal ID of the item',
			},

			// ------------------ ITEM: UPSERT ------------------
			{
				displayName: 'Item ID (Cod_barras)',
				name: 'cod_barras',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['upsert'],
					},
				},
				description:
					'The unique barcode for the item. If an item with this ID exists, it will be updated.',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['upsert'],
					},
				},
				options: [
					{
						displayName: 'Cost Price (Preco_custo)',
						name: 'preco_custo',
						type: 'number',
						typeOptions: {
							numberPrecision: 5,
						},
						default: 0,
					},
					{
						displayName: 'Family ID (Familia)',
						name: 'familia',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Name (Nome)',
						name: 'nome',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Price Line 1 (Psi1)',
						name: 'psi1',
						type: 'number',
						typeOptions: {
							numberPrecision: 5,
						},
						default: 0,
						description: 'Price for line 1, without tax',
					},
					{
						displayName: 'Tax (Imposto)',
						name: 'imposto',
						type: 'string',
						default: 'IVA 23%',
						description: 'Full tax name, e.g., "IVA 23%"',
					},
					{
						displayName: 'Type (Tipo)',
						name: 'tipo',
						type: 'options',
						options: [
							{ name: 'Product', value: 'P' },
							{ name: 'Service', value: 'S' },
							{ name: 'Other', value: 'O' },
						],
						default: 'P',
					},
				],
			},

			// ------------------ CUSTOMER: GET ALL ------------------
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Search Text (P)',
						name: 'p',
						type: 'string',
						default: '',
						description: 'Text to search in customer fields',
					},
				],
			},

			// ------------------ CUSTOMER: GET / DELETE ------------------
			{
				displayName: 'Customer ID (P)',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['get', 'delete'],
					},
				},
				description: 'The ID of the customer',
			},

			// ------------------ CUSTOMER: UPSERT ------------------
			{
				displayName: 'Update Customer ID (P)',
				name: 'customerIdUpdate',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['upsert'],
					},
				},
				description: 'The ID of the customer to update. Leave empty to create a new one.',
			},
			{
				displayName: 'Fields',
				name: 'customerFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['upsert'],
					},
				},
				options: [
					{
						displayName: 'Address (Morada)',
						name: 'morada',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'name@email.com',
					},
					{
						displayName: 'Mobile Phone (Telemovel)',
						name: 'telemovel',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Name (Nome)',
						name: 'nome',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code (Cp)',
						name: 'cp',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Tax ID (Nif)',
						name: 'nif',
						type: 'string',
						default: '',
					},
				],
			},


			// ------------------ DOCUMENT: UPDATE CUSTOMER ------------------
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['updateCustomer'],
					},
				},
				description: 'The ID of the document for which to update customer information',
			},
			{
				displayName: 'Customer Data',
				name: 'customerData',
				type: 'collection',
				placeholder: 'Add Customer Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['updateCustomer'],
					},
				},
				options: [
					{
						displayName: 'Additional Address ID',
						name: 'id_morada_adicional',
						type: 'string',
						default: '0',
					},
					{
						displayName: 'Address',
						name: 'morada',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Address 2',
						name: 'morada2',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'pais',
						type: 'string',
						default: 'Portugal',
					},
					{
						displayName: 'Country Code',
						name: 'codigoPais',
						type: 'string',
						default: 'PT',
					},
					{
						displayName: 'Customer ID',
						name: 'id',
						type: 'string',
						default: '0',
						description: 'ID of customer, 0 to create new customer',
					},
					{
						displayName: 'Default Tax',
						name: 'imposto',
						type: 'string',
						default: 'IVA 23%',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'name@email.com',
					},
					{
						displayName: 'Mobile Phone',
						name: 'telemovel',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Name',
						name: 'nome',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'telefone',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code',
						name: 'cp',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Tax ID (NIF)',
						name: 'nif',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['updateCustomer'],
					},
				},
				options: [
					{
						displayName: 'Update Lines',
						name: 'alterarlinhas',
						type: 'boolean',
						default: false,
						description: 'Whether to adapt Document Lines to Customer',
					},
				],
			},

			// ------------------ DOCUMENT: GET ALL ------------------
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Status (Estado)',
						name: 'estado',
						type: 'options',
						options: [
							{ name: 'Open (O)', value: 'O' },
							{ name: 'Finished (F)', value: 'F' },
							{ name: 'Anulled (N)', value: 'N' },
						],
						default: 'O',
					},
					{
						displayName: 'Customer ID (P)',
						name: 'p',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Start Date (Data_inicial)',
						name: 'data_inicial',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'End Date (Data_final)',
						name: 'data_final',
						type: 'dateTime',
						default: '',
					},
				],
			},

			// ------------------ DOCUMENT: GET / ANUL ------------------
			{
				displayName: 'Document ID (P)',
				name: 'documentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'anul'],
					},
				},
				description: 'The internal ID of the document',
			},
			{
				displayName: 'Anulment Motive (M)',
				name: 'motive',
				type: 'string',
				required: true,
				default: 'Anulado via API',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['anul'],
					},
				},
				description: 'Reason for anulling the document',
			},

			// ------------------ DOCUMENT: CREATE ------------------
			{
				displayName: 'Customer ID (idCliente)',
				name: 'idCliente',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Document Type ID (Tipo_documento)',
				name: 'tipo_documento',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Document Serie (Serie_documento)',
				name: 'serie_documento',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['create'],
					},
				},
			},
			// ------------------ DOCUMENT: FECHAR ENCOMENDA ------------------
			{
				displayName: 'Document ID (P)',
				name: 'documentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['fecharEncomenda'],
					},
				},
				description: 'The internal ID of the document to close',
			},
			// ------------------ DOCUMENT: CHANGE STATUS ------------------
			{
				displayName: 'Document ID (P)',
				name: 'documentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['changeStatus'],
					},
				},
				description: 'The ID of the document to change status',
			},
			{
				displayName: 'New Status (Estado)',
				name: 'newStatus',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['changeStatus'],
					},
				},
				description: 'The new status ID to apply to the document',
			},
			{
				displayName: 'Show Print (Impressao)',
				name: 'showPrint',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['changeStatus'],
					},
				},
				description: 'Whether to show the document print after status change',
			},

			// ------------------ DOCUMENT LINE: GET ALL ------------------
			{
				displayName: 'Document ID (P)',
				name: 'documentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['documentLine'],
						operation: ['getAll'],
					},
				},
			},

			// ------------------ DOCUMENT LINE: CREATE ------------------
			{
				displayName: 'Document ID (Id_documento)',
				name: 'id_documento',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['documentLine'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Item ID (Id_artigo)',
				name: 'id_artigo',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['documentLine'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Quantity (Quantidade)',
				name: 'quantidade',
				type: 'number',
				required: true,
				default: 1,
				displayOptions: {
					show: {
						resource: ['documentLine'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'lineFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['documentLine'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Associated Line ID (ID Linha Associada)',
						name: 'id_movimento_artigo_associado',
						type: 'number',
						typeOptions: {
							numberPrecision: 0,
						},
						default: 0,
					},
					{
						displayName: 'Discount (Desconto)',
						name: 'desconto',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
					},
					{
						displayName: 'Observations (Observação)',
						name: 'observacao',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Price (Preco)',
						name: 'preco',
						type: 'number',
						typeOptions: {
							numberPrecision: 5,
						},
						default: 0,
					},
					{
						displayName: 'Price Line (Linha Preço)',
						name: 'linha',
						type: 'number',
						typeOptions: {
							numberPrecision: 0,
						},
						default: 1,
					},
				],
			},

			// ------------------ DOCUMENT LINE: DELETE ------------------
			{
				displayName: 'Document Line ID (P)',
				name: 'lineId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['documentLine'],
						operation: ['delete'],
					},
				},
				description: 'The internal ID of the document line (id_movimento)',
			},

			// ------------------ EMAIL: SEND ------------------
			{
				displayName: 'Sender Email',
				name: 'remetente',
				type: 'string',
				required: true,
				default: 'noreply@goldylocks.pt',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Email address of the sender',
			},
			{
				displayName: 'Sender Name',
				name: 'nomeRemetente',
				type: 'string',
				default: 'Goldylocks',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Display name of the sender',
			},
			{
				displayName: 'Subject',
				name: 'assunto',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Subject of the email',
			},
			{
				displayName: 'Recipients',
				name: 'enderecos',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Comma-separated list of recipient email addresses (e.g., "email1@example.com,email2@example.com")',
			},
			{
				displayName: 'Document Type ID',
				name: 'tipo_documento',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'ID of the document type for email templates',
			},
			{
				displayName: 'Document ID',
				name: 'id_documento',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Specific document ID to generate values for email template if needed',
			},
			{
				displayName: 'HTML Message',
				name: 'mensagem',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'HTML content of the email if not using a template',
			},
			{
				displayName: 'Plain Text Message',
				name: 'mensagemSimples',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Plain text content of the email',
			},
			{
				displayName: 'Attachments',
				name: 'anexos',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				description: 'Comma-separated list of URLs to files to attach to the email',
			},

			// ------------------ FAMILY: CREATE ------------------
			{
				displayName: 'Family Name (D)',
				name: 'familyName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['create'],
					},
				},
				description: 'New family name',
			},
			{
				displayName: 'Parent Family ID (P)',
				name: 'parentFamilyId',
				type: 'string',
				default: '0',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['create'],
					},
				},
				description: 'Parent family ID (0 for root)',
			},
			{
				displayName: 'Family ID (ID_Familia) [Optional]',
				name: 'familyId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['create'],
					},
				},
				description: 'ID of family to create (optional)',
			},
			{
				displayName: 'Allow Duplicates (Permitir_duplicadas) [Optional]',
				name: 'allowDuplicates',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['create'],
					},
				},
				description: 'Allow families with the same name in the same parent family',
			},
			{
				displayName: 'Available in POS (Disponivel_pos)',
				name: 'availableInPOS',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['create'],
					},
				},
				description: 'Whether the family is available in POS (0 = unavailable, 1 = available)',
			},

			// ------------------ FAMILY: EDIT ------------------
			{
				displayName: 'Family ID (ID)',
				name: 'familyId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['edit'],
					},
				},
				description: 'ID of the family to edit',
			},
			{
				displayName: 'New Family Name (F)',
				name: 'newFamilyName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['edit'],
					},
				},
				description: 'New family name',
			},
			{
				displayName: 'New Parent Family ID (FP)',
				name: 'newParentFamilyId',
				type: 'string',
				default: '0',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['edit'],
					},
				},
				description: 'New parent family ID',
			},
			{
				displayName: 'Available in POS (Disponivel_pos)',
				name: 'availableInPOS',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['edit'],
					},
				},
				description: 'Whether the family is available in POS',
			},

			// ------------------ FAMILY: DELETE ------------------
			{
				displayName: 'Family ID (P)',
				name: 'familyId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['delete'],
					},
				},
				description: 'ID of the family to remove',
			},

			// ------------------ FAMILY: GET ALL ------------------
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Parent Family ID (P)',
						name: 'p',
						type: 'string',
						default: '0',
						description: 'Parent family ID, 0 for root',
					},
					{
						displayName: 'Available in POS (Disponivel_pos)',
						name: 'disponivel_pos',
						type: 'boolean',
						default: true,
						description: 'True to get only families available in POS',
					},
				],
			},

			// ------------------ FAMILY: GET IMAGE/THUMBNAIL ------------------
			{
				displayName: 'Family ID (P)',
				name: 'familyId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['getImage'],
					},
				},
				description: 'ID of the family',
			},
			{
				displayName: 'Get as Thumbnail',
				name: 'thumbnail',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['getImage'],
					},
				},
				description: 'Whether to get as thumbnail',
			},
			{
				displayName: 'Get as Base64 [Optional]',
				name: 'base64',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['familia'],
						operation: ['getImage'],
					},
				},
				description: 'Whether to get image as base64',
			},

			// ------------------ FAMILY: GET CREATION ORDER ------------------
			// (No additional fields needed for this operation)

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('goldylocksApi');
		const baseUrl = credentials.baseUrl as string;
		const apiKey = credentials.apiKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'item') {
					if (operation === 'getAll') {
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: any = { ...filters, api: apiKey };

						if (returnAll) {
							const response = await this.helpers.httpRequest({
								baseURL: baseUrl,
								method: 'GET',
								url: '/artigos/',
								qs,
								json: true,
							});
							returnData.push(...this.helpers.returnJsonArray(response));
						} else {
							qs.l = limit;
							const response = await this.helpers.httpRequest({
								baseURL: baseUrl,
								method: 'GET',
								url: '/artigos/',
								qs,
								json: true,
							});
							returnData.push(...this.helpers.returnJsonArray(response));
						}
					}

					if (operation === 'get') {
						const itemId = this.getNodeParameter('itemId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/artigo/',
							qs: { p: itemId, api: apiKey },
							json: true,
						});
						returnData.push(...this.helpers.returnJsonArray(response));
					}

					if (operation === 'delete') {
						const itemId = this.getNodeParameter('itemId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/eliminarartigo/',
							qs: { p: itemId, api: apiKey },
							json: true,
						});
						returnData.push({ json: { success: true, response } });
					}

					if (operation === 'upsert') {
						const codBarras = this.getNodeParameter('cod_barras', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						const body = { cod_barras: codBarras, ...additionalFields };

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/guardarartigo/',
							qs: { p: codBarras, api: apiKey },
							body,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							json: true,
						});
						returnData.push({ json: { success: true, response } });
					}
				}

				if (resource === 'customer') {
					if (operation === 'getAll') {
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = { ...filters, api: apiKey };
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/clientes/',
							qs,
							json: true,
						});
						returnData.push(...this.helpers.returnJsonArray(response));
					}

					if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/cliente/',
							qs: { p: customerId, api: apiKey },
							json: true,
						});
						returnData.push(...this.helpers.returnJsonArray(response));
					}

					if (operation === 'delete') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/eliminarcliente/',
							qs: { p: customerId, api: apiKey },
							json: true,
						});
						returnData.push({ json: { success: true, response } });
					}

					if (operation === 'upsert') {
						const customerIdUpdate = this.getNodeParameter('customerIdUpdate', i, '') as string;
						const customerFields = this.getNodeParameter('customerFields', i, {}) as any;
						const qs: { api: string; p?: string } = { api: apiKey };
						if (customerIdUpdate) {
							qs.p = customerIdUpdate;
						}

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/gerircliente/',
							qs,
							body: customerFields,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							json: true,
						});
						returnData.push({ json: { success: true, response } });
					}
				}

				if (resource === 'document') {
					if (operation === 'getAll') {
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const qs = { ...filters, limite: limit, api: apiKey };

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/documentos/',
							qs,
							json: true,
						});
						returnData.push(...this.helpers.returnJsonArray(response));
					}

					if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/documento/',
							qs: { p: documentId, api: apiKey },
							json: true,
						});
						returnData.push(...this.helpers.returnJsonArray(response));
					}

					if (operation === 'create') {
						const idCliente = this.getNodeParameter('idCliente', i) as string;
						const tipo_documento = this.getNodeParameter('tipo_documento', i) as string;
						const serie_documento = this.getNodeParameter('serie_documento', i) as string;

						const body = { idCliente, tipo_documento, serie_documento };
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/criardocumento/',
							qs: { api: apiKey },
							body,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							json: true,
						});
						returnData.push({ json: { new_document_id: response } });
					}

					if (operation === 'anul') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const motive = this.getNodeParameter('motive', i) as string;

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/anulardoc/',
							qs: { p: documentId, m: motive, api: apiKey },
							json: true,
						});
						returnData.push({ json: response });
					}

					if (operation === 'fecharEncomenda') {
						const documentId = this.getNodeParameter('documentId', i) as string;

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/fechardocumento/',
							qs: { p: documentId, api: apiKey },
							json: true,
						});
						returnData.push({ json: response });
					}

					if (operation === 'updateCustomer') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const customerData = this.getNodeParameter('customerData', i, {}) as any;
						const options = this.getNodeParameter('options', i, {}) as any;

						const qs: any = {
							api: apiKey,
							p: documentId,
						};

						if (options.alterarlinhas) {
							qs.alterarlinhas = 1;
						}

						// Add customer data fields to query string as well, as they are also sent as form data
						Object.assign(qs, customerData);

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/alterarclientedocumento/',
							qs,
							body: customerData,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							json: true,
						});
						returnData.push({ json: { success: true, response } });
					}

					if (operation === 'changeStatus') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const newStatus = this.getNodeParameter('newStatus', i) as string;
						const showPrint = this.getNodeParameter('showPrint', i) as boolean;

						const printValue = showPrint ? 1 : 0;

						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/alterarestadodocumento/',
							qs: { 
								api: apiKey,
								p: documentId,
								estado: newStatus,
								impressao: printValue
							},
							json: true,
						});
						returnData.push({ json: response });
					}
				}

				if (resource === 'documentLine') {
					if (operation === 'getAll') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/linhasdoc/',
							qs: { p: documentId, api: apiKey },
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							json: true,
						});
						returnData.push(...this.helpers.returnJsonArray(response));
					}

					if (operation === 'create') {
						const id_documento = this.getNodeParameter('id_documento', i) as number;
						const id_artigo = this.getNodeParameter('id_artigo', i) as string;
						const quantidade = this.getNodeParameter('quantidade', i) as number;
						const lineFields = this.getNodeParameter('lineFields', i, {}) as any;

						const body = { id_documento, id_artigo, quantidade, ...lineFields };
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/inserirlinha/',
							qs: { api: apiKey, p: 1, obtermovimento: 1},
							body,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							json: true,
						});
						returnData.push({ json: response });
					}

					if (operation === 'delete') {
						const lineId = this.getNodeParameter('lineId', i) as string;
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'GET',
							url: '/eliminarlinhadoc/',
							qs: { p: lineId, api: apiKey },
							json: true,
						});
						returnData.push({ json: response });
					}
				}
						if (resource === 'familia') {
							if (operation === 'create') {
								const familyName = this.getNodeParameter('familyName', i) as string;
								const parentFamilyId = this.getNodeParameter('parentFamilyId', i, '0') as string;
								const familyId = this.getNodeParameter('familyId', i, '') as string;
								const allowDuplicates = this.getNodeParameter('allowDuplicates', i, false) as boolean;
								const availableInPOS = this.getNodeParameter('availableInPOS', i, true) as boolean;

								const qs: any = {
									d: familyName,
									p: parentFamilyId,
									api: apiKey,
								};

								if (familyId) {
									qs.id_familia = familyId;
								}
								qs.permitir_duplicadas = allowDuplicates ? 1 : 0;
								qs.disponivel_pos = availableInPOS ? 1 : 0;

								const response = await this.helpers.httpRequest({
									baseURL: baseUrl,
									method: 'GET',
									url: '/inserirfamilia/',
									qs,
									json: true,
								});
								returnData.push({ json: { success: true, response } });
							}

							if (operation === 'edit') {
								const familyId = this.getNodeParameter('familyId', i) as string;
								const newFamilyName = this.getNodeParameter('newFamilyName', i, '') as string;
								const newParentFamilyId = this.getNodeParameter('newParentFamilyId', i, '0') as string;
								const availableInPOS = this.getNodeParameter('availableInPOS', i, true) as boolean;

								const qs: any = {
									id: familyId,
									f: newFamilyName || undefined,
									fp: newParentFamilyId,
									disponivel_pos: availableInPOS ? 1 : 0,
									api: apiKey,
								};

								const response = await this.helpers.httpRequest({
									baseURL: baseUrl,
									method: 'GET',
									url: '/editarfamilia/',
									qs,
									json: true,
								});
								returnData.push({ json: { success: true, response } });
							}

							if (operation === 'delete') {
								const familyId = this.getNodeParameter('familyId', i) as string;

								const qs = {
									p: familyId,
									api: apiKey,
								};

								const response = await this.helpers.httpRequest({
									baseURL: baseUrl,
									method: 'GET',
									url: '/eliminarfamilia/',
									qs,
									json: true,
								});
								returnData.push({ json: { success: true, response } });
							}

							if (operation === 'getAll') {
								const filters = this.getNodeParameter('filters', i, {}) as any;

								const qs: any = {
									p: filters.p || '0',
									disponivel_pos: filters.disponivel_pos ? 1 : 0,
									api: apiKey,
								};

								const response = await this.helpers.httpRequest({
									baseURL: baseUrl,
									method: 'GET',
									url: '/familias/',
									qs,
									json: true,
								});
								returnData.push(...this.helpers.returnJsonArray(response));
							}

							if (operation === 'getImage') {
								const familyId = this.getNodeParameter('familyId', i) as string;
								const thumbnail = this.getNodeParameter('thumbnail', i, true) as boolean;
								const base64 = this.getNodeParameter('base64', i, false) as boolean;

								const qs: any = {
									p: familyId,
									thumbnail: thumbnail ? 1 : 0,
									api: apiKey,
								};

								if (base64) {
									qs.base64 = 1;
								}

								const response = await this.helpers.httpRequest({
									baseURL: baseUrl,
									method: 'GET',
									url: '/imagemfamilia/',
									qs,
									json: true,
								});
								returnData.push({ json: response });
							}

							if (operation === 'getCreationOrder') {
								const qs = {
									api: apiKey,
								};

								const response = await this.helpers.httpRequest({
									baseURL: baseUrl,
									method: 'GET',
									url: '/obterarraycriacaofamilias/',
									qs,
									json: true,
								});
								returnData.push({ json: response });
							}
						}

				if (resource === 'email') {
					if (operation === 'send') {
						const remetente = this.getNodeParameter('remetente', i) as string;
						const nomeRemetente = this.getNodeParameter('nomeRemetente', i, 'Goldylocks') as string;
						const assunto = this.getNodeParameter('assunto', i) as string;
						const enderecos = this.getNodeParameter('enderecos', i) as string;
						const tipo_documento = this.getNodeParameter('tipo_documento', i, '') as string;
						const id_documento = this.getNodeParameter('id_documento', i, '') as string;
						const mensagem = this.getNodeParameter('mensagem', i, '') as string;
						const mensagemSimples = this.getNodeParameter('mensagemSimples', i, '') as string;
						const anexos = this.getNodeParameter('anexos', i, '') as string;

						// Prepare the form data for the email
						const formData: any = {
							remetente,
							nomeRemetente,
							assunto,
							enderecos:enderecos.split(','),
							id_modelo_email: 0
						};

						// Add optional fields if they exist
						if (tipo_documento) formData.tipo_documento = tipo_documento;
						if (id_documento) formData.id_documento = id_documento;
						if (mensagem) formData.mensagem = mensagem;
						if (mensagemSimples) formData.mensagemSimples = mensagemSimples;
						if (anexos) formData.anexos = anexos;

						// Send the email request using form data
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'goldylocksApi',
							{
								baseURL: baseUrl,
								method: 'POST',
								url: '/email/',
								qs: { api: apiKey, p: id_documento}, // p=1 for confirmation of email sending
								body: formData,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								json: true,
							}
						);
						returnData.push({ json: { success: true, response } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: i });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error);
			}
		}
		return [returnData];
	}
}