// node_modules
import chai from 'chai';
import "reflect-metadata"
import { uuid } from 'uuidv4';
import * as _ from 'lodash';

// libraries

// models
import { Ingredient } from '../../../src/models/ingredient';

// file constants/variables
const expect = chai.expect;

describe('Ingredient Models Unit Tests', () => {
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

  describe('{}Ingredient', () => {
    // instantiate all mock data
    // that we wish use to for/during
    // this test
    const ingredient = {
      ingredientId: uuid(),
      ingredientName: 'Raw Hamburger',
      ingredientPrice: 1.25,
      ingredientMeasurementUnit: 'LB',
      ingredientQuantity: .5
    };

    describe('#construcotr', () => {
      it('- should create and return properly mapped instance of Ingredient class', async () => {
        try {
          /////////////////////////
          ///////// setup /////////
          /////////////////////////
          // store expected values for
          // testing purposes/ease
          const EXPECTED_INGREDIENT_INSTANCE = Ingredient;
          const EXPECTED_INGREDIENT_OBJECT = { ...ingredient };

          /////////////////////////
          ////////// test /////////
          /////////////////////////
          // execute function to be tested
          const newIngredient = new Ingredient(ingredient);
          // run first batch of
          // test assertions
          expect(newIngredient instanceof EXPECTED_INGREDIENT_INSTANCE).to.be.true;
          expect(
            newIngredient.ingredientId !== undefined &&
            newIngredient.ingredientId === EXPECTED_INGREDIENT_OBJECT.ingredientId
          ).to.be.true;
          expect(
            newIngredient.ingredientName !== undefined &&
            newIngredient.ingredientName === EXPECTED_INGREDIENT_OBJECT.ingredientName
          ).to.be.true;          expect(
            newIngredient.ingredientPrice !== undefined &&
            newIngredient.ingredientPrice === EXPECTED_INGREDIENT_OBJECT.ingredientPrice
          ).to.be.true;          expect(
            newIngredient.ingredientMeasurementUnit !== undefined &&
            newIngredient.ingredientMeasurementUnit === EXPECTED_INGREDIENT_OBJECT.ingredientMeasurementUnit
          ).to.be.true;          expect(
            newIngredient.ingredientQuantity !== undefined &&
            newIngredient.ingredientQuantity === EXPECTED_INGREDIENT_OBJECT.ingredientQuantity
          ).to.be.true;

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