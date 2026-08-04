import { ContactEnquiry } from '../models/index.js';
import { notificationService } from '../notifications/index.js';
import { BaseService } from './base.service.js';

class ContactEnquiryService extends BaseService {
  constructor() {
    super(ContactEnquiry, {
      resourceName: 'Contact enquiry',
      searchFields: ['contactName', 'contactEmail', 'contactPhone', 'subject', 'message'],
      allowedFilters: ['status', 'contactEmail'],
      allowedSortFields: ['createdAt', 'updatedAt'],
      allowedSelectFields: [
        'contactName',
        'contactEmail',
        'contactPhone',
        'subject',
        'message',
        'status',
        'adminNotes',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async create(payload, options = {}) {
    const response = await super.create(payload, options);

    notificationService.sendContactEnquiryReceived(response.data);
    notificationService.sendNewContactEnquiryNotification(response.data);

    return response;
  }

  async update(id, payload, options = {}) {
    const currentContactEnquiry = await this.findById(id, { unwrap: true });
    const statusChanged = Boolean(
      payload.status && payload.status !== currentContactEnquiry.status
    );
    const response = await super.update(id, payload, options);

    if (statusChanged && ['resolved', 'closed'].includes(response.data.status)) {
      notificationService.sendContactEnquiryStatusUpdated(response.data);
    }

    return response;
  }
}

export const contactEnquiryService = new ContactEnquiryService();
