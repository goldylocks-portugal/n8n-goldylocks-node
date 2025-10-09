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
				displayOptions: {
					show: {
						resource: ['item'],
					},
				},
				options: [
					{
						name: 'Create/Update',
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
						name: 'Get All',
						value: 'getAll',
						action: 'Get all items',
					},
				],
				default: 'getAll',
			},
			// Customer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{
						name: 'Create/Update',
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
						name: 'Get All',
						value: 'getAll',
						action: 'Get all customers',
					},
				],
				default: 'getAll',
			},
			// Document Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a document',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get document details',
					},
					{
						name: 'Get All',
						value: 'getAll',
						action: 'Get all documents',
					},
					{
						name: 'Anul',
						value: 'anul',
						action: 'Anul a document',
					},
				],
				default: 'getAll',
			},
			// Document Line Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
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
						name: 'Get All from Document',
						value: 'getAll',
						action: 'Get all lines from a document',
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
						displayName: 'Search Text (p)',
						name: 'p',
						type: 'string',
						default: '',
						description: 'Text to search in item code or name',
					},
					{
						displayName: 'Only Active (activos)',
						name: 'activos',
						type: 'boolean',
						default: true,
						description: 'Whether to return only active items',
					},
					{
						displayName: 'Family ID (f)',
						name: 'f',
						type: 'string',
						default: '',
						description: 'Filter by family ID',
					},
				],
			},

			// ------------------ ITEM: GET / DELETE ------------------
			{
				displayName: 'Item ID (p)',
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
				displayName: 'Item ID (cod_barras)',
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
				description: 'The unique barcode for the item. If an item with this ID exists, it will be updated.',
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
						displayName: 'Name (nome)',
						name: 'nome',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Family ID (familia)',
						name: 'familia',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Cost Price (preco_custo)',
						name: 'preco_custo',
						type: 'number',
						typeOptions: {
							numberPrecision: 5,
						},
						default: 0,
					},
					{
						displayName: 'Tax (imposto)',
						name: 'imposto',
						type: 'string',
						default: 'IVA 23%',
						description: 'Full tax name, e.g., "IVA 23%"',
					},
					{
						displayName: 'Price Line 1 (psi1)',
						name: 'psi1',
						type: 'number',
						typeOptions: {
							numberPrecision: 5,
						},
						default: 0,
						description: 'Price for line 1, without tax',
					},
					{
						displayName: 'Type (tipo)',
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
						displayName: 'Search Text (p)',
						name: 'p',
						type: 'string',
						default: '',
						description: 'Text to search in customer fields',
					},
				],
			},

			// ------------------ CUSTOMER: GET / DELETE ------------------
			{
				displayName: 'Customer ID (p)',
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
				displayName: 'Update Customer ID (p)',
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
						displayName: 'Name (nome)',
						name: 'nome',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Tax ID (nif)',
						name: 'nif',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Address (morada)',
						name: 'morada',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code (cp)',
						name: 'cp',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Mobile Phone (telemovel)',
						name: 'telemovel',
						type: 'string',
						default: '',
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
				default: 100,
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
						displayName: 'Status (estado)',
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
						displayName: 'Customer ID (p)',
						name: 'p',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Start Date (data_inicial)',
						name: 'data_inicial',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'End Date (data_final)',
						name: 'data_final',
						type: 'dateTime',
						default: '',
					},
				],
			},

			// ------------------ DOCUMENT: GET / ANUL ------------------
			{
				displayName: 'Document ID (p)',
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
				displayName: 'Anulment Motive (m)',
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
				displayName: 'Document Type ID (tipo_documento)',
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
				displayName: 'Document Serie (serie_documento)',
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

			// ------------------ DOCUMENT LINE: GET ALL ------------------
			{
				displayName: 'Document ID (p)',
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
				displayName: 'Document ID (id_documento)',
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
				displayName: 'Item ID (id_artigo)',
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
				displayName: 'Quantity (quantidade)',
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
						displayName: 'Price (preco)',
						name: 'preco',
						type: 'number',
						typeOptions: {
							numberPrecision: 5,
						},
						default: 0,
					},
					{
						displayName: 'Discount (desconto)',
						name: 'desconto',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
					},
				],
			},

			// ------------------ DOCUMENT LINE: DELETE ------------------
			{
				displayName: 'Document Line ID (p)',
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
						const qs: {api: string, p?: string} = { api: apiKey };
						if(customerIdUpdate) {
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
						returnData.push({ json: response });
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
						const id_documento = this.getNodeParameter('id_documento', i) as string;
						const id_artigo = this.getNodeParameter('id_artigo', i) as string;
						const quantidade = this.getNodeParameter('quantidade', i) as number;
						const lineFields = this.getNodeParameter('lineFields', i, {}) as any;

						const body = { id_documento, id_artigo, quantidade, ...lineFields };
						const response = await this.helpers.httpRequest({
							baseURL: baseUrl,
							method: 'POST',
							url: '/inserirlinha/',
							qs: { api: apiKey },
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
