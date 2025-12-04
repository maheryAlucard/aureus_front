# API Documentation

This document describes the API service layer for the Aureus Digital Agency application. The API is currently using mock data but is structured to easily switch to a real backend.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Projects](#projects)
  - [Leads](#leads)
  - [Blog Posts](#blog-posts)
  - [Pricing Packages](#pricing-packages)
  - [FAQs](#faqs)
  - [Auth](#auth)
- [Hooks](#hooks)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Migration to Real API](#migration-to-real-api)

## Overview

The API service is built using:
- **Axios**: HTTP client for making API requests
- **Zustand**: State management for React
- **Custom Hooks**: React hooks that connect API calls to Zustand store

### Architecture

```
┌─────────────┐
│  Components │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Hooks    │ (useProjects, useLeads, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ API Service │────▶│  Zustand    │
│  (Axios)    │     │    Store    │
└─────────────┘     └─────────────┘
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If not set, defaults to `http://localhost:3000/api`.

### Axios Instance

The API client is configured with:
- Base URL from environment variable
- 10 second timeout
- JSON content type headers
- Automatic authentication token injection
- Automatic error handling for 401 responses

## Authentication

### Token Management

Authentication tokens are stored in `localStorage`:
- `auth_token`: JWT or session token
- `auth_user`: Serialized user object

### Request Interceptor

All API requests automatically include the authentication token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Response Interceptor

If a request returns a 401 (Unauthorized), the app will:
1. Clear authentication tokens from localStorage
2. Redirect to `/admin/login`

## API Endpoints

### Projects

#### Get All Projects
```typescript
GET /api/projects
```

**Response:**
```typescript
Project[]
```

**Hook Usage:**
```typescript
const { projects, fetchProjects, projectsLoading, projectsError } = useProjects();

// Fetch projects
await fetchProjects();
```

#### Get Project by ID
```typescript
GET /api/projects/:id
```

**Parameters:**
- `id` (string): Project ID

**Response:**
```typescript
Project
```

**Hook Usage:**
```typescript
const { fetchProjectById } = useProjects();
const project = await fetchProjectById('1');
```

#### Create Project
```typescript
POST /api/projects
```

**Request Body:**
```typescript
{
  title: string;
  client: string;
  division: Division;
  tags: string[];
  imageUrl: string;
  description: string;
}
```

**Response:**
```typescript
Project
```

**Hook Usage:**
```typescript
const { createProject } = useProjects();
const newProject = await createProject({
  title: 'New Project',
  client: 'Client Name',
  division: Division.TECH,
  tags: ['React', 'TypeScript'],
  imageUrl: 'https://example.com/image.jpg',
  description: 'Project description'
});
```

#### Update Project
```typescript
PATCH /api/projects/:id
```

**Parameters:**
- `id` (string): Project ID

**Request Body:**
```typescript
Partial<Project>
```

**Response:**
```typescript
Project
```

**Hook Usage:**
```typescript
const { updateProjectById } = useProjects();
const updated = await updateProjectById('1', { title: 'Updated Title' });
```

#### Delete Project
```typescript
DELETE /api/projects/:id
```

**Parameters:**
- `id` (string): Project ID

**Response:**
```typescript
void
```

**Hook Usage:**
```typescript
const { deleteProject } = useProjects();
await deleteProject('1');
```

### Leads

#### Get All Leads
```typescript
GET /api/leads
```

**Response:**
```typescript
Lead[]
```

**Hook Usage:**
```typescript
const { leads, fetchLeads, leadsLoading, leadsError } = useLeads();
await fetchLeads();
```

#### Get Lead by ID
```typescript
GET /api/leads/:id
```

**Parameters:**
- `id` (string): Lead ID

**Response:**
```typescript
Lead
```

#### Create Lead
```typescript
POST /api/leads
```

**Request Body:**
```typescript
{
  name: string;
  email: string;
  message: string;
  interest_division: Division;
  budget?: string;
  eventDate?: string;
}
```

**Response:**
```typescript
Lead // Includes auto-generated id, date, and status: 'new'
```

**Hook Usage:**
```typescript
const { createLead } = useLeads();
const newLead = await createLead({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Interested in services',
  interest_division: Division.TECH
});
```

#### Update Lead
```typescript
PATCH /api/leads/:id
```

**Parameters:**
- `id` (string): Lead ID

**Request Body:**
```typescript
Partial<Lead>
```

**Response:**
```typescript
Lead
```

#### Update Lead Status
```typescript
PATCH /api/leads/:id/status
```

**Parameters:**
- `id` (string): Lead ID

**Request Body:**
```typescript
{
  status: 'new' | 'contacted' | 'closed'
}
```

**Response:**
```typescript
Lead
```

**Hook Usage:**
```typescript
const { updateLeadStatus } = useLeads();
await updateLeadStatus('1', 'contacted');
```

#### Delete Lead
```typescript
DELETE /api/leads/:id
```

**Parameters:**
- `id` (string): Lead ID

**Response:**
```typescript
void
```

### Blog Posts

#### Get All Blog Posts
```typescript
GET /api/blog-posts
```

**Response:**
```typescript
BlogPost[]
```

**Hook Usage:**
```typescript
const { blogPosts, fetchBlogPosts } = useBlogPosts();
await fetchBlogPosts();
```

#### Get Blog Post by ID
```typescript
GET /api/blog-posts/:id
```

**Parameters:**
- `id` (string): Blog post ID

**Response:**
```typescript
BlogPost
```

#### Get Blog Post by Slug
```typescript
GET /api/blog-posts/slug/:slug
```

**Parameters:**
- `slug` (string): Blog post slug

**Response:**
```typescript
BlogPost
```

**Hook Usage:**
```typescript
const { fetchBlogPostBySlug } = useBlogPosts();
const post = await fetchBlogPostBySlug('ai-agents-support');
```

#### Create Blog Post
```typescript
POST /api/blog-posts
```

**Request Body:**
```typescript
{
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
}
```

**Response:**
```typescript
BlogPost
```

#### Update Blog Post
```typescript
PATCH /api/blog-posts/:id
```

**Parameters:**
- `id` (string): Blog post ID

**Request Body:**
```typescript
Partial<BlogPost>
```

**Response:**
```typescript
BlogPost
```

#### Delete Blog Post
```typescript
DELETE /api/blog-posts/:id
```

**Parameters:**
- `id` (string): Blog post ID

**Response:**
```typescript
void
```

### Pricing Packages

#### Get All Pricing Packages
```typescript
GET /api/pricing-packages
```

**Response:**
```typescript
PricingPackage[]
```

**Hook Usage:**
```typescript
const { pricingPackages, fetchPricingPackages } = usePricingPackages();
await fetchPricingPackages();
```

#### Get Pricing Package by ID
```typescript
GET /api/pricing-packages/:id
```

**Parameters:**
- `id` (string): Pricing package ID

**Response:**
```typescript
PricingPackage
```

#### Create Pricing Package
```typescript
POST /api/pricing-packages
```

**Request Body:**
```typescript
{
  title: string;
  division: string;
  price: string;
  priceNote?: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  description?: string;
  deliveryTime?: string;
  revisions?: string;
}
```

**Response:**
```typescript
PricingPackage
```

#### Update Pricing Package
```typescript
PATCH /api/pricing-packages/:id
```

**Parameters:**
- `id` (string): Pricing package ID

**Request Body:**
```typescript
Partial<PricingPackage>
```

**Response:**
```typescript
PricingPackage
```

#### Delete Pricing Package
```typescript
DELETE /api/pricing-packages/:id
```

**Parameters:**
- `id` (string): Pricing package ID

**Response:**
```typescript
void
```

### FAQs

#### Get All FAQs
```typescript
GET /api/faqs
```

**Response:**
```typescript
FAQItem[]
```

**Hook Usage:**
```typescript
const { faqs, fetchFAQs } = useFAQs();
await fetchFAQs();
```

#### Get FAQ by ID
```typescript
GET /api/faqs/:id
```

**Parameters:**
- `id` (string): FAQ ID

**Response:**
```typescript
FAQItem
```

#### Create FAQ
```typescript
POST /api/faqs
```

**Request Body:**
```typescript
{
  question: string;
  answer: string;
}
```

**Response:**
```typescript
FAQItem
```

#### Update FAQ
```typescript
PATCH /api/faqs/:id
```

**Parameters:**
- `id` (string): FAQ ID

**Request Body:**
```typescript
Partial<FAQItem>
```

**Response:**
```typescript
FAQItem
```

#### Delete FAQ
```typescript
DELETE /api/faqs/:id
```

**Parameters:**
- `id` (string): FAQ ID

**Response:**
```typescript
void
```

### Auth

#### Login
```typescript
POST /api/auth/login
```

**Request Body:**
```typescript
{
  username: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  user?: {
    username: string;
    email: string;
  };
  token?: string;
  error?: string;
}
```

**Hook Usage:**
```typescript
const { login, authLoading, authError } = useAuth();
const result = await login('admin', 'admin123');
if (result.success) {
  // User logged in successfully
}
```

#### Logout
```typescript
POST /api/auth/logout
```

**Response:**
```typescript
void
```

**Hook Usage:**
```typescript
const { logout } = useAuth();
await logout();
```

#### Get Current User
```typescript
GET /api/auth/me
```

**Response:**
```typescript
{
  username: string;
  email: string;
} | null
```

**Hook Usage:**
```typescript
const { getCurrentUser, user } = useAuth();
await getCurrentUser();
// user is now populated
```

#### Check Authentication Status
```typescript
// No API call - checks localStorage
checkAuth(): boolean
```

**Hook Usage:**
```typescript
const { checkAuth, isAuthenticated } = useAuth();
const authenticated = checkAuth();
```

## Hooks

All hooks follow a consistent pattern:

### Hook Return Values

Each hook returns:
- **Data**: The current state (e.g., `projects`, `leads`)
- **Loading**: Loading state (e.g., `projectsLoading`)
- **Error**: Error state (e.g., `projectsError`)
- **Actions**: Functions to interact with the API (e.g., `fetchProjects`, `createProject`)

### Available Hooks

1. **useProjects** - Manage projects
2. **useLeads** - Manage leads
3. **useBlogPosts** - Manage blog posts
4. **usePricingPackages** - Manage pricing packages
5. **useFAQs** - Manage FAQs
6. **useAuth** - Manage authentication

### Example: Using Multiple Hooks

```typescript
import { useProjects, useLeads, useAuth } from '../hooks';

function MyComponent() {
  const { projects, fetchProjects, projectsLoading } = useProjects();
  const { leads, fetchLeads } = useLeads();
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (checkAuth()) {
      fetchProjects();
      fetchLeads();
    }
  }, []);

  if (projectsLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Projects: {projects.length}</h1>
      <h2>Leads: {leads.length}</h2>
    </div>
  );
}
```

## State Management

### Zustand Store

The Zustand store (`useAppStore`) manages all application state:

```typescript
interface AppState {
  // Projects
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  
  // Leads
  leads: Lead[];
  leadsLoading: boolean;
  leadsError: string | null;
  
  // ... (similar for other resources)
}
```

### Store Actions

Each resource has corresponding actions:
- `set*`: Set the entire array
- `add*`: Add a new item
- `update*`: Update an existing item
- `remove*`: Remove an item
- `set*Loading`: Set loading state
- `set*Error`: Set error state

### Direct Store Access

You can also access the store directly:

```typescript
import { useAppStore } from '../store/useAppStore';

function MyComponent() {
  const projects = useAppStore((state) => state.projects);
  const setProjects = useAppStore((state) => state.setProjects);
  
  // Use directly
}
```

## Error Handling

### Error States

Each hook provides error state:
```typescript
const { projectsError } = useProjects();
```

### Error Handling in Actions

All hook actions throw errors that can be caught:

```typescript
try {
  await createProject(newProject);
} catch (error) {
  console.error('Failed to create project:', error);
  // Error is also stored in projectsError
}
```

### Global Error Handling

The axios interceptor handles:
- **401 Unauthorized**: Automatically logs out and redirects
- **Network Errors**: Propagated to hooks
- **Validation Errors**: Returned in error state

## Migration to Real API

To migrate from mock data to a real API:

1. **Update Base URL**: Set `VITE_API_BASE_URL` in `.env`

2. **Uncomment API Calls**: In `services/apiService.ts`, uncomment the production API calls:

```typescript
// Change from:
await delay(300);
return [...mockProjects];

// To:
return (await apiClient.get<Project[]>('/projects')).data;
```

3. **Remove Mock Data**: Delete the mock data arrays and delay functions

4. **Update Response Types**: Ensure backend response types match TypeScript interfaces

5. **Handle Authentication**: Ensure backend returns tokens in the expected format

6. **Test Endpoints**: Verify all endpoints work correctly

### Example Migration

```typescript
// Before (Mock)
getAll: async (): Promise<Project[]> => {
  await delay(300);
  return [...mockProjects];
},

// After (Real API)
getAll: async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
},
```

## Type Definitions

All types are defined in:
- `types.ts` - Core types (Project, Lead, BlogPost, Division)
- `services/mockDataService.ts` - PricingPackage, FAQItem

## Best Practices

1. **Always use hooks**: Don't call `apiService` directly from components
2. **Handle loading states**: Show loading indicators while fetching
3. **Handle errors**: Display error messages to users
4. **Optimistic updates**: Update UI immediately, rollback on error
5. **Cache data**: Use Zustand store to avoid unnecessary API calls
6. **Type safety**: Use TypeScript types for all API responses

## Support

For questions or issues, refer to:
- Zustand documentation: https://zustand-demo.pmnd.rs/
- Axios documentation: https://axios-http.com/
- React Hooks documentation: https://react.dev/reference/react

