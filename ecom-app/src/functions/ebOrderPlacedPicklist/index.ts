import { OrderRecord } from '@libs/interfaces';
import { EventBridgeEvent } from 'aws-lambda';
import axios from 'axios';
import Secrets  from '@libs/secrets';



export const handler = async (event: EventBridgeEvent<'string', OrderRecord>) => {
    try {

      const details = event.detail

      const authKey = await Secrets.getSecret('warehouseApiKey');

      // WMS it has API URL and token 
      await axios.post(
        'https://httpstat.us/201',
        {
          ...details
        },
        {
          headers: {
            authorization: authKey,
          },
        }
      )

      console.log("WMS API Called!")
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