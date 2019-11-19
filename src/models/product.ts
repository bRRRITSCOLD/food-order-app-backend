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
import { Ingredient, IngredientInterface } from './ingredient';

/**
 *
 *
 * @export
 * @interface ProductInterface
 */
export interface ProductInterface {
  productId: string;
  name: string;
  ingredients: IngredientInterface[];
  totalPrice?: number;
}

/**
 *
 *
 * @export
 * @class MenuItem
 * @implements {MenuItemInterface}
 */
@ObjectType({ description: 'pRODUCT Model' })
export class Product implements ProductInterface {
  /**
   *
   *
   * @type {string}
   * @memberof MenuItem
   */
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public productId: string;

  /**
   *
   *
   * @type {string}
   * @memberof MenuItem
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public name: string;

  /**
   *
   *
   * @type {(string[] | any[])}
   * @memberof MenuItem
   */
  @ScopeAuthorization(['*'])
  @Field(_type => [Ingredient], { nullable: true })
  public ingredients: Ingredient[];

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof Product
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public get totalPrice(): number {
    return this.ingredients.reduce((totalPrice: number, curr: Ingredient) => {
      totalPrice = totalPrice + (curr.price * _.get(curr, 'quantity', 0));
      return totalPrice;
    }, 0);
  }

  /**
   * Creates an instance of MenuItem.
   * @param {MenuItemInterface} menuItem
   * @memberof MenuItem
   */
  public constructor(product: ProductInterface) {
    Object.assign(this, {
      ...product,
      productId: _.get(product, 'productId', uuid()),
      name: _.get(product, 'name', ''),
      ingredients: _.get(product, 'ingredients', [] as IngredientInterface[])
        .map((ingredient: IngredientInterface) => new Ingredient(ingredient)),
    });
  }

  /**
   *
   *
   * @static
   * @param {ProductInterface} product
   * @returns {Promise<Product>}
   * @memberof Product
   */
  public static async putOne(product: ProductInterface): Promise<Product> {
    try {
      console.log(`[DEBUG] - {}Product::#putOne::initiating execution`);
      // create new instance of Product with
      // the passed in information - make sure
      // we are given proper Product data
      const newProduct = new Product(product);
      // put/create/update the item in the
      // products dyanmodb table
      const putResponse = await dynamoDb.documentClient.put({
        TableName: 'products',
        Item: { ...newProduct }
      }).promise();
      console.log(`[DEBUG] - {}Product::#putOne::successfully executed`);
      // return the created instance explicitly
      return newProduct;
    } catch (error) {
      console.log(`[ERROR] - {}Product::#putOne::error executing::error=${JSON.stringify(inspect(error))}`);
      // throw error explicitly
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {string[]} productIds
   * @returns {Promise<Product[]>}
   * @memberof Product
   */
  public static async fetchManyByProductIds(productIds: string[]): Promise<Product[]> {
    try {
      console.log(`[DEBUG] - {}Product::#fetchManyByProductIds::initiating execution`);
      // reduce the passed in productId values into
      // the ExpressionAttributeValues object that is
      // used to query the dynamo db table
      const expressionAttributeValues = productIds.reduce((obj: any, curr: string, currIdx: number) => {
        obj[`:productId${currIdx + 1}`] = curr;
        return obj;
      }, {});
      // scan the products dynamodb table
      // for the given products that correlate
      // to the passed in productIds
      const productsScanReseponse = await dynamoDb.documentClient.scan({
        TableName : 'products',
        FilterExpression : `productId IN (${Object.keys(expressionAttributeValues).toString()})`,
        ExpressionAttributeValues : expressionAttributeValues
      }).promise();
      console.log(`[DEBUG] - {}Product::#fetchManyByProductIds::successfully executed`);
      // take the response and map the found/scanned
      // items into a new array Product instances
      return productsScanReseponse.Items!.map((product: any) => {
        return new Product(product)
      });
    } catch (error) {
      console.log(`[ERROR] - {}Product::#fetchManyByProductIds::error executing::error=${JSON.stringify(inspect(error))}`);
      // explicitly throw error
      throw error;
    }
  }
}
