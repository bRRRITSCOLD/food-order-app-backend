import { DynamoDB as Dynamo } from 'aws-sdk';

/**
 *
 *
 * @export
 * @interface DynamoDBInterface
 */
export interface DynamoDBInterface {
  documentClient: Dynamo.DocumentClient;
}

/**
 *
 *
 * @class DynamoDB
 */
export class DynamoDB {

  /**
   *
   *
   * @type {Dynamo.DocumentClient}
   * @memberof DynamoDB
   */
  public documentClient: Dynamo.DocumentClient;

  /**
   * Creates an instance of DynamoDB.
   * @memberof DynamoDB
   */
  public constructor() {}

  /**
   *
   *
   * @param {(Dynamo.DocumentClient.DocumentClientOptions & Dynamo.Types.ClientConfiguration)} dynamoDbConfig
   * @memberof DynamoDB
   */
  public init(
    dynamoDbConfig:
      Dynamo.DocumentClient.DocumentClientOptions &
      Dynamo.Types.ClientConfiguration
  ) {
    this.documentClient = new Dynamo.DocumentClient(dynamoDbConfig);
  }
}