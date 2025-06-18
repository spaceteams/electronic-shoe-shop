import { Construct } from 'constructs'
import { CfnOutput, Duration } from 'aws-cdk-lib'
import * as cognito from 'aws-cdk-lib/aws-cognito'

export class Auth extends Construct {
  userPool: cognito.UserPool
  userPoolClient: cognito.UserPoolClient

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'shop-user-pool',
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      signInPolicy: {
        allowedFirstAuthFactors: { password: true },
      },
      passwordPolicy: {
        minLength: 8,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: true,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    })

    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'shop-user-pool-client',
      authFlows: {
        userPassword: true,
      },
      generateSecret: false,
      preventUserExistenceErrors: true,
      accessTokenValidity: Duration.hours(1),
      idTokenValidity: Duration.hours(1),
      refreshTokenValidity: Duration.days(30),
    })

    new cognito.UserPoolDomain(this, 'UserPoolDomain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: 'hiring-process-shop-front-web-app-auth',
      },
    })
  }
}
