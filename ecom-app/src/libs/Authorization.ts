
import { APIGatewayProxyEvent } from 'aws-lambda';
import Secrets from './secrets';

const apiKeyAuth = async (event: APIGatewayProxyEvent) => {
  if (!event.headers?.Authorization) {
    throw Error('Missing Authorisation header');
  }
  console.log("AUth event:", event.headers.Authorization, 'event.headers.Authorization')
  
  const authToken = event.headers.Authorization;
  console.log("Auth Token:", authToken, 'authToken')

  // orderpacked/_orderId_
  const formattedPath = event.resource.replaceAll('{', '_').replaceAll('}', '_');
  console.log("Formatted Path:", formattedPath, 'formattedPath')

  // auth-/orderpacked/_orderId_
  const secretString = await Secrets.getSecret(`auth-${formattedPath}`);
  if (!secretString) {
    throw Error('no API key found for this path');
  }

  const secretObj = JSON.parse(secretString);

  if (Object.values(secretObj).includes(authToken)) {
    return;
  }
  throw Error('invalid API Key');
};

const Authorisation = {
    apiKeyAuth,
  };
export default Authorisation;