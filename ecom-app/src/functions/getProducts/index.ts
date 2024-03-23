import { APIGatewayProxyEvent } from 'aws-lambda';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/libs/interfaces';
import { formatJSONResponse } from '@libs/APIResponses'



export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const productsTable = process.env.productTable;
        // baseUrl/products?group=clothing | category | subcategory
        const { group, category, subcategory } = event.queryStringParameters || {};
        console.log("Table Name: ", productsTable);
        

        // if group not passed 
        if (!group) {
            return {
                statusCode: 400,
                body: 'Group is required'
            }
        }

        let sk = undefined
        if (category) {
            sk = category
            if (subcategory) {
                sk = `${category}#${subcategory}`
            }
        }
        console.log("Query Parameters: ", { group, category, subcategory, sk });

        const productsResponse = await Dynamo.query<ProductsRecord>({
            tableName: productsTable,
            index: 'index1',
            pkValue: group,
            skBeginsWith: sk,
            //skKey: sk ? sk : undefined
            skKey: sk ? "sk" : undefined
        })

        

        const productData = productsResponse.map(({ pk, sk, ...rest }) => rest)

        return formatJSONResponse({
            body: productData
        })

    } catch {
        return {
            statusCode: 500,
            body: 'Server Error'
        }
    }


}
