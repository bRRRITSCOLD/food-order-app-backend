// node_modules
import {
  ObjectType,
  ID,
  Field
} from "type-graphql";
import { uuid } from 'uuidv4';
import { inspect } from 'util'
import * as _ from 'lodash';

// decorators
import { ScopeAuthorization } from "../decorators";

// models
import { ProductInterface, Product } from "./product";

/**
 *
 *
 * @export
 * @interface MenuInterface
 */
export interface MenuInterface {
  menuId: string;
  products: ProductInterface[];
}

/**
 *
 *
 * @export
 * @class Menu
 */
@ObjectType({ description: 'Menu Model' })
export class Menu {

  /**
   *
   *
   * @type {string}
   * @memberof Menu
   */
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public productId: string;

  /**
   *
   *
   * @type {Product[]}
   * @memberof Menu
   */
  @ScopeAuthorization(['*'])
  @Field(_type => [Product], { nullable: true })
  public ingredients: Product[];

  /**
   *Creates an instance of Menu.
   * @param {MenuInterface} menu
   * @memberof Menu
   */
  public constructor(menu: MenuInterface) {
    Object.assign(this, {
      ...menu,
      menuItem: _.get(menu, 'menuId', uuid())
    })
  }
}