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
      name: 'Cheeseburger',
      ingredients: [
        {
          ingredientId: uuid(),
          name: 'Raw Hamburger',
          price: 1.25,
          measurementUnit: 'LB',
          quantity: .5
        },
        {
          ingredientId: uuid(),
          name: 'Hamburger Bun',
          price: .70,
          measurementUnit: 'PER',
          quantity: 1
        },
        {
          ingredientId: uuid(),
          name: 'Cheese Slice',
          price: .70,
          measurementUnit: 'PER',
          quantity: 1
        }
      ]
    };

    describe('#construcotr', () => {
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
            newProduct.name !== undefined &&
            newProduct.name === EXPECTED_PRODUCT_OBJECT.name
          ).to.be.true;
          expect(newProduct.ingredients instanceof EXPECTED_ARRAY_INSTANCE).to.be.true;
          for (let i = 0; i < newProduct.ingredients.length; i++)
            expect(newProduct.ingredients[i] instanceof EXPECTED_INGREDIENT_INSTANCE).to.be.true;

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

    describe('get #totalPrice', () => {
      it(`- should calculate the total price of the entire product`, async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_PRODUCT_TOTAL_PRICE = 2.025;

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // execute function to be tested
          const totalPrice = new Product(product).totalPrice;

          // run first batch of
          // test assertions
          expect(totalPrice === EXPECTED_PRODUCT_TOTAL_PRICE).to.be.true;

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