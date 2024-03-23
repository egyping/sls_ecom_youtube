import {AWS} from '@serverless/typescript'

const corsSettings = {
    headers: [
        // Specify allowed headers
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
      ],
      allowCredentials: false,
}

const functions: AWS['functions'] = {
    getProducts: {
        handler: 'src/functions/getProducts/index.handler',
        events: [
            {
                http: {
                    method: 'get',
                    path: 'products',
                    cors: corsSettings,
                }
            }
        ]
    },
    getProduct: {
        handler: 'src/functions/getProduct/index.handler',
        events: [
            {
                http: {
                    method: 'get',
                    path: 'product/{productId}',
                    cors: corsSettings,
                }
            }
        ]
    },
}

export default functions