import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from "constructs";

export class PhotoStack extends cdk.Stack {
    private stackSuffix: string;
    public readonly photoBucketArn: string;
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      this.initialiseSuffix();
      const photosBucket = new Bucket(this, 'photoBucket', {
        bucketName: `photobucketnew-${this.stackSuffix}`
      });

      this.photoBucketArn = photosBucket.bucketArn;

    //   new cdk.CfnOutput(this, 'photos-bucket', {
    //     value:photosBucket.bucketArn,
    //     exportName: 'photos-bucket'
    // })
    //   (myBucket.node.defaultChild as CfnBucket).overrideLogicalId("xyz")
    }
    private initialiseSuffix() {
        const shortStackId = cdk.Fn.select(2, cdk.Fn.split('/', this.stackId))
        this.stackSuffix = cdk.Fn.select(4, cdk.Fn.split('-', shortStackId))
    }
}