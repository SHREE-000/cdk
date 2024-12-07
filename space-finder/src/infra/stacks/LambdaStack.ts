import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
    spaceTable: ITable
}
export class LambdaStack extends Stack {

    // public readonly helloLambdaIntegration: LambdaIntegration;
    public readonly spacesLambdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        // // const helloLambda = new LambdaFunction(this, "helloLambda", {
        //     const helloLambda = new NodejsFunction(this, 'HelloLambda', {
        //     runtime: Runtime.NODEJS_20_X,
        //     // handler: "hello.main",
        //     // code: Code.fromAsset(join(__dirname, "..","..", "services")),
        //     handler: 'handler',
        //     entry: (join(__dirname, '..','..', 'services', 'hello.ts')),
        //     environment: {
        //         TABLE_NAME:  props.spaceTable.tableName
        //     }
        // });

        const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..','..', 'services', 'spaces', 'handler.ts')),
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });

        spacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.spaceTable.tableArn],
            actions:[
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:Scan'
            ]
        }))

        // helloLambda.addToRolePolicy(new PolicyStatement({
        //     effect: Effect.ALLOW,
        //     actions:[
        //         's3:ListAllMyBuckets',
        //         's3:ListBucket'
        //     ],
        //     resources: ["*"] // bad practice
        // }))

        // this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
        this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda)
    }
}