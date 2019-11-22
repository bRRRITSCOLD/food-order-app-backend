// node_modules
import chai from 'chai';
import "reflect-metadata"
import { uuid } from 'uuidv4';
import * as _ from 'lodash';

// libraries
import { Environment } from '../../../src/lib/environment/environment';
import { dynamoDb } from '../../../src/lib/aws';

// models
import { Ingredient } from '../../../src/models/ingredient';

// file constants/variables
const expect = chai.expect;

describe('Ingredient Models Integration Tests', () => {
  before(async () => {
    try {
      // load environment
      await Environment.load({
        envExamplePath: './.env.example.ingredient-api',
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

  describe('{}Ingredient', () => {
    // instantiate all mock data
    // that we wish use to for/during
    // this test
    const ingredients = [
      {
        ingredientId: uuid(),
        ingredientName: 'Raw Hamburger',
        ingredientPrice: 1.25,
        ingredientMeasurementUnit: 'LB',
        ingredientQuantity: .5
      },
      {
        ingredientId: uuid(),
        ingredientName: 'Salt',
        ingredientPrice: .30,
        ingredientMeasurementUnit: 'G',
        ingredientQuantity: 3
      },
      {
        ingredientId: uuid(),
        ingredientName: 'Pepper',
        ingredientPrice: .70,
        ingredientMeasurementUnit: 'PER',
        ingredientQuantity: 1
      },
      {
        ingredientId: uuid(),
        ingredientName: 'Hamburger Bun',
        ingredientPrice: .70,
        ingredientMeasurementUnit: 'PER',
        ingredientQuantity: 1
      },
      {
        ingredientId: uuid(),
        ingredientName: 'Cheese Slice',
        ingredientPrice: .70,
        ingredientMeasurementUnit: 'PER',
        ingredientQuantity: 1
      }
    ];

    describe('#putOne', () => {
      it('- should create a new Ingredient instance and place said instance in the ingredients DynamoDB table', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_INGREDIENT_INSTANCE = Ingredient;
          const EXPECTED_INGREDIENT_OBJECT = { ...ingredients[0] };

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // initiate holder for current
          // product object/object instance
          let putIngredient;
          // execute function to be tested
          putIngredient = await Ingredient.putOne(ingredients[0]);
          // run first batch of
          // test assertions
          expect(putIngredient instanceof EXPECTED_INGREDIENT_INSTANCE).to.be.true;
          expect(putIngredient.ingredientId !== undefined).to.be.true;
          expect(putIngredient.ingredientId === EXPECTED_INGREDIENT_OBJECT.ingredientId).to.be.true;
          expect(putIngredient.ingredientName !== undefined).to.be.true;
          expect(putIngredient.ingredientName === EXPECTED_INGREDIENT_OBJECT.ingredientName).to.be.true;
          expect(putIngredient.ingredientMeasurementUnit !== undefined).to.be.true;
          expect(putIngredient.ingredientMeasurementUnit === EXPECTED_INGREDIENT_OBJECT.ingredientMeasurementUnit).to.be.true;
          expect(putIngredient.ingredientPrice !== undefined).to.be.true;
          expect(putIngredient.ingredientPrice === EXPECTED_INGREDIENT_OBJECT.ingredientPrice).to.be.true;
          expect(putIngredient.ingredientQuantity !== undefined).to.be.true;
          expect(putIngredient.ingredientQuantity === EXPECTED_INGREDIENT_OBJECT.ingredientQuantity).to.be.true;

          // scan dynamo for the created
          // product item
          const dynamoDbScanResponse = await dynamoDb.documentClient.scan({
            TableName : "ingredients",
            FilterExpression : `ingredientId IN (:ingredientId1)`,
            ExpressionAttributeValues : {
              ':ingredientId1': EXPECTED_INGREDIENT_OBJECT.ingredientId
            }
          }).promise();
          // store reference to possibly retrieved
          // dynamodb item - to be used for testing
          putIngredient = _.get(dynamoDbScanResponse, 'Items[0]');
          // run second batch of
          // test assertions
          expect(putIngredient.ingredientId !== undefined).to.be.true;
          expect(putIngredient.ingredientId === EXPECTED_INGREDIENT_OBJECT.ingredientId).to.be.true;
          expect(putIngredient.ingredientName !== undefined).to.be.true;
          expect(putIngredient.ingredientName === EXPECTED_INGREDIENT_OBJECT.ingredientName).to.be.true;
          expect(putIngredient.ingredientMeasurementUnit !== undefined).to.be.true;
          expect(putIngredient.ingredientMeasurementUnit === EXPECTED_INGREDIENT_OBJECT.ingredientMeasurementUnit).to.be.true;
          expect(putIngredient.ingredientPrice !== undefined).to.be.true;
          expect(putIngredient.ingredientPrice === EXPECTED_INGREDIENT_OBJECT.ingredientPrice).to.be.true;
          expect(putIngredient.ingredientQuantity !== undefined).to.be.true;
          expect(putIngredient.ingredientQuantity === EXPECTED_INGREDIENT_OBJECT.ingredientQuantity).to.be.true;

          /////////////////////////
          //////// teardown ///////
          /////////////////////////
          // delete possible reference
          // to mock product inside dynamodb table
          const dynamoDbDeleteTasks: any[] = [];
          for (let i = 0; i < ingredients.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'ingredients',
                Key:{
                  ingredientId: ingredients[i].ingredientId
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
          for (let i = 0; i < ingredients.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'ingredients',
                Key:{
                  ingredientId: ingredients[i].ingredientId
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

    describe('#fetchManyByIngredientIds', () => {
      it('- should retrieve all ingredients that correlate to the passed in ingredientIds', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // insert all mock products
          const putResponse = await dynamoDb.documentClient.batchWrite({
            RequestItems: {
              'ingredients': ingredients.map((ingredient: any) => {
                return {
                  PutRequest: {
                    Item: { ...ingredient }
                  }
                }
              })
            }
          }).promise();
          // store expected values for
          // testing purposes/ease
          const EXPECTED_INGREDIENT_INSTANCE = Ingredient;
          const EXPECTED_INGREDIENT_OBJECTS = [...ingredients];
          const EXPECTED_ARRAY_INSTANCE = Array;

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // initiate holder for current
          // product object/object instance
          let fetchedIngredients: any[];
          // execute function to be tested
          fetchedIngredients = await Ingredient.fetchManyByIngredientIds(
            ingredients.map((ingredient: any) => ingredient.ingredientId)
          );
          // run first batch of
          // test assertions
          expect(fetchedIngredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          expect(fetchedIngredients.length === EXPECTED_INGREDIENT_OBJECTS.length).to.be.true;
          for (let i = 0; i < fetchedIngredients.length; i++) {
            const foundExpectedIngredient: any = EXPECTED_INGREDIENT_OBJECTS.find(
              (expectedIngredientObject: any) =>
              expectedIngredientObject.ingredientId === fetchedIngredients[i].ingredientId
            )
            expect(foundExpectedIngredient !== undefined).to.be.true;
            expect(fetchedIngredients[i] instanceof EXPECTED_INGREDIENT_INSTANCE).to.be.true;
            expect(fetchedIngredients[i].ingredientId !== undefined).to.be.true;
            expect(fetchedIngredients[i].ingredientId === foundExpectedIngredient.ingredientId).to.be.true;
            expect(fetchedIngredients[i].ingredientName !== undefined).to.be.true;
            expect(fetchedIngredients[i].ingredientName === foundExpectedIngredient.ingredientName).to.be.true;
            expect(fetchedIngredients[i].ingredientMeasurementUnit !== undefined).to.be.true;
            expect(fetchedIngredients[i].ingredientMeasurementUnit === foundExpectedIngredient.ingredientMeasurementUnit).to.be.true;
            expect(fetchedIngredients[i].ingredientPrice !== undefined).to.be.true;
            expect(fetchedIngredients[i].ingredientPrice === foundExpectedIngredient.ingredientPrice).to.be.true;
            expect(fetchedIngredients[i].ingredientQuantity !== undefined).to.be.true;
            expect(fetchedIngredients[i].ingredientQuantity === foundExpectedIngredient.ingredientQuantity).to.be.true;
          }

          /////////////////////////
          //////// teardown ///////
          /////////////////////////
          // delete possible reference
          // to mock product inside dynamodb table
          const dynamoDbDeleteTasks: any[] = [];
          for (let i = 0; i < ingredients.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'ingredients',
                Key:{
                  ingredientId: ingredients[i].ingredientId
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
          for (let i = 0; i < ingredients.length; i++) {
            dynamoDbDeleteTasks.push(
              dynamoDb.documentClient.delete({
                TableName: 'ingredients',
                Key:{
                  ingredientId: ingredients[i].ingredientId
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