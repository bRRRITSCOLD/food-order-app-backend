// node_modules
import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as dontenvSafe from 'dotenv-safe';

/**
 *
 *
 * @interface LoadRequestInterface
 */
interface LoadRequestInterface {

  /**
   *
   *
   * @type {string}
   * @memberof LoadRequestInterface
   */
  envExamplePath?: string;

  /**
   *
   *
   * @type {{
   *     config?: AWS.Config;
   *     ssm?: {
   *       localSsm?: boolean;
   *       kms?: boolean;
   *       localKms?: boolean;
   *       paramPath?: string;
   *     }
   *   }}
   * @memberof LoadRequestInterface
   */
  aws?: {

    /**
     *
     *
     * @type {AWS.Config}
     */
    config?: AWS.Config;

    /**
     *
     *
     * @type {boolean}
     */
    ssm?: boolean;

    /**
     *
     *
     * @type {boolean}
     */
    localSsm?: boolean;

    /**
     *
     *
     * @type {boolean}
     */
    kms?: boolean;

    /**
     *
     *
     * @type {string}
     */
    paramPath?: string;
  }
}

/**
 *
 *
 * @class Environment
 */
class Environment {

  /**
   *
   *
   * @static
   * @param {LoadRequestInterface} [loadRequestInterface={}]
   * @memberof Environment
   */
  public static async load(loadRequest: LoadRequestInterface = {}) {
    try {
      // default and deconstruct
      // for ease of use
      const {
        envExamplePath,
        aws: {
          config: awsConfig,
          ssm,
          localSsm,
          kms,
          localKms,
          paramPath
        }
      } = loadRequest as any;
      // parse env examples
      const exampleVars: string[] = Object.keys(dotenv.parse(fs.readFileSync(envExamplePath)));
      // load dependent on chosen
      // env store type
      if (ssm) {
        // create instance of ssm
        // with or without given
        // aws config
        const ssmInstance = new AWS.SSM(
          awsConfig
            ? {
                ...awsConfig,
                // if a user would like to use
                // a deployed localstack then
                // set endpoint
                endpoint: localSsm
                  ? _.isBoolean(localSsm) ? `http://localhost:4583` : localSsm
                  : undefined
              }
            : {
                // if a user would like to use
                // a deployed localstack then
                // set endpoint
                endpoint: localSsm
                  ? _.isBoolean(localSsm) ? `http://localhost:4583` : localSsm
                  : undefined
              }
        );
        // initaite holder for
        // ssm responses, initial
        // request to ssm and frequest
        // completed flag
        let ssmResponse: AWS.Request<AWS.SSM.GetParametersByPathResult, AWS.AWSError> | any;
        let initialRequest: boolean = true;
        let requestCompleted: boolean = false;
        // loop through ssmResponse
        // while no next token exists
        while (!requestCompleted) {
          // if there is no next token
          // then enter else enter other
          // block
          if (!ssmResponse || !(ssmResponse as AWS.SSM.GetParametersByPathResult | any).NextToken) {
            // if it is the intial
            // request then enter
            // else enter other
            // block
            if (initialRequest) {
              ssmResponse = await ssmInstance.getParametersByPath({
                Path: paramPath,
                WithDecryption: localKms || kms
                  ? true
                  : false
              }).promise();
              // attempt to set the env vars
              // given in the env example file
              for (let i = 0; i < exampleVars.length; i++) {
                // find the given parsed env
                // var in the ssm response
                const foundSsmParameter = (ssmResponse as AWS.SSM.GetParametersByPathResult | any).Parameters.find((ssmParameter: AWS.SSM.Parameter) => {
                  return ssmParameter.Name === exampleVars[i];
                });
                // if the ssm parameter is found then
                // set it in the process's environment
                // as a "global" environment variable
                if (foundSsmParameter) process.env[
                  foundSsmParameter.Name.replace(new RegExp(`${paramPath}`, 'g'), '')
                ] = foundSsmParameter.Value;
              }
              // flag that it is no longer the "initial" request
              initialRequest = false;
            } else {
              // flag that the loop is completed -
              // that we are finished retrieving
              // params from the ssm parameter store
              requestCompleted = true;
            }
          } else {
            ssmResponse = await ssmInstance.getParametersByPath({
              Path: paramPath,
              WithDecryption: localKms || kms
                ? true
                : false,
              NextToken: (ssmResponse as AWS.SSM.GetParametersByPathResult).NextToken
            });
            // attempt to set the env vars
            // given in the env example file
            for (let i = 0; i < exampleVars.length; i++) {
              // find the given parsed env
              // var in the ssm response
              const foundSsmParameter = (ssmResponse as AWS.SSM.GetParametersByPathResult | any).Parameters.find((ssmParameter: AWS.SSM.Parameter) => {
                return ssmParameter.Name === exampleVars[i];
              });
              // if the ssm parameter is found then
              // set it in the process's environment
              // as a "global" environment variable
              if (foundSsmParameter) process.env[
                foundSsmParameter.Name.replace(new RegExp(`${paramPath}`, 'g'), '')
              ] = foundSsmParameter.Value;
            }
          }
        }
      }
      // check env and verify
      // it is set correctly
      dontenvSafe.config({
        example: envExamplePath
      });
      // return explicity
      return;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}

// export
export {
  Environment,
  LoadRequestInterface
};