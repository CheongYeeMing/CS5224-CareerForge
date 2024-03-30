import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const SecretsManager = {
  async getSecret(region = 'us-east-1') {
    const client = new SecretsManagerClient({ region });

    try {
      const response = await client.send(
        new GetSecretValueCommand({
          SecretId: 'careerSecrets',
          VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
      console.log(response.SecretString);

      return response.SecretString;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default SecretsManager;
