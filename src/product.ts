// fixing ts global var
// redeclared error -
// tslint (hacky)
export {};

// node modules
const awsLambdaFastify = require('aws-lambda-fastify')
import "reflect-metadata"

// fastify graphql app
const init = require('./app');

// create a fastify proxy function
// that allows lamabda execution
// with a fastify app
const proxy = awsLambdaFastify(init('/api/product/**/*.resolver.ts'))

// export aws lambda handler
exports.handler = async (event: any, context: any) => {
  try {
    proxy(event, context);
  } catch (error) {
    throw error;
  }
};
