import { APIGatewayProxyEvent } from 'aws-lambda';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/libs/interfaces';
import { formatJSONResponse } from '@libs/APIResponses'



export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const productsTable = process.env.productTable;
        console.log("Table Name: ", productsTable);
        // baseUrl/products productId
        const productId = event.pathParameters.productId;
        console.log("Product Id: ", productId);
        
        const productData = await Dynamo.get<ProductsRecord> ({
            tableName: productsTable,
            pkValue: productId,
        })
        
        console.log("Product Data: ", productData);

        const { pk, sk, ...responseData } = productData



        return formatJSONResponse({
            body: responseData
        })

    } catch {
        return {
            statusCode: 500,
            body: 'Server Error'
        }
    }


}
