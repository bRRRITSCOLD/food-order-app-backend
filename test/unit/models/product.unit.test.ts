// node_modules
import chai from 'chai';
import "reflect-metadata"
import { uuid } from 'uuidv4';
import * as _ from 'lodash';

// libraries

// models
import { Product } from '../../../src/models/product';
import { Ingredient } from '../../../src/models/ingredient';

// file constants/variables
const expect = chai.expect;

describe('Product Models Unit Tests', () => {
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

  describe('{}Product', () => {
    // instantiate all mock data
    // that we wish use to for/during
    // this test
    const product = {
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
      ]
    };

    describe('#constructor', () => {
      it('- should create and return properly mapped instance of Product class', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_PRODUCT_INSTANCE = Product;
          const EXPECTED_PRODUCT_OBJECT = { ...product };
          const EXPECTED_ARRAY_INSTANCE = Array;
          const EXPECTED_INGREDIENT_INSTANCE = Ingredient;

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // execute function to be tested
          const newProduct = new Product(product);
          // run first batch of
          // test assertions
          expect(newProduct instanceof EXPECTED_PRODUCT_INSTANCE).to.be.true;
          expect(
            newProduct.productId !== undefined &&
            newProduct.productId === EXPECTED_PRODUCT_OBJECT.productId
          ).to.be.true;
          expect(
            newProduct.productName !== undefined &&
            newProduct.productName === EXPECTED_PRODUCT_OBJECT.productName
          ).to.be.true;
          expect(newProduct.productIngredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          for (let i = 0; i < newProduct.productIngredients.length; i++)
            expect(newProduct.productIngredients[i] instanceof EXPECTED_INGREDIENT_INSTANCE).to.be.true;

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

    describe('get #totalProductIngredientsPrice', () => {
      it(`- should calculate the total price for all ingredients in the entire product`, async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_PRODUCT_TOTAL__PRODUCT_INGREDIENTS_PRICE = 3.625;

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // execute function to be tested
          const totalProductIngredientsPrice = new Product(product).totalProductIngredientsPrice;

          // run first batch of
          // test assertions
          expect(totalProductIngredientsPrice === EXPECTED_PRODUCT_TOTAL__PRODUCT_INGREDIENTS_PRICE).to.be.true;

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