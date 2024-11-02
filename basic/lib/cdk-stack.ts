import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id)

    new Bucket(scope, "myL3Bucket", {
      lifecycleRules: [{
        expiration: cdk.Duration.days(expiration)
      }]
    })
  }
}
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    new CfnBucket(this, "myL1Bucket", {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 1,
          status: "Enabled"
        }]
      }
    })

    const duration = new cdk.CfnParameter(this, "duration", {
      default: 1,
      minValue: 1, 
      maxValue: 10,
      type: "Number"
    })

    const l2Bucket = new Bucket(this, "myL2Bucket", {
      lifecycleRules: [{
        expiration: cdk.Duration.days(duration.valueAsNumber)
      }]
    })

    new L3Bucket(this, "L3Bucket", 1)

    new cdk.CfnOutput(this, "myL2BucketName", {
      value: l2Bucket.bucketName
    })

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
