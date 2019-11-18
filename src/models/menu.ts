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
import { ProductInterface, Product } from './product';

// libs

/**
 *
 *
 * @export
 * @interface MenuInterface
 */
export interface MenuInterface {
  products: ProductInterface[]
}

/**
 *
 *
 * @export
 * @class Menu
 * @implements {MenuInterface}
 */
@ObjectType({ description: 'Menu Model' })
export class Menu implements MenuInterface {

  /**
   *
   *
   * @type {Product[]}
   * @memberof Menu
   */
  @ScopeAuthorization(['*'])
  @Field((_type: any) => [Product], { nullable: true })
  public products: Product[];

  /**
   * Creates an instance of Menu.
   * @param {MenuInterface} menu
   * @memberof Menu
   */
  public constructor(menu: MenuInterface) {
    this.products = _.get(menu, 'products', [] as ProductInterface[]).map((product: Product) => {
      return new Product(product);
    });
  }
}