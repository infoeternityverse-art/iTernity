import { Enquiry, USER_ROLES } from '../models/index.js';
import { notificationService } from '../notifications/index.js';
import { buildPaginationMeta, normalizePagination } from '../utils/pagination.js';
import { buildFieldSelection } from '../utils/query-builder.js';
import { NotFoundError } from '../utils/errors.js';
import { buildListResponse, buildServiceResponse } from '../utils/response-builder.js';
import { buildSort } from '../utils/sort-builder.js';
import { BaseService } from './base.service.js';

class EnquiryService extends BaseService {
  constructor() {
    super(Enquiry, {
      resourceName: 'Enquiry',
      searchFields: [
        'projectDescription',
        'expectedUsage',
        'contactName',
        'contactEmail',
        'contactPhone',
      ],
      allowedFilters: ['customer', 'gpuPackage', 'status', 'contactEmail'],
      allowedSortFields: ['createdAt', 'updatedAt', 'budget'],
      allowedSelectFields: [
        'customer',
        'gpuPackage',
        'status',
        'projectDescription',
        'expectedUsage',
        'duration',
        'budget',
        'contactName',
        'contactEmail',
        'contactPhone',
        'adminNotes',
        'customerVisibleNotes',
        'statusHistory',
        'createdAt',
        'updatedAt',
      ],
      allowedPopulate: ['customer', 'gpuPackage', 'statusHistory.changedBy'],
    });
  }

  async create(payload, options = {}) {
    const response = await super.create(payload, options);
    const enquiry = await this.findById(response.data._id, {
      populate: ['gpuPackage'],
      unwrap: true,
    });

    notificationService.sendEnquiryReceived({
      enquiry,
      gpuPackage: enquiry.gpuPackage,
    });
    notificationService.sendNewEnquiryNotification({
      enquiry,
      gpuPackage: enquiry.gpuPackage,
    });

    return response;
  }

  async findForCustomer(customer, options = {}) {
    const { page, limit, skip } = normalizePagination(options);
    const baseFilter = this.buildBaseFilter(options.filters);
    const sort = buildSort(options, this.allowedSortFields);
    const select = buildFieldSelection(options.fields, this.allowedSelectFields);
    const ownershipFilter = { customer: customer._id };
    const filter =
      Object.keys(baseFilter).length > 0 ? { $and: [baseFilter, ownershipFilter] } : ownershipFilter;

    let query = Enquiry.find(filter).sort(sort).skip(skip).limit(limit);

    if (select) {
      query = query.select(select);
    }

    query = this.applyPopulate(query, options.populate);

    const [records, total] = await Promise.all([query, Enquiry.countDocuments(filter)]);

    return buildListResponse({
      data: records,
      meta: buildPaginationMeta({ page, limit, total }),
    });
  }

  findForPackage(gpuPackageId, options = {}) {
    return this.findMany({
      ...options,
      filters: {
        ...options.filters,
        gpuPackage: gpuPackageId,
      },
    });
  }

  async update(id, payload, options = {}) {
    const currentEnquiry = await this.findById(id, { unwrap: true });
    const statusChanged = Boolean(payload.status && payload.status !== currentEnquiry.status);

    if (statusChanged) {
      currentEnquiry.appendStatusHistory(
        payload.status,
        options.changedBy,
        payload.adminNotes || ''
      );
    }

    Object.assign(currentEnquiry, payload);
    await currentEnquiry.save();

    const response = await this.findById(id, options);

    if (statusChanged) {
      const populatedEnquiry = await this.findById(id, {
        populate: ['gpuPackage'],
        unwrap: true,
      });

      notificationService.sendEnquiryStatusUpdated({
        enquiry: populatedEnquiry,
        gpuPackage: populatedEnquiry.gpuPackage,
      });
    }

    return response;
  }

  async findAccessibleById(id, user, options = {}) {
    this.ensureValidId(id);

    if (user.role === USER_ROLES.ADMIN) {
      return this.findById(id, options);
    }

    let query = Enquiry.findOne({ _id: id, customer: user._id });
    query = this.applyPopulate(query, options.populate);

    const enquiry = await query;

    if (!enquiry) {
      throw new NotFoundError(this.resourceName);
    }

    return buildServiceResponse({
      data: enquiry,
      message: `${this.resourceName} fetched successfully.`,
    });
  }
}

export const enquiryService = new EnquiryService();
