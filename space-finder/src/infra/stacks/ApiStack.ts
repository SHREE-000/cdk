import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { AuthorizationToken } from 'aws-cdk-lib/aws-ecr';

interface ApiStackProps extends StackProps {
    // helloLambdaIntegration: LambdaIntegration
    spacesLambdaIntegration: LambdaIntegration,
    userPool: IUserPool;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, "SpaceApi");
        const spacesResource = api.root.addResource("spaces");

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
            cognitoUserPools:[props.userPool],
            identitySource: 'method.request.header.Authorization'
        });
        authorizer._attachToApi(api);
        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }

        // spacesResource.addMethod("GET");
        // spacesResource.addMethod('GET', props.spacesLambdaIntegration);
        // spacesResource.addMethod('POST', props.spacesLambdaIntegration);
        spacesResource.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('POST', props.spacesLambdaIntegration,optionsWithAuth);
    }
}