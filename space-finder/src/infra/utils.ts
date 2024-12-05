import {Fn, Stack} from 'aws-cdk-lib';
import { APIGatewayProxyEvent } from "aws-lambda";


export function getSuffixFromStack(stack: Stack) {
    const shortStackId = Fn.select(2, Fn.split('/', stack.stackId))
    const stackSuffix = Fn.select(4, Fn.split('-', shortStackId))
    return stackSuffix;
}

export function hasAdminGroup(event: APIGatewayProxyEvent){
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes('admins');
    }
    return false;
}