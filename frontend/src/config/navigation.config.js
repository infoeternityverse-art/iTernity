import {
  BookOpenText,
  ClipboardList,
  FileClock,
  Gauge,
  LayoutDashboard,
  MailQuestion,
  PackagePlus,
  ShieldCheck,
  User,
  Users,
  Workflow,
} from 'lucide-react';

/**
 * Navigation config keeps route labels and menu structure out of layout components.
 */
export const publicNavigation = [
  { label: 'Home', href: '/' },
  { label: 'GPUs', href: '/gpus' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const authNavigation = [{ label: 'Get started', href: '/login' }];

export const customerNavigation = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Blog Hub', href: '/dashboard/blog', icon: BookOpenText },
  { label: 'Enquiries', href: '/dashboard/enquiries', icon: ClipboardList },
  { label: 'Workspace', href: '/dashboard/workspace', icon: Workflow },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export const adminNavigation = [
  { label: 'Overview', href: '/admin', icon: Gauge },
  { label: 'Blog Studio', href: '/admin/blog', icon: BookOpenText },
  { label: 'GPU Packages', href: '/admin/gpu-packages', icon: PackagePlus },
  { label: 'Enquiries', href: '/admin/enquiries', icon: ClipboardList },
  { label: 'Contact Enquiries', href: '/admin/contact-enquiries', icon: MailQuestion },
  { label: 'Workspace Management', href: '/admin/workspaces', icon: Workflow },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileClock },
];

export const adminUtilityNavigation = [
  { label: 'Admin Login', href: '/admin/login', icon: ShieldCheck },
];

export const footerNavigation = [
  { label: 'Home', href: '/' },
  { label: 'GPU Marketplace', href: '/gpus' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Get started', href: '/login' },
];

export const breadcrumbLabels = {
  '/': 'Home',
  '/gpus': 'GPUs',
  '/blog': 'Blog',
  '/enquiry': 'Enquiry',
  '/thank-you': 'Thank You',
  '/login': 'Login',
  '/register': 'Register',
  '/contact': 'Contact',
  '/about': 'About',
  '/faq': 'FAQ',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Access',
  '/security': 'Security',
  '/acceptable-use': 'Acceptable Use',
  '/dashboard': 'Dashboard',
  '/dashboard/blog': 'Blog Hub',
  '/dashboard/enquiries': 'Enquiries',
  '/dashboard/workspace': 'Workspace',
  '/dashboard/credentials': 'Workspace',
  '/dashboard/profile': 'Profile',
  '/admin': 'Admin',
  '/admin/blog': 'Blog Studio',
  '/admin/blog/new': 'New Article',
  '/admin/login': 'Admin Login',
  '/admin/gpu-packages': 'GPU Packages',
  '/admin/gpu-packages/new': 'New Package',
  '/admin/enquiries': 'Enquiries',
  '/admin/contact-enquiries': 'Contact Enquiries',
  '/admin/credentials': 'Credentials',
  '/admin/workspaces': 'Workspace Management',
  '/admin/workspaces/new': 'New Workspace',
  '/admin/customers': 'Customers',
  '/admin/audit-logs': 'Audit Logs',
  '/403': 'Forbidden',
  '/500': 'Server Error',
};
