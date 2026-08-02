import { Router } from 'express';
import { API_VERSION } from '../constants/app.constants.js';
import { adminAiRouter } from './ai.routes.js';
import { auditLogRouter } from './audit-log.routes.js';
import { authRouter } from './auth.routes.js';
import { adminBlogPostRouter, blogPostRouter } from './blog-post.routes.js';
import { customerCredentialRouter, adminCredentialRouter } from './credential.routes.js';
import { customerEnquiryRouter, adminEnquiryRouter, enquiryRouter } from './enquiry.routes.js';
import { adminGpuPackageRouter, gpuPackageRouter } from './gpu-package.routes.js';
import { userRouter } from './user.routes.js';
import { adminWorkspaceRouter, customerWorkspaceRouter } from '../workspace/routes/index.js';

export const apiRouter = Router();

apiRouter.use(`/api/${API_VERSION}/auth`, authRouter);
apiRouter.use(`/api/${API_VERSION}/users`, userRouter);
apiRouter.use(`/api/${API_VERSION}/blog-posts`, blogPostRouter);
apiRouter.use(`/api/${API_VERSION}/admin/blog-posts`, adminBlogPostRouter);
apiRouter.use(`/api/${API_VERSION}/gpu-packages`, gpuPackageRouter);
apiRouter.use(`/api/${API_VERSION}/admin/gpu-packages`, adminGpuPackageRouter);
apiRouter.use(`/api/${API_VERSION}/enquiries`, enquiryRouter);
apiRouter.use(`/api/${API_VERSION}/customer/enquiries`, customerEnquiryRouter);
apiRouter.use(`/api/${API_VERSION}/admin/enquiries`, adminEnquiryRouter);
apiRouter.use(`/api/${API_VERSION}/customer/credentials`, customerCredentialRouter);
apiRouter.use(`/api/${API_VERSION}/admin/credentials`, adminCredentialRouter);
apiRouter.use(`/api/${API_VERSION}/admin/audit-logs`, auditLogRouter);
apiRouter.use(`/api/${API_VERSION}/admin/ai`, adminAiRouter);
apiRouter.use(`/api/${API_VERSION}/admin/workspaces`, adminWorkspaceRouter);
apiRouter.use(`/api/${API_VERSION}/customer/workspace`, customerWorkspaceRouter);
