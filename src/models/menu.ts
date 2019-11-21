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
 * @interface MenuCategoryInterface
 */
export interface MenuCategoryInterface {
  menuCategoryId: string;
  menuCategoryName: string;
  menuCategoryDescription: string;
  menuCategoryProducts: ProductInterface[]
}

/**
 *
 *
 * @export
 * @class MenuCategory
 * @implements {MenuCategoryInterface}
 */
@ObjectType({ description: 'Menu Category Model' })
export class MenuCategory implements MenuCategoryInterface {
  
  /**
   *
   *
   * @type {string}
   * @memberof MenuCategory
   */
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public menuCategoryId: string;

  /**
   *
   *
   * @type {string}
   * @memberof MenuCategory
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public menuCategoryName: string;

  /**
   *
   *
   * @type {string}
   * @memberof MenuCategory
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public menuCategoryDescription: string;

  /**
   *
   *
   * @type {Product[]}
   * @memberof MenuCategory
   */
  @ScopeAuthorization(['*'])
  @Field(_type => [Product], { nullable: true })
  public menuCategoryProducts: Product[];

  /**
   * Creates an instance of MenuCategory.
   * @param {MenuCategoryInterface} menuCategory
   * @memberof MenuCategory
   */
  public constructor(menuCategory: MenuCategoryInterface) {
    Object.assign(this, {
      ...menuCategory,
      menuCategoryId: _.get(menuCategory, 'menuCategoryId'),
      menuCategoryName: _.get(menuCategory, 'menuCategoryName'),
      menuCategoryDescription: _.get(menuCategory, 'menuCategoryDescription'),
      menuCategoryProducts: _.get(menuCategory, 'menuCategoryProducts', [] as ProductInterface[])
        .map((product: ProductInterface) => {
          return new Product({
            ...product
          });
        })
    })
  }
}

/**
 *
 *
 * @export
 * @interface MenuInterface
 */
export interface MenuInterface {
  menuId: string;
  menuName: string;
  menuCategories: MenuCategoryInterface[]
}

/**
 *
 *
 * @export
 * @class Menu
 */
@ObjectType({ description: 'Menu Model' })
export class Menu implements MenuInterface {

  /**
   *
   *
   * @type {string}
   * @memberof Menu
   */
  @ScopeAuthorization(['*'])
  @Field(_type => ID, { nullable: true })
  public menuId: string;

  /**
   *
   *
   * @type {string}
   * @memberof Menu
   */
  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public menuName: string;

  /**
   *
   *
   * @type {MenuCategory[]}
   * @memberof Menu
   */
  @ScopeAuthorization(['*'])
  @Field(_type => [MenuCategory], { nullable: true })
  public menuCategories: MenuCategory[];

  /**
   * Creates an instance of Menu.
   * @param {MenuInterface} menu
   * @memberof Menu
   */
  public constructor(menu: MenuInterface) {
    Object.assign(this, {
      ...menu,
      menuId: _.get(menu, 'menuId', uuid()),
      menuName: _.get(menu, 'menuName', uuid()),
      menuCategories: _.get(menu, 'menuCategories', [] as MenuCategoryInterface[])
        .map((menuCategory: MenuCategoryInterface) => {
          return new MenuCategory({
            ...menuCategory
          });
        })
    })
  }
}