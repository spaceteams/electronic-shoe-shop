import type { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { NextjsGlobalFunctions } from 'cdk-nextjs'
import { join } from 'node:path'
import { Persistence } from './persistence'
import { Auth } from './auth'
import { Streams } from './streams'
import { CacheCookieBehavior, FunctionUrlOriginAccessControl, Signing } from 'aws-cdk-lib/aws-cloudfront'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'

export class ProdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const persistence = new Persistence(this, 'Persistence')
    const auth = new Auth(this, 'Auth')
    new Streams(this, 'Streams', persistence)

    const app = new NextjsGlobalFunctions(this, 'Shop Front', {
      healthCheckPath: '/api/health',
      buildContext: join(__dirname, '../../../'),
      relativePathToPackage: './apps/shop-front',
      overrides: {
        nextjsDistribution: {
          dynamicCachePolicyProps: {
            cookieBehavior: CacheCookieBehavior.all(),
          },
          dynamicFunctionUrlOriginWithOACProps: {
            originAccessControl: new FunctionUrlOriginAccessControl(this, 'FuncAC', {
              signing: Signing.NEVER,
            }),
          },
        },
        nextjsFunctions: {
          functionUrlProps: {
            authType: FunctionUrlAuthType.NONE,
          },
        },
      },
    })

    app.nextjsFunctions.function.addEnvironment('COGNITO_CLIENT_ID', auth.userPoolClient.userPoolClientId)
    app.nextjsFunctions.function.addEnvironment('NEXTAUTH_SECRET', '7lJVRQrzBOJdnxQxXa1n31NIMQQGEMvBLglaekNgFrc=')
    app.nextjsFunctions.function.addEnvironment('NEXTAUTH_URL', 'https://d33ds5lra0win5.cloudfront.net')

    app.nextjsFunctions.function.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:*'],
        resources: [
          persistence.productTable.tableArn,
          persistence.userTable.tableArn,
          persistence.ordersTable.tableArn,
        ],
      }),
    )

    app.nextjsFunctions.function.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-idp:InitiateAuth', 'cognito-idp:GetUser'],
        resources: [auth.userPool.userPoolArn],
      }),
    )
  }
}
