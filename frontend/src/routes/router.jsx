import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import {
  AdminRoute,
  GuestRoute,
  ProtectedRoute,
  PublicRoute,
} from '@/components/common/route-guards.jsx';
import { AdminLayout } from '@/layouts/admin-layout.jsx';
import { AuthLayout } from '@/layouts/auth-layout.jsx';
import { CustomerDashboardLayout } from '@/layouts/customer-dashboard-layout.jsx';
import { ErrorLayout } from '@/layouts/error-layout.jsx';
import { PublicLayout } from '@/layouts/public-layout.jsx';
import { SparkLoader } from '@/components/common/spark-loader.jsx';
import { RouteErrorPage } from '@/pages/public/route-error-page.jsx';
import { HomePage } from '@/pages/public/home-page.jsx';

const lazyPage = (factory, exportName) =>
  lazy(() => factory().then((module) => ({ default: module[exportName] })));

const withSuspense = (Component) => (
  <Suspense fallback={<SparkLoader />}>
    <Component />
  </Suspense>
);

const AdminCredentialsPage = lazyPage(
  () => import('@/pages/admin/admin-credentials-page.jsx'),
  'AdminCredentialsPage'
);
const AdminDashboardPage = lazyPage(
  () => import('@/pages/admin/admin-dashboard-page.jsx'),
  'AdminDashboardPage'
);
const AdminEnquiriesPage = lazyPage(
  () => import('@/pages/admin/admin-enquiries-page.jsx'),
  'AdminEnquiriesPage'
);
const AdminEnquiryDetailPage = lazyPage(
  () => import('@/pages/admin/admin-enquiry-detail-page.jsx'),
  'AdminEnquiryDetailPage'
);
const ContactEnquiriesPage = lazyPage(
  () => import('@/pages/admin/contact-enquiries-page.jsx'),
  'ContactEnquiriesPage'
);
const AuditLogsPage = lazyPage(() => import('@/pages/admin/audit-logs-page.jsx'), 'AuditLogsPage');
const BlogManagementPage = lazyPage(
  () => import('@/pages/admin/blog-management-page.jsx'),
  'BlogManagementPage'
);
const NewBlogPostPage = lazyPage(
  () => import('@/pages/admin/new-blog-post-page.jsx'),
  'NewBlogPostPage'
);
const EditBlogPostPage = lazyPage(
  () => import('@/pages/admin/edit-blog-post-page.jsx'),
  'EditBlogPostPage'
);
const WorkspacesPage = lazyPage(
  () => import('@/pages/admin/workspaces-page.jsx'),
  'WorkspacesPage'
);
const NewWorkspacePage = lazyPage(
  () => import('@/pages/admin/new-workspace-page.jsx'),
  'NewWorkspacePage'
);
const EditWorkspacePage = lazyPage(
  () => import('@/pages/admin/edit-workspace-page.jsx'),
  'EditWorkspacePage'
);
const WorkspaceDetailPage = lazyPage(
  () => import('@/pages/admin/workspace-detail-page.jsx'),
  'WorkspaceDetailPage'
);
const CustomerDetailPage = lazyPage(
  () => import('@/pages/admin/customer-detail-page.jsx'),
  'CustomerDetailPage'
);
const CustomersPage = lazyPage(() => import('@/pages/admin/customers-page.jsx'), 'CustomersPage');
const AdminGpuPackagesPage = lazyPage(
  () => import('@/pages/admin/gpu-packages-page.jsx'),
  'AdminGpuPackagesPage'
);
const EditGpuPackagePage = lazyPage(
  () => import('@/pages/admin/edit-gpu-package-page.jsx'),
  'EditGpuPackagePage'
);
const NewGpuPackagePage = lazyPage(
  () => import('@/pages/admin/new-gpu-package-page.jsx'),
  'NewGpuPackagePage'
);
const AdminLoginPage = lazyPage(
  () => import('@/pages/auth/admin-login-page.jsx'),
  'AdminLoginPage'
);
const LoginPage = lazyPage(() => import('@/pages/auth/login-page.jsx'), 'LoginPage');
const RegisterPage = lazyPage(() => import('@/pages/auth/register-page.jsx'), 'RegisterPage');
const ForgotPasswordPage = lazyPage(
  () => import('@/pages/auth/forgot-password-page.jsx'),
  'ForgotPasswordPage'
);
const ResetPasswordPage = lazyPage(
  () => import('@/pages/auth/reset-password-page.jsx'),
  'ResetPasswordPage'
);
const CredentialsPage = lazyPage(
  () => import('@/pages/customer/credentials-page.jsx'),
  'CredentialsPage'
);
const WorkspacePage = lazyPage(
  () => import('@/pages/customer/workspace-page.jsx'),
  'WorkspacePage'
);
const DashboardPage = lazyPage(
  () => import('@/pages/customer/dashboard-page.jsx'),
  'DashboardPage'
);
const BlogHubPage = lazyPage(() => import('@/pages/customer/blog-hub-page.jsx'), 'BlogHubPage');
const EnquiriesPage = lazyPage(
  () => import('@/pages/customer/enquiries-page.jsx'),
  'EnquiriesPage'
);
const EnquiryDetailPage = lazyPage(
  () => import('@/pages/customer/enquiry-detail-page.jsx'),
  'EnquiryDetailPage'
);
const ProfilePage = lazyPage(() => import('@/pages/customer/profile-page.jsx'), 'ProfilePage');
const AboutPage = lazyPage(() => import('@/pages/public/about-page.jsx'), 'AboutPage');
const BlogPage = lazyPage(() => import('@/pages/public/blog-page.jsx'), 'BlogPage');
const BlogDetailPage = lazyPage(
  () => import('@/pages/public/blog-detail-page.jsx'),
  'BlogDetailPage'
);
const ContactPage = lazyPage(() => import('@/pages/public/contact-page.jsx'), 'ContactPage');
const ContactThankYouPage = lazyPage(
  () => import('@/pages/public/contact-thank-you-page.jsx'),
  'ContactThankYouPage'
);
const FaqPage = lazyPage(() => import('@/pages/public/faq-page.jsx'), 'FaqPage');
const ForbiddenPage = lazyPage(() => import('@/pages/public/forbidden-page.jsx'), 'ForbiddenPage');
const GpuDetailPage = lazyPage(() => import('@/pages/public/gpu-detail-page.jsx'), 'GpuDetailPage');
const GpusPage = lazyPage(() => import('@/pages/public/gpus-page.jsx'), 'GpusPage');
const EnquiryPage = lazyPage(() => import('@/pages/public/enquiry-page.jsx'), 'EnquiryPage');
const PrivacyPolicyPage = lazyPage(
  () => import('@/pages/public/legal-pages.jsx'),
  'PrivacyPolicyPage'
);
const TermsOfAccessPage = lazyPage(
  () => import('@/pages/public/legal-pages.jsx'),
  'TermsOfAccessPage'
);
const SecurityPage = lazyPage(() => import('@/pages/public/legal-pages.jsx'), 'SecurityPage');
const AcceptableUsePage = lazyPage(
  () => import('@/pages/public/legal-pages.jsx'),
  'AcceptableUsePage'
);
const NotFoundPage = lazyPage(() => import('@/pages/public/not-found-page.jsx'), 'NotFoundPage');
const ServerErrorPage = lazyPage(
  () => import('@/pages/public/server-error-page.jsx'),
  'ServerErrorPage'
);
const ThankYouPage = lazyPage(() => import('@/pages/public/thank-you-page.jsx'), 'ThankYouPage');

