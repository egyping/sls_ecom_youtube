import { OrderRecord, ProductsRecord } from '@libs/interfaces';
import SES from '@libs/SES';
import Dynamo from '@libs/Dynamo';
import { EventBridgeEvent } from 'aws-lambda';

export const handler = async (event: EventBridgeEvent<'string', OrderRecord>) => {
    try {
    const productsTable = process.env.productTable;

    const details = event.detail

    console.log('Details picked from EB event')

    const itemPromises = details.items.map(async (item) => {
        const itemData = await Dynamo.get<ProductsRecord>({
          tableName: productsTable,
          pkValue: item.id,
        });
        return {
          count: item.count,
          title: itemData.title,
          size: itemData.sizesAvailable.find((size) => size.sizeCode == item.size),
        };
      });

    const itemDetails = await Promise.all(itemPromises);
    console.log('Items Details picked from products table')
    // i need to send email 
    await SES.sendEmail({
        email: details.userEmail,
        subject: 'Your order has been placed',
        text: `Thank you for placing your order. We're preparing it at our warehouse.
        
  Your order is for 
  ${itemDetails.map(itemToRow)}
  
  We'll let you know when that has been shipped!
  `,
      });

      console.log('email sent');
      return

    } catch (error) {
        console.log(error);
    }

}

const itemToRow = ({
    count,
    title,
    size,
  }: {
    count: number;
    title: string;
    size?: { sizeCode: number; displayValue: string };
  }) => {
    return `${count} ${title} ${size ? `in size ${size.displayValue}` : null}
  `;
  };