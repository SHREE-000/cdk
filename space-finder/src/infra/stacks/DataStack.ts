import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table as DynamoTable, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';

export class DataStack extends Stack {
    public readonly spaceTable: ITable;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const stackSuffix = getSuffixFromStack(this);
        this.spaceTable = new DynamoTable(this, "SpaceTable", {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: `SpaceTable-${stackSuffix}`
        })
    }

}