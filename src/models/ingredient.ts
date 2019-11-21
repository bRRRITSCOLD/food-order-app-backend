// node_modules
import * as _ from 'lodash';
import {
  ObjectType,
  Field,
  ID,
} from 'type-graphql';
import { inspect } from 'util'
import { uuid } from 'uuidv4';

// decorators
import { ScopeAuthorization } from '../decorators';

// libs
import { dynamoDb } from '../lib/aws';

/**
 *
 *
 * @export
 * @interface IngredientInterface
 */
export interface IngredientInterface {
  ingredientId: string;
  ingredientName: string;
  ingredientMeasurementUnit: string
  ingredientPrice: number;
  ingredientQuantity?: number;
}

/**
 *
 *
 * @export
 * @class Ingredient
 * @implements {IngredientInterface}
 */
@ObjectType({ description: 'Ingredient Model' })
export class Ingredient implements IngredientInterface {

  /**
   *
   *
   * @type {string}
   * @memberof Ingredient
   */
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public ingredientId: string;

  /**
   *
   *
   * @type {string}
   * @memberof Ingredient
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public ingredientName: string;

  /**
   *
   *
   * @type {string}
   * @memberof Ingredient
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public ingredientMeasurementUnit: string;

  /**
   *
   *
   * @type {number}
   * @memberof Ingredient
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public ingredientPrice: number;

  /**
   *
   *
   * @type {number}
   * @memberof Ingredient
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public ingredientQuantity?: number;

  /**
   * Creates an instance of Ingredient.
   * @param {IngredientInterface} ingredient
   * @memberof Ingredient
   */
  public constructor(ingredient: IngredientInterface) {
    Object.assign(this, {
      ...ingredient,
      ingredientId: _.get(ingredient, 'ingredientId', uuid()),
      ingredientName: _.get(ingredient, 'ingredientName'),
      ingredientPrice: _.get(ingredient, 'ingredientPrice'),
      ingredientMeasurementUnit: _.get(ingredient, 'ingredientMeasurementUnit'),
      ingredientQuantity: _.get(ingredient, 'ingredientQuantity'),
    });
  }

  /**
   *
   *
   * @static
   * @param {IngredientInterface} ingredient
   * @returns {Promise<Ingredient>}
   * @memberof Ingredient
   */
  public static async putOne(ingredient: IngredientInterface): Promise<Ingredient> {
    try {
      console.log(`[DEBUG] - {}Ingredient::#putOne::initiating execution`);
      // create new instance of Ingredient with
      // the passed in information - make sure
      // we are given proper Ingredient data
      const newIngredient = new Ingredient(ingredient);
      // put/create/update the item in the
      // ingredients dyanmodb table
      const putResponse = await dynamoDb.documentClient.put({
        TableName: 'ingredients',
        Item: { ...newIngredient }
      }).promise();
      console.log(`[DEBUG] - {}Ingredient::#putOne::successfully executed`);
      // return the created instance explicitly
      return newIngredient;
    } catch (error) {
      console.log(`[ERROR] - {}Ingredient::#putOne::error executing::error=${JSON.stringify(inspect(error))}`);
      // throw error explicitly
      throw error;
    }
  }

  public static async fetchManyByIngredientIds(ingredientIds: string[]): Promise<Ingredient[]> {
    try {
      console.log(`[DEBUG] - {}Ingredient::#fetchManyByIngredientIds::initiating execution`);
      // reduce the passed in ingredientId values into
      // the ExpressionAttributeValues object that is
      // used to query the dynamo db table
      const expressionAttributeValues = ingredientIds.reduce((obj: any, curr: string, currIdx: number) => {
        obj[`:ingredientId${currIdx + 1}`] = curr;
        return obj;
      }, {});
      // scan the ingredients dynamodb table
      // for the given ingredients that correlate
      // to the passed in ingredientIds
      const ingredientsScanReseponse = await dynamoDb.documentClient.scan({
        TableName : 'ingredients',
        FilterExpression : `ingredientId IN (${Object.keys(expressionAttributeValues).toString()})`,
        ExpressionAttributeValues : expressionAttributeValues
      }).promise();
      console.log(`[DEBUG] - {}Ingredient::#fetchManyByIngredientIds::successfully executed`);
      // take the response and map the found/scanned
      // items into a new array Ingredient instances
      return ingredientsScanReseponse.Items!.map((ingredient: any) => {
        return new Ingredient(ingredient)
      });
    } catch (error) {
      console.log(`[ERROR] - {}Ingredient::#fetchManyByIngredientIds::error executing::error=${JSON.stringify(inspect(error))}`);
      // explicitly throw error
      throw error;
    }
  }
}
