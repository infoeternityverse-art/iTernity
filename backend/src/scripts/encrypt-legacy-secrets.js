import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Credential } from '../models/index.js';
import { Workspace } from '../workspace/models/index.js';
import {
  encryptCredentialSecret,
  isEncryptedCredentialSecret,
} from '../utils/credential-secret.js';

const migrateSecrets = async () => {
  await connectDatabase();

  const [credentials, workspaces] = await Promise.all([
    Credential.find().select('+passwordEncrypted').lean(),
    Workspace.find().select('+sshPassword').lean(),
  ]);
  const credentialUpdates = credentials
    .filter((record) => record.passwordEncrypted && !isEncryptedCredentialSecret(record.passwordEncrypted))
    .map((record) => ({
      updateOne: {
        filter: { _id: record._id },
        update: {
          $set: { passwordEncrypted: encryptCredentialSecret(record.passwordEncrypted) },
        },
      },
    }));
  const workspaceUpdates = workspaces
    .filter((record) => record.sshPassword && !isEncryptedCredentialSecret(record.sshPassword))
    .map((record) => ({
      updateOne: {
        filter: { _id: record._id },
        update: { $set: { sshPassword: encryptCredentialSecret(record.sshPassword) } },
      },
    }));

  if (credentialUpdates.length) {
    await Credential.bulkWrite(credentialUpdates);
  }

  if (workspaceUpdates.length) {
    await Workspace.bulkWrite(workspaceUpdates);
  }

  console.log(
    `Encrypted ${credentialUpdates.length} credential secret(s) and ${workspaceUpdates.length} workspace secret(s).`
  );
};

try {
  await migrateSecrets();
} catch (error) {
  console.error('Secret migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