export const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <RouteErrorPage />,
      element: (
        <PublicRoute>
          <PublicLayout />
        </PublicRoute>
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: 'gpus', element: withSuspense(GpusPage) },
        { path: 'gpus/:id', element: withSuspense(GpuDetailPage) },
        { path: 'enquiry/:gpuPackageId', element: withSuspense(EnquiryPage) },
        { path: 'thank-you', element: withSuspense(ThankYouPage) },
        { path: 'contact-thank-you', element: withSuspense(ContactThankYouPage) },
        { path: 'blog', element: withSuspense(BlogPage) },
        { path: 'blog/:slug', element: withSuspense(BlogDetailPage) },
        { path: 'contact', element: withSuspense(ContactPage) },
        { path: 'about', element: withSuspense(AboutPage) },
        { path: 'faq', element: withSuspense(FaqPage) },
        { path: 'privacy', element: withSuspense(PrivacyPolicyPage) },
        { path: 'terms', element: withSuspense(TermsOfAccessPage) },
        { path: 'security', element: withSuspense(SecurityPage) },
        { path: 'acceptable-use', element: withSuspense(AcceptableUsePage) },
      ],
    },
    {
      errorElement: <RouteErrorPage />,
      element: (
        <GuestRoute>
          <AuthLayout />
        </GuestRoute>
      ),
      children: [
        { path: '/login', element: withSuspense(LoginPage) },
        { path: '/register', element: withSuspense(RegisterPage) },
        { path: '/forgot-password', element: withSuspense(ForgotPasswordPage) },
        { path: '/reset-password', element: withSuspense(ResetPasswordPage) },
        { path: '/admin/login', element: withSuspense(AdminLoginPage) },
      ],
    },
    {
      path: '/dashboard',
      errorElement: <RouteErrorPage />,
      element: (
        <ProtectedRoute>
          <CustomerDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: withSuspense(DashboardPage) },
        { path: 'blog', element: withSuspense(BlogHubPage) },
        { path: 'enquiries', element: withSuspense(EnquiriesPage) },
        { path: 'enquiries/:id', element: withSuspense(EnquiryDetailPage) },
        { path: 'workspace', element: withSuspense(WorkspacePage) },
        { path: 'credentials', element: withSuspense(CredentialsPage) },
        { path: 'profile', element: withSuspense(ProfilePage) },
      ],
    },
    {
      path: '/admin',
      errorElement: <RouteErrorPage />,
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        { index: true, element: withSuspense(AdminDashboardPage) },
        { path: 'blog', element: withSuspense(BlogManagementPage) },
        { path: 'blog/new', element: withSuspense(NewBlogPostPage) },
        { path: 'blog/:slug/edit', element: withSuspense(EditBlogPostPage) },
        { path: 'gpu-packages', element: withSuspense(AdminGpuPackagesPage) },
        { path: 'gpu-packages/new', element: withSuspense(NewGpuPackagePage) },
        { path: 'gpu-packages/:id/edit', element: withSuspense(EditGpuPackagePage) },
        { path: 'enquiries', element: withSuspense(AdminEnquiriesPage) },
        { path: 'enquiries/:id', element: withSuspense(AdminEnquiryDetailPage) },
        { path: 'contact-enquiries', element: withSuspense(ContactEnquiriesPage) },
        { path: 'credentials', element: withSuspense(AdminCredentialsPage) },
        { path: 'workspaces', element: withSuspense(WorkspacesPage) },
        { path: 'workspaces/new', element: withSuspense(NewWorkspacePage) },
        { path: 'workspaces/:id', element: withSuspense(WorkspaceDetailPage) },
        { path: 'workspaces/:id/edit', element: withSuspense(EditWorkspacePage) },
        { path: 'customers', element: withSuspense(CustomersPage) },
        { path: 'customers/:id', element: withSuspense(CustomerDetailPage) },
        { path: 'audit-logs', element: withSuspense(AuditLogsPage) },
      ],
    },
    {
      errorElement: <RouteErrorPage />,
      element: <ErrorLayout />,
      children: [
        { path: '/403', element: withSuspense(ForbiddenPage) },
        { path: '/500', element: withSuspense(ServerErrorPage) },
        { path: '*', element: withSuspense(NotFoundPage) },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
