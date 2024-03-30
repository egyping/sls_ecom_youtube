import type { AWS } from '@serverless/typescript';
import functions from './serverless/functions';
import DynamoResources from './serverless/dynamodb';
import CognitoResources from './serverless/cognitoResources';
import SecretsConfig from './serverless/secrets';

const serverlessConfiguration: AWS = {
  service: 'ecom-app',
  frameworkVersion: '3',

  useDotenv: true,

  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  custom: {
    tables: {
      productTable: '${sls:stage}-${self:service}-product-table',
      ordersTable: '${sls:stage}-${self:service}-orders-table',
    },
    profile: {
      dev: 'serverlessUser',
      prod: 'serverlessUser',
      int: 'serverlessUser',
    },
    eventBrigeBusName: 'ordersEventBus',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    profile: "${self:custom.profile.${sls:stage}}",
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      productTable: '${self:custom.tables.productTable}',
      ordersTable: '${self:custom.tables.ordersTable}',
      region: '${self:provider.region}',
      eventBrigeBusName: '${self:custom.eventBrigeBusName}',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'dynamodb:*',
        Resource: [
          'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.tables.productTable}',
          'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.tables.productTable}/index/index1',
          'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.tables.ordersTable}',
          'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.tables.ordersTable}/index/index1',
        ],
      },
    ],

  },
  // import the function via paths
  // functions: { hello },
  functions,
  resources: {
    Resources: {
      ...CognitoResources,
      ...DynamoResources,
      ...SecretsConfig,
    },
    Outputs: {
      ProductDynamoTableName: {
        Value: '${self:custom.tables.productTable}',
        Export: {
          Name: 'ProductDynamoTableName',
        },
      },
      OrderDynamoTableName: {
        Value: '${self:custom.tables.ordersTable}',
        Export: {
          Name: 'OrdersDynamoTableName',
        },
      },
      UserPoolId: {
        Value: { Ref: 'CognitoUserPool' },
        Export: { 
          Name: 'ecom-UserPoolId' 
        },
      },
    },
},
 
  package: { individually: true },

}


module.exports = serverlessConfiguration