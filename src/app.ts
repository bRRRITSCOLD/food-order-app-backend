// node_modules
import fastify from 'fastify';
const GQL = require('fastify-gql');
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as _ from 'lodash';
const argv = require('yargs').argv

/**
 *
 *
 * @returns {Promise<fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>>}
 */
async function init(resolvers: string[]): Promise<fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>> {
  try {
    // app
    const fastifyApp = fastify({ logger: true });
    // register any middleware we may want
    fastifyApp.register(require('fastify-cors'), {});
    // build the graphql schema
    const schema = await buildSchema({
      resolvers,
      container: Container,
    });
    // register the graphql information
    fastifyApp.register(GQL, {
      schema,
      graphiql: true,
    });
    // return our listener/app
    return fastifyApp;
  } catch (error) {
    // throw explicity
    throw error;
  }
};

// if file is executed directly
// then we want to listen automatically -
// indicates it is not a serverles envirnonment -
// else export for use in serverless environment
if (require.main === module) {
  // called directly i.e. "node app"
  (async () => {
    try {
      console.log(JSON.stringify(argv));
      const app = await init(argv.resolvers.split(',').map((resolverPath: string) => {
        return __dirname + resolverPath;
      }));
      app.listen(3000, (err: any) => {
        if (err) console.error(err);
        console.log('server listening on 3000');
      });
    } catch (error) {
      throw error;
    }
  })();
} else {
  // required as a module => executed on aws lambda
  module.exports = init;
}
