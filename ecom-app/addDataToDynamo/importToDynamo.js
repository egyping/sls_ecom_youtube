const AWS = require('aws-sdk');
const fs = require('fs');

// node importToDynamo.js

// Configure AWS
// Replace 'your-region' with your DynamoDB table's region
AWS.config.update({
  region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'dev-ecom-app-product-table';

// Load JSON file
const productsData = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

// Helper function to import items
async function importItems(items) {
  for (let item of items) {
    const params = {
      TableName: tableName,
      Item: item
    };
    try {
      await docClient.put(params).promise();
      console.log(`Item imported: ${item.id}`);
    } catch (err) {
      console.error(`Failed to import item: ${item.id}`, err);
    }
  }
}

// Run the import
importItems(productsData).then(() => console.log('Import complete.'));
