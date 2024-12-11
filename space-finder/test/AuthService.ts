import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn} from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = 'ap-south-1'
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_9Wex4Hdyt',
            userPoolClientId: '2idolpmn6pcorvhq20nc2o8vk4',
            identityPoolId: 'ap-south-1:7d421c4d-783b-4da5-a297-f9d93cfda12a'
        }
    }
})
export class AuthService {
    public async login(userName: string, password: string) {
        const signInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });
        return signInOutput;
    }
    /**
     * call only after login
     */
    public async getIdToken(){
        const authSession = await fetchAuthSession();
        console.log(authSession.tokens?.idToken?.toString(),'token');
        return authSession.tokens?.idToken?.toString();
    }

    public async generateTemporaryCredentials(){
        const idToken = await this.getIdToken();
        if (!idToken) {
            throw new Error("ID Token is undefined. Ensure the user is authenticated.");
        }
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-south-1_9Wex4Hdyt`
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'eu-west-1:1da4e8fd-e5a6-4b45-91e8-2f4a7aa13db9',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials
    }
}