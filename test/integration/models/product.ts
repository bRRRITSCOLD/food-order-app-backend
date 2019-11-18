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
        price: 5.15,
        ingredients: []
      },
      {
        productId: uuid(),
        name: 'Raspberry White Chocolate Cheesecake',
        price: 5.15,
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
          let product;
          // execute function to be tested
          product = await Product.putOne(products[0]);
          // run first batch of
          // test assertions
          expect(product instanceof EXPECTED_PRODUCT_INSTANCE).to.be.true;
          expect(product.productId !== undefined).to.be.true;
          expect(product.productId === EXPECTED_PRODUCT_OBJECT.productId).to.be.true;
          expect(product.name !== undefined).to.be.true;
          expect(product.name === EXPECTED_PRODUCT_OBJECT.name).to.be.true;
          expect(product.price !== undefined).to.be.true;
          expect(product.price === EXPECTED_PRODUCT_OBJECT.price).to.be.true;
          expect(product.ingredients !== undefined).to.be.true;
          expect(product.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(product.ingredients.length === EXPECTED_PRODUCT_OBJECT.ingredients.length).to.be.true;

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
          product = _.get(dynamoDbScanResponse, 'Items[0]');
          // run second batch of
          // test assertions
          expect(product.productId !== undefined).to.be.true;
          expect(product.productId === EXPECTED_PRODUCT_OBJECT.productId).to.be.true;
          expect(product.name !== undefined).to.be.true;
          expect(product.name === EXPECTED_PRODUCT_OBJECT.name).to.be.true;
          expect(product.price !== undefined).to.be.true;
          expect(product.price === EXPECTED_PRODUCT_OBJECT.price).to.be.true;
          expect(product.ingredients !== undefined).to.be.true;
          expect(product.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(product.ingredients.length === EXPECTED_PRODUCT_OBJECT.ingredients.length).to.be.true;

          /////////////////////////
          //////// teardown ///////
          /////////////////////////
          // delete possible reference
          // to mock product inside dynamodb table
          await dynamoDb.documentClient.delete({
            TableName: 'products',
            Key:{
              productId: products[0].productId
            }
          }).promise();

          return;
        } catch (error) {
          // delete possible reference
          // to mock product inside dynamodb table
          await dynamoDb.documentClient.delete({
            TableName: 'products',
            Key:{
              productId: products[0].productId
            }
          }).promise();
          // throw explicitly
          throw error;
        }
      });
    });

    describe('#fetchManyByProductIds', () => {
      it('- should', async () => {
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
          let product;
          // execute function to be tested
          product = await Product.putOne(products[0]);
          // run first batch of
          // test assertions
          expect(product instanceof EXPECTED_PRODUCT_INSTANCE).to.be.true;
          expect(product.productId !== undefined).to.be.true;
          expect(product.productId === EXPECTED_PRODUCT_OBJECT.productId).to.be.true;
          expect(product.name !== undefined).to.be.true;
          expect(product.name === EXPECTED_PRODUCT_OBJECT.name).to.be.true;
          expect(product.price !== undefined).to.be.true;
          expect(product.price === EXPECTED_PRODUCT_OBJECT.price).to.be.true;
          expect(product.ingredients !== undefined).to.be.true;
          expect(product.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(product.ingredients.length === EXPECTED_PRODUCT_OBJECT.ingredients.length).to.be.true;

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
          product = _.get(dynamoDbScanResponse, 'Items[0]');
          // run second batch of
          // test assertions
          expect(product.productId !== undefined).to.be.true;
          expect(product.productId === EXPECTED_PRODUCT_OBJECT.productId).to.be.true;
          expect(product.name !== undefined).to.be.true;
          expect(product.name === EXPECTED_PRODUCT_OBJECT.name).to.be.true;
          expect(product.price !== undefined).to.be.true;
          expect(product.price === EXPECTED_PRODUCT_OBJECT.price).to.be.true;
          expect(product.ingredients !== undefined).to.be.true;
          expect(product.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(product.ingredients.length === EXPECTED_PRODUCT_OBJECT.ingredients.length).to.be.true;

          /////////////////////////
          //////// teardown ///////
          /////////////////////////
          // delete possible reference
          // to mock product inside dynamodb table
          await dynamoDb.documentClient.delete({
            TableName: 'products',
            Key:{
              productId: products[0].productId
            }
          }).promise();

          return;
        } catch (error) {
          // delete possible reference
          // to mock product inside dynamodb table
          await dynamoDb.documentClient.delete({
            TableName: 'products',
            Key:{
              productId: products[0].productId
            }
          }).promise();
          // throw explicitly
          throw error;
        }
      });
    });
  });
})