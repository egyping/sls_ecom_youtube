import { APIGatewayProxyEvent } from 'aws-lambda';
import Dynamo from '@libs/Dynamo';
import { OrderRecord } from 'src/libs/interfaces';
import { formatJSONResponse } from '@libs/APIResponses'



export const handler = async (event: APIGatewayProxyEvent) => {
        // get the user ID from the event
        const userId = event.pathParameters.userId

        if (!userId) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'Missing or invalid userId' }),
            };
          }
        console.log("USER_ID: ", userId)


        const ordersTableName = process.env.ordersTable;
        // Use the Dynamo utility to query orders for the provided userId
        const orders = await Dynamo.query<OrderRecord>({
        tableName: ordersTableName,
        pkKey: 'pk', // Assuming the partition key for orders is named 'userId'
        pkValue: userId,
        index: 'index1', // Replace with the name of your GSI if querying against it
      });
      console.log("Orders: ", orders)

      if (!orders || orders.length === 0) {
        return formatJSONResponse({ statusCode: 404, body: {
            message: 'No Orders returned'
        } });
      }
  
      return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Match this with what you set in corsSettings
            "Access-Control-Allow-Credentials": true, // Keep consistent with corsSettings
          
          },
        body: JSON.stringify(orders),
      }

}