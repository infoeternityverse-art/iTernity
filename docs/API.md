# REST API Reference

Base URL: `/api/v1`

## Response Standard

Success:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [{ "field": "body.email", "message": "Enter a valid email address." }]
}
```

## Query Standard

- Pagination: `page`, `limit`
- Sorting: `sort`, `order=asc|desc`
- Search: `search`
- Field selection: `fields`
- Population: `populate`
- Filters: endpoint-specific query keys

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin/login`
- `POST /auth/logout`
- `GET /auth/me`
- `PATCH /auth/me`
- `PATCH /auth/password`

## Public Marketplace

- `GET /gpu-packages`
- `GET /gpu-packages/:id`
- `GET /blog-posts`
- `GET /blog-posts/:slug`
- `POST /enquiries`

## Customer

- `GET /enquiries/:id`
- `GET /customer/enquiries`
- `GET /customer/credentials`

## Admin

- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `GET /admin/gpu-packages`
- `POST /admin/gpu-packages`
- `GET /admin/gpu-packages/:id`
- `PATCH /admin/gpu-packages/:id`
- `DELETE /admin/gpu-packages/:id`
- `GET /admin/blog-posts`
- `POST /admin/blog-posts`
- `POST /admin/blog-posts/image-uploads`
- `GET /admin/blog-posts/:slug`
- `PATCH /admin/blog-posts/:slug`
- `DELETE /admin/blog-posts/:slug`
- `GET /admin/enquiries`
- `PATCH /admin/enquiries/:id`
- `GET /admin/credentials`
- `POST /admin/credentials`
- `PATCH /admin/credentials/:id`
- `GET /admin/audit-logs`

## HTTP Status Usage

- `200`: successful read or update
- `201`: resource created
- `400`: validation error
- `401`: missing, invalid, or expired authentication
- `403`: authenticated but not authorized
- `404`: route or resource not found
- `409`: conflict, such as duplicate email or slug
- `429`: rate limit exceeded
- `500`: unexpected server error
