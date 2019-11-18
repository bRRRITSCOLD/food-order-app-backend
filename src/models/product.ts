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
import { dynamoDb } from '../lib/aws';

// libs


/**
 *
 *
 * @export
 * @interface MenuItemInterface
 */
export interface ProductInterface {
  productId: string;
  name: string;
  price: number;
  ingredients: string[] | any[];
}

/**
 *
 *
 * @export
 * @class MenuItem
 * @implements {MenuItemInterface}
 */
@ObjectType({ description: 'Menu Item Model' })
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
   * @type {number}
   * @memberof MenuItem
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public price: number;

  /**
   *
   *
   * @type {(string[] | any[])}
   * @memberof MenuItem
   */
  @ScopeAuthorization(['*'])
  @Field((_type: any) => [String], { nullable: true })
  public ingredients: string[];

  /**
   * Creates an instance of MenuItem.
   * @param {MenuItemInterface} menuItem
   * @memberof MenuItem
   */
  public constructor(product: ProductInterface) {
    this.productId = _.get(product, 'productId', uuid());
    this.name = _.get(product, 'name', '');
    this.price = _.get(product, 'price', 0);
    this.ingredients = _.get(product, 'ingredients', []);
  }

  /**
   *
   *
   * @static
   * @param {MenuItemInterface} menuItem
   * @returns {Promise<MenuItem>}
   * @memberof MenuItem
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
        TableName : "products",
        FilterExpression : "productId IN ("+Object.keys(expressionAttributeValues).toString()+ ")",
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
