// node_modules
import chai from 'chai';
import "reflect-metadata"
import { uuid } from 'uuidv4';
import * as _ from 'lodash';

// libraries

// models
import {
  MenuCategory,
  Menu
} from '../../../src/models/menu';
import { Product } from '../../../src/models/product';
import { Ingredient } from '../../../src/models/ingredient';

// file constants/variables
const expect = chai.expect;

describe('Menu Models Unit Tests', () => {
  before(async () => {
    try {
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

  describe('{}MenuCategory', () => {
    // instantiate all mock data
    // that we wish use to for/during
    // this test
    const menuCategory = {
      menuCategoryId: uuid(),
      menuCategoryName: 'Lunch',
      menuCategoryDescription: 'Perfect selection for those afternoon refuelings',
      menuCategoryProducts: [
        {
          productId: uuid(),
          productName: 'Cheeseburger',
          productIngredients: [
            {
              ingredientId: uuid(),
              ingredientName: 'Raw Hamburger',
              ingredientPrice: 1.25,
              ingredientMeasurementUnit: 'LB',
              ingredientQuantity: .5
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
              ingredientName: 'Cheese Slice',
              ingredientPrice: .70,
              ingredientMeasurementUnit: 'PER',
              ingredientQuantity: 1
            }
          ]
        },
        {
          productId: uuid(),
          productName: 'French Fries',
          productIngredients: [
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
              ingredientName: 'Potatoes',
              ingredientPrice: 3,
              ingredientMeasurementUnit: 'LB',
              ingredientQuantity: .2
            }
          ]
        }
      ]
    };

    describe('#construcotr', () => {
      it('- should create and return properly mapped instance of MenuCategory class', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_MENU_CATEGORY_INSTANCE = MenuCategory;
          const EXPECTED_MENU_CATEGORY_INGREDIENT_OBJECT = { ...menuCategory };
          const EXPECTED_ARRAY_INSTANCE = Array;
          const EXPECTED_PRODUCT_INSTANCE = Product;
          const EXPECTED_INGREDIENT_INSTANCE = Ingredient

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // execute function to be tested
          const newMenuCategory = new MenuCategory(menuCategory);
          // run first batch of
          // test assertions
          expect(newMenuCategory instanceof EXPECTED_MENU_CATEGORY_INSTANCE).to.be.true;
          expect(
            newMenuCategory.menuCategoryId !== undefined &&
            newMenuCategory.menuCategoryId === EXPECTED_MENU_CATEGORY_INGREDIENT_OBJECT.menuCategoryId
          ).to.be.true;
          expect(
            newMenuCategory.menuCategoryName !== undefined &&
            newMenuCategory.menuCategoryName === EXPECTED_MENU_CATEGORY_INGREDIENT_OBJECT.menuCategoryName
          ).to.be.true;
          expect(
            newMenuCategory.menuCategoryDescription !== undefined &&
            newMenuCategory.menuCategoryDescription === EXPECTED_MENU_CATEGORY_INGREDIENT_OBJECT.menuCategoryDescription
          ).to.be.true;
          expect(newMenuCategory.menuCategoryProducts instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          for (let i = 0; i < newMenuCategory.menuCategoryProducts.length; i++) {
            expect(
              newMenuCategory.menuCategoryProducts[i] instanceof EXPECTED_PRODUCT_INSTANCE
            ).to.be.true;
            for (let j = 0; j < newMenuCategory.menuCategoryProducts[i].productIngredients.length; j++) {
              expect(
                newMenuCategory.menuCategoryProducts[i].productIngredients[j] instanceof EXPECTED_INGREDIENT_INSTANCE
              ).to.be.true;
            }
          }
          /////////////////////////
          //////// teardown ///////
          /////////////////////////

          // return explicily
          return;
        } catch (error) {
          // throw explicitly
          throw error;
        }
      });
    });
  });
})