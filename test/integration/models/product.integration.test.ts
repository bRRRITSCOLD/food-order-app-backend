// node_modules
import chai from 'chai';
import "reflect-metadata"
import { uuid } from 'uuidv4';
import * as _ from 'lodash';

// libraries
import { Environment } from '../../../src/lib/environment/environment';
import { dynamoDb } from '../../../src/lib/aws';

// models
import { Product } from '../../../src/models/product';

// file constants/variables
const expect = chai.expect;

describe('Product Models Integration Tests', () => {
  before(async () => {
    try {
      // load environment
      await Environment.load({
        envExamplePath: './.env.example.product-api',
        aws: { ssm: false }
      });
      // init/instatiate any libraries
      // that we may need for executing code
      await Promise.all([
        // init dynamodb client
        dynamoDb.init({
          region: 'us-east-1',
          endpoint: `http://localhost:4569`
        })
      ]);
      // return explicity
      return;
    } catch (error) {
      // throw explicitly
      throw error;
    }
  })

  after(async () => {
    try {
      // return explicitly
      return;
    } catch (error) {
      // throw explicitly
      throw error;
    }
  });

  describe('{}Product', () => {
    // instantiate all mock data
    // that we wish use to for/during
    // this test
    const products = [
      {
        productId: uuid(),
        name: 'Hamburger',
        ingredients: []
      },
      {
        productId: uuid(),
        name: 'Raspberry White Chocolate Cheesecake',
        ingredients: []
      }
    ];

    describe('#putOne', () => {
      it('- should create a new Product instance and place said instance in the products DynamoDB table', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_PRODUCT_INSTANCE = Product;
          const EXPECTED_PRODUCT_OBJECT = { ...products[0] };
          const EXPECTED_ARRAY_INSTANCE = Array;

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // initiate holder for current
          // product object/object instance
          let putProduct;
          // execute function to be tested
          putProduct = await Product.putOne(products[0]);
          // run first batch of
          // test assertions
          expect(putProduct instanceof EXPECTED_PRODUCT_INSTANCE).to.be.true;
          expect(putProduct.productId !== undefined).to.be.true;
          expect(putProduct.productId === EXPECTED_PRODUCT_OBJECT.productId).to.be.true;
          expect(putProduct.name !== undefined).to.be.true;
          expect(putProduct.name === EXPECTED_PRODUCT_OBJECT.name).to.be.true;
          expect(putProduct.ingredients !== undefined).to.be.true;
          expect(putProduct.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(putProduct.ingredients.length === EXPECTED_PRODUCT_OBJECT.ingredients.length).to.be.true;

          // scan dynamo for the created
          // product item
          const dynamoDbScanResponse = await dynamoDb.documentClient.scan({
            TableName : "products",
            FilterExpression : `productId IN (:productId1)`,
            ExpressionAttributeValues : {
              ':productId1': EXPECTED_PRODUCT_OBJECT.productId
            }
          }).promise();
          // store reference to possibly retrieved
          // dynamodb item - to be used for testing
          putProduct = _.get(dynamoDbScanResponse, 'Items[0]');
          // run second batch of
          // test assertions
          expect(putProduct.productId !== undefined).to.be.true;
          expect(putProduct.productId === EXPECTED_PRODUCT_OBJECT.productId).to.be.true;
          expect(putProduct.name !== undefined).to.be.true;
          expect(putProduct.name === EXPECTED_PRODUCT_OBJECT.name).to.be.true;
          expect(putProduct.ingredients !== undefined).to.be.true;
          expect(putProduct.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(putProduct.ingredients.length === EXPECTED_PRODUCT_OBJECT.ingredients.length).to.be.true;

          /////////////////////////
          //////// teardown ///////
          /////////////////////////
          // delete possible reference
          // to mock product inside dynamodb table
          const dynamoDbDeleteTasks: any[] = [];
          for (let i = 0; i < products.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'products',
                Key:{
                  productId: products[i].productId
                }
              }).promise()
            )
          }
          await Promise.all(dynamoDbDeleteTasks);
          // return explicily
          return;
        } catch (error) {
          // delete possible reference
          // to mock product inside dynamodb table
          const dynamoDbDeleteTasks: any[] = [];
          for (let i = 0; i < products.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'products',
                Key:{
                  productId: products[i].productId
                }
              }).promise()
            )
          }
          await Promise.all(dynamoDbDeleteTasks);
          // throw explicitly
          throw error;
        }
      });
    });

    describe('#fetchManyByProductIds', () => {
      it('- should retrieve all products that correlate to the passed in productIds', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // insert all mock products
          const putResponse = await dynamoDb.documentClient.batchWrite({
            RequestItems: {
              'products': products.map((product: any) => {
                return {
                  PutRequest: {
                    Item: { ...product }
                  }
                }
              })
            }
          }).promise();
          // store expected values for
          // testing purposes/ease
          const EXPECTED_PRODUCT_INSTANCE = Product;
          const EXPECTED_PRODUCT_OBJECTS = [...products];
          const EXPECTED_ARRAY_INSTANCE = Array;

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // initiate holder for current
          // product object/object instance
          let fetchedProducts: any[];
          // execute function to be tested
          fetchedProducts = await Product.fetchManyByProductIds(
            products.map((product: any) => product.productId)
          );
          // run first batch of
          // test assertions
          expect(fetchedProducts instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(fetchedProducts.length === EXPECTED_PRODUCT_OBJECTS.length).to.be.true;
          for (let i = 0; i < fetchedProducts.length; i++) {
            const foundExpectedProduct: any = EXPECTED_PRODUCT_OBJECTS.find(
              (expectedProductObject: any) =>
                expectedProductObject.productId === fetchedProducts[i].productId
            )
            expect(foundExpectedProduct !== undefined).to.be.true;
            expect(fetchedProducts[i] instanceof EXPECTED_PRODUCT_INSTANCE).to.be.true;
            expect(fetchedProducts[i].productId !== undefined).to.be.true;
            expect(fetchedProducts[i].productId === foundExpectedProduct.productId).to.be.true;
            expect(fetchedProducts[i].name !== undefined).to.be.true;
            expect(fetchedProducts[i].name === foundExpectedProduct.name).to.be.true;
            expect(fetchedProducts[i].price !== undefined).to.be.true;
            expect(fetchedProducts[i].price === foundExpectedProduct.price).to.be.true;
            expect(fetchedProducts[i].ingredients !== undefined).to.be.true;
            expect(fetchedProducts[i].ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
            expect(fetchedProducts[i].ingredients.length === foundExpectedProduct.ingredients.length).to.be.true;
          }

          /////////////////////////
          //////// teardown ///////
          /////////////////////////
          // delete possible reference
          // to mock product inside dynamodb table
          const dynamoDbDeleteTasks: any[] = [];
          for (let i = 0; i < products.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'products',
                Key:{
                  productId: products[i].productId
                }
              }).promise()
            )
          }
          await Promise.all(dynamoDbDeleteTasks);
          // return explicitly
          return;
        } catch (error) {
          // delete possible reference
          // to mock product inside dynamodb table
          const dynamoDbDeleteTasks: any[] = [];
          for (let i = 0; i < products.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'products',
                Key:{
                  productId: products[i].productId
                }
              }).promise()
            )
          }
          await Promise.all(dynamoDbDeleteTasks);
          // throw explicitly
          throw error;
        }
      });
    });
  });
})