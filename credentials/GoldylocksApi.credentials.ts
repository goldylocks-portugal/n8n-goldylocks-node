import {
	// IAuthenticateGeneric, // This was removed
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GoldylocksApi implements ICredentialType {
	name = 'goldylocksApi';
	displayName = 'Goldylocks API';
	documentationUrl = 'https://www.goldylocks.pt/integracoes/api-erp/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.goldylocks.pt/empresademonstrativa/api',
			placeholder: 'https://app.goldylocks.pt/yourcompany/api',
			description: 'The base URL of your Goldylocks instance API',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Goldylocks API Key',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/status/',
			qs: {
				api: '={{$credentials.apiKey}}',
			},
		},
	};
}
