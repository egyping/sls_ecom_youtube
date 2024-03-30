import { APIGatewayProxyEvent } from 'aws-lambda';
import Dynamo from '@libs/Dynamo';
import { OrderRecord, ProductsRecord } from 'src/libs/interfaces';
import { formatJSONResponse } from '@libs/APIResponses'
import {v4 as uuid} from "uuid"


export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        // table > data from apiGateway (request) > template > save to DB
        const ordersTableName = process.env.ordersTable;

        const order = JSON.parse(event.body)
        const userId = event.requestContext?.authorizer?.claims?.sub
        const userEmail = event.requestContext?.authorizer?.claims?.email

        const timesstamp = Date.now()

        const fullOrder: OrderRecord = {
            id: uuid(),
            pk: userId,
            sk: `order#${timesstamp}`,

            userId,
            userEmail,
            dateCreated: timesstamp,
            status: "pending",
            items: order.items,
        }
        
        await Dynamo.write({data: fullOrder, tableName: ordersTableName})



        return formatJSONResponse({
            body: {message: 'Order placed Thank you!'}
        })

    } catch {
        return {
            statusCode: 500,
            body: 'Server Error'
        }
    }


}
