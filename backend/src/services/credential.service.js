import {
  Credential,
  CREDENTIAL_STATUSES,
  Enquiry,
  GpuPackage,
  User,
  USER_ROLES,
} from '../models/index.js';
import { notificationService } from '../notifications/index.js';
import { decryptCredentialSecret, encryptCredentialSecret } from '../utils/credential-secret.js';
import { ValidationError } from '../utils/errors.js';
import { BaseService } from './base.service.js';

class CredentialService extends BaseService {
  constructor() {
    super(Credential, {
      resourceName: 'Credential',
      searchFields: ['host', 'username', 'sshCommand', 'accessInstructions'],
      allowedFilters: ['customer', 'enquiry', 'gpuPackage', 'status', 'host', 'username'],
      allowedSortFields: ['createdAt', 'updatedAt', 'issuedAt', 'expiresAt'],
      allowedSelectFields: [
        'customer',
        'enquiry',
        'gpuPackage',
        'host',
        'port',
        'username',
        'sshCommand',
        'accessInstructions',
        'status',
        'issuedBy',
        'issuedAt',
        'expiresAt',
        'revokedAt',
        'createdAt',
        'updatedAt',
      ],
      allowedPopulate: ['customer', 'enquiry', 'gpuPackage', 'issuedBy'],
    });
  }

  async validateAssociations({ customer, enquiry, gpuPackage }) {
    const [customerRecord, enquiryRecord, packageExists] = await Promise.all([
      User.findOne({ _id: customer, role: USER_ROLES.CUSTOMER, isActive: true }).select('_id'),
      Enquiry.findById(enquiry).select('customer gpuPackage'),
      GpuPackage.exists({ _id: gpuPackage }),
    ]);

    if (!customerRecord || !enquiryRecord || !packageExists) {
      throw new ValidationError('Credential customer, enquiry, or GPU package is invalid.');
    }

    if (
      String(enquiryRecord.customer || '') !== String(customer) ||
      String(enquiryRecord.gpuPackage) !== String(gpuPackage)
    ) {
      throw new ValidationError(
        'Credential customer and GPU package must match the selected enquiry.'
      );
    }
  }

  async create(payload, options = {}) {
    await this.validateAssociations(payload);
    const response = await super.create(payload, options);
    const credential = await this.findById(response.data._id, {
      populate: ['customer', 'gpuPackage'],
      unwrap: true,
    });

    notificationService.sendCredentialIssued({
      credential,
      customer: credential.customer,
      gpuPackage: credential.gpuPackage,
    });

    return response;
  }

  async update(id, payload, options = {}) {
    const current = await this.findById(id, { unwrap: true });
    const associations = {
      customer: payload.customer || current.customer,
      enquiry: payload.enquiry || current.enquiry,
      gpuPackage: payload.gpuPackage || current.gpuPackage,
    };

    await this.validateAssociations(associations);

    return super.update(
      id,
      {
        ...payload,
        ...(payload.passwordEncrypted
          ? { passwordEncrypted: encryptCredentialSecret(payload.passwordEncrypted) }
          : {}),
      },
      options
    );
  }

  findActiveForCustomer(customerId, options = {}) {
    return this.findMany({
      ...options,
      filters: {
        ...options.filters,
        customer: customerId,
        status: CREDENTIAL_STATUSES.ACTIVE,
      },
    });
  }

  async findActiveForCustomerWithSecrets(customerId, options = {}) {
    const response = await this.findActiveForCustomer(customerId, options);
    const credentialIds = response.data.map((credential) => credential._id);
    const credentialsWithPasswords = await Credential.find({ _id: { $in: credentialIds } }).select(
      '+passwordEncrypted'
    );
    const passwordById = new Map(
      credentialsWithPasswords.map((credential) => [
        credential._id.toString(),
        decryptCredentialSecret(credential.passwordEncrypted),
      ])
    );

    response.data = response.data.map((credential) => {
      const credentialObject = credential.toJSON();
      credentialObject.password = passwordById.get(credential._id.toString()) || '';
      return credentialObject;
    });

    return response;
  }

  findExpiredCandidates(date = new Date(), options = {}) {
    return this.findMany({
      ...options,
      filters: {
        ...options.filters,
        status: CREDENTIAL_STATUSES.ACTIVE,
      },
      extraFilter: {
        expiresAt: { $lte: date },
      },
    });
  }
}

export const credentialService = new CredentialService();
