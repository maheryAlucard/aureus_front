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
  - [Testimonials](#testimonials)
  - [Team Members](#team-members)
  - [Devis](#devis)
  - [Auth](#auth)
  - [Newsletter](#newsletter)
  - [Search](#search)
  - [Chat History](#chat-history)
  - [Quiz Results](#quiz-results)
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

### Testimonials

#### Get All Testimonials
```typescript
GET /api/testimonials
```

**Response:**
```typescript
Testimonial[]
```

**Hook Usage:**
```typescript
const { testimonials, fetchTestimonials, testimonialsLoading, testimonialsError } = useTestimonials();
await fetchTestimonials();
```

#### Get Testimonial by ID
```typescript
GET /api/testimonials/:id
```

**Parameters:**
- `id` (string): Testimonial ID

**Response:**
```typescript
Testimonial
```

**Hook Usage:**
```typescript
const { fetchTestimonialById } = useTestimonials();
const testimonial = await fetchTestimonialById('1');
```

#### Get Testimonials by Division
```typescript
GET /api/testimonials?division=:division
```

**Parameters:**
- `division` (Division): Division filter (TECH, STUDIO, BRAND)

**Response:**
```typescript
Testimonial[]
```

**Hook Usage:**
```typescript
const { fetchTestimonialsByDivision } = useTestimonials();
const testimonials = await fetchTestimonialsByDivision(Division.TECH);
```

#### Create Testimonial
```typescript
POST /api/testimonials
```

**Request Body:**
```typescript
{
  name: string;
  role: string;
  company: string;
  companyLogo?: string;
  photo?: string;
  content: string;
  rating: number;
  division?: Division;
  videoUrl?: string;
}
```

**Response:**
```typescript
Testimonial
```

**Hook Usage:**
```typescript
const { createTestimonial } = useTestimonials();
const newTestimonial = await createTestimonial({
  name: 'John Doe',
  role: 'CEO',
  company: 'TechCorp',
  content: 'Excellent service!',
  rating: 5,
  division: Division.TECH
});
```

#### Update Testimonial
```typescript
PATCH /api/testimonials/:id
```

**Parameters:**
- `id` (string): Testimonial ID

**Request Body:**
```typescript
Partial<Testimonial>
```

**Response:**
```typescript
Testimonial
```

**Hook Usage:**
```typescript
const { updateTestimonialById } = useTestimonials();
const updated = await updateTestimonialById('1', { rating: 5 });
```

#### Delete Testimonial
```typescript
DELETE /api/testimonials/:id
```

**Parameters:**
- `id` (string): Testimonial ID

**Response:**
```typescript
void
```

**Hook Usage:**
```typescript
const { deleteTestimonial } = useTestimonials();
await deleteTestimonial('1');
```

### Team Members

#### Get All Team Members
```typescript
GET /api/team-members
```

**Response:**
```typescript
TeamMember[]
```

**Hook Usage:**
```typescript
const { teamMembers, fetchTeamMembers, teamMembersLoading, teamMembersError } = useTeamMembers();
await fetchTeamMembers();
```

#### Get Team Member by ID
```typescript
GET /api/team-members/:id
```

**Parameters:**
- `id` (string): Team member ID

**Response:**
```typescript
TeamMember
```

**Hook Usage:**
```typescript
const { fetchTeamMemberById } = useTeamMembers();
const member = await fetchTeamMemberById('1');
```

#### Get Team Members by Division
```typescript
GET /api/team-members?division=:division
```

**Parameters:**
- `division` (Division): Division filter (TECH, STUDIO, BRAND)

**Response:**
```typescript
TeamMember[]
```

**Hook Usage:**
```typescript
const { fetchTeamMembersByDivision } = useTeamMembers();
const members = await fetchTeamMembersByDivision(Division.TECH);
```

#### Get Featured Team Members
```typescript
GET /api/team-members?featured=true
```

**Response:**
```typescript
TeamMember[]
```

**Hook Usage:**
```typescript
const { fetchFeaturedTeamMembers } = useTeamMembers();
const featured = await fetchFeaturedTeamMembers();
```

#### Create Team Member
```typescript
POST /api/team-members
```

**Request Body:**
```typescript
{
  name: string;
  role: string;
  division: Division;
  bio: string;
  photo: string;
  expertise: string[];
  linkedin?: string;
  email?: string;
  featured?: boolean;
}
```

**Response:**
```typescript
TeamMember
```

**Hook Usage:**
```typescript
const { createTeamMember } = useTeamMembers();
const newMember = await createTeamMember({
  name: 'Jane Smith',
  role: 'Senior Developer',
  division: Division.TECH,
  bio: 'Expert in React and Node.js',
  photo: 'https://example.com/photo.jpg',
  expertise: ['React', 'TypeScript', 'Node.js'],
  featured: true
});
```

#### Update Team Member
```typescript
PATCH /api/team-members/:id
```

**Parameters:**
- `id` (string): Team member ID

**Request Body:**
```typescript
Partial<TeamMember>
```

**Response:**
```typescript
TeamMember
```

**Hook Usage:**
```typescript
const { updateTeamMemberById } = useTeamMembers();
const updated = await updateTeamMemberById('1', { featured: true });
```

#### Delete Team Member
```typescript
DELETE /api/team-members/:id
```

**Parameters:**
- `id` (string): Team member ID

**Response:**
```typescript
void
```

**Hook Usage:**
```typescript
const { deleteTeamMember } = useTeamMembers();
await deleteTeamMember('1');
```

### Devis

#### Get All Devis
```typescript
GET /api/devis
```

**Response:**
```typescript
Devis[]
```

**Hook Usage:**
```typescript
const { devis, fetchDevis, devisLoading, devisError } = useDevis();
await fetchDevis();
```

#### Get Devis by ID
```typescript
GET /api/devis/:id
```

**Parameters:**
- `id` (string): Devis ID

**Response:**
```typescript
Devis
```

**Hook Usage:**
```typescript
const { fetchDevisById } = useDevis();
const devis = await fetchDevisById('1');
```

#### Get Devis by User ID
```typescript
GET /api/devis?userId=:userId
```

**Parameters:**
- `userId` (string): User ID

**Response:**
```typescript
Devis[]
```

**Hook Usage:**
```typescript
const { fetchDevisByUserId } = useDevis();
const userDevis = await fetchDevisByUserId('user123');
```

#### Create Devis
```typescript
POST /api/devis
```

**Request Body:**
```typescript
{
  clientName: string;
  clientEmail: string;
  companyName?: string;
  division: Division;
  projectDescription: string;
  budget?: string;
  deadline?: string;
  additionalRequirements?: string;
  generatedContent: string;
  userId: string;
}
```

**Response:**
```typescript
Devis // Includes auto-generated id and createdAt
```

**Hook Usage:**
```typescript
const { createDevis } = useDevis();
const newDevis = await createDevis({
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  division: Division.TECH,
  projectDescription: 'Web application development',
  generatedContent: 'Generated devis content...',
  userId: 'user123'
});
```

#### Update Devis
```typescript
PATCH /api/devis/:id
```

**Parameters:**
- `id` (string): Devis ID

**Request Body:**
```typescript
Partial<Devis>
```

**Response:**
```typescript
Devis
```

**Hook Usage:**
```typescript
const { updateDevisById } = useDevis();
const updated = await updateDevisById('1', { budget: '10,000€' });
```

#### Delete Devis
```typescript
DELETE /api/devis/:id
```

**Parameters:**
- `id` (string): Devis ID

**Response:**
```typescript
void
```

**Hook Usage:**
```typescript
const { deleteDevis } = useDevis();
await deleteDevis('1');
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

### Newsletter

#### Subscribe to Newsletter
```typescript
POST /api/newsletter/subscribe
```

**Request Body:**
```typescript
{
  email: string;
  source?: string; // e.g., 'lead_magnet', 'footer', 'popup'
}
```

**Response:**
```typescript
NewsletterSubscription
```

**Usage:**
```typescript
const subscription = await apiService.newsletter.subscribe('user@example.com', 'footer');
```

#### Unsubscribe from Newsletter
```typescript
POST /api/newsletter/unsubscribe
```

**Request Body:**
```typescript
{
  email: string;
}
```

**Response:**
```typescript
NewsletterSubscription
```

**Usage:**
```typescript
await apiService.newsletter.unsubscribe('user@example.com');
```

#### Get All Newsletter Subscriptions
```typescript
GET /api/newsletter/subscriptions
```

**Response:**
```typescript
NewsletterSubscription[]
```

**Usage:**
```typescript
const subscriptions = await apiService.newsletter.getAll();
```

#### Get Subscription by Email
```typescript
GET /api/newsletter/subscriptions/:email
```

**Parameters:**
- `email` (string): Email address

**Response:**
```typescript
NewsletterSubscription | null
```

**Usage:**
```typescript
const subscription = await apiService.newsletter.getByEmail('user@example.com');
```

### Search

#### Perform Search
```typescript
POST /api/search
```

**Request Body:**
```typescript
{
  query: string;
  userId?: string;
}
```

**Response:**
```typescript
{
  posts: BlogPost[];
  projects: Project[];
}
```

**Usage:**
```typescript
const results = await apiService.search.search('react', 'user123');
// Returns { posts: [...], projects: [...] }
```

#### Get Search History
```typescript
GET /api/search/history?userId=:userId
```

**Parameters:**
- `userId` (string, optional): User ID to filter search history

**Response:**
```typescript
SearchQuery[]
```

**Usage:**
```typescript
const history = await apiService.search.getSearchHistory('user123');
```

### Chat History

#### Save Chat History
```typescript
POST /api/chat/history
```

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userId?: string;
}
```

**Response:**
```typescript
ChatHistory
```

**Usage:**
```typescript
const history = await apiService.chat.saveHistory([
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' }
], 'user123');
```

#### Get Chat History
```typescript
GET /api/chat/history?userId=:userId
```

**Parameters:**
- `userId` (string, optional): User ID

**Response:**
```typescript
ChatHistory | null
```

**Usage:**
```typescript
const history = await apiService.chat.getHistory('user123');
```

#### Get All Chat Histories
```typescript
GET /api/chat/histories
```

**Response:**
```typescript
ChatHistory[]
```

**Usage:**
```typescript
const allHistories = await apiService.chat.getAllHistories();
```

#### Delete Chat History
```typescript
DELETE /api/chat/history/:id
```

**Parameters:**
- `id` (string): Chat history ID

**Response:**
```typescript
void
```

**Usage:**
```typescript
await apiService.chat.deleteHistory('history123');
```

### Quiz Results

#### Save Quiz Result
```typescript
POST /api/quiz/results
```

**Request Body:**
```typescript
{
  quizType: 'brand_audit' | 'roi_calculator' | 'other';
  answers: number[];
  score: number;
  recommendation?: string;
  metadata?: Record<string, any>;
  userId?: string;
}
```

**Response:**
```typescript
QuizResult // Includes auto-generated id and completedAt
```

**Usage:**
```typescript
const result = await apiService.quiz.saveResult({
  quizType: 'brand_audit',
  answers: [0, 1, 2],
  score: 75,
  recommendation: 'Good potential',
  userId: 'user123'
});
```

#### Get Quiz Result by ID
```typescript
GET /api/quiz/results/:id
```

**Parameters:**
- `id` (string): Quiz result ID

**Response:**
```typescript
QuizResult
```

**Usage:**
```typescript
const result = await apiService.quiz.getResult('result123');
```

#### Get Quiz Results by User
```typescript
GET /api/quiz/results?userId=:userId
```

**Parameters:**
- `userId` (string): User ID

**Response:**
```typescript
QuizResult[]
```

**Usage:**
```typescript
const userResults = await apiService.quiz.getResultsByUser('user123');
```

#### Get Quiz Results by Type
```typescript
GET /api/quiz/results?type=:quizType
```

**Parameters:**
- `quizType` (string): Quiz type ('brand_audit', 'roi_calculator', 'other')

**Response:**
```typescript
QuizResult[]
```

**Usage:**
```typescript
const brandAuditResults = await apiService.quiz.getResultsByType('brand_audit');
```

#### Get All Quiz Results
```typescript
GET /api/quiz/results
```

**Response:**
```typescript
QuizResult[]
```

**Usage:**
```typescript
const allResults = await apiService.quiz.getAll();
```

#### Delete Quiz Result
```typescript
DELETE /api/quiz/results/:id
```

**Parameters:**
- `id` (string): Quiz result ID

**Response:**
```typescript
void
```

**Usage:**
```typescript
await apiService.quiz.delete('result123');
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
6. **useTestimonials** - Manage testimonials
7. **useTeamMembers** - Manage team members
8. **useDevis** - Manage devis (quotes)
9. **useAuth** - Manage authentication

**Note:** Hooks for Newsletter, Search, Chat History, and Quiz Results can be created following the same pattern as existing hooks if needed.

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
  
  // Blog Posts
  blogPosts: BlogPost[];
  blogPostsLoading: boolean;
  blogPostsError: string | null;
  
  // Pricing Packages
  pricingPackages: PricingPackage[];
  pricingPackagesLoading: boolean;
  pricingPackagesError: string | null;
  
  // FAQs
  faqs: FAQItem[];
  faqsLoading: boolean;
  faqsError: string | null;
  
  // Testimonials
  testimonials: Testimonial[];
  testimonialsLoading: boolean;
  testimonialsError: string | null;
  
  // Team Members
  teamMembers: TeamMember[];
  teamMembersLoading: boolean;
  teamMembersError: string | null;
  
  // Devis
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  
  // Auth
  user: { username: string; email: string } | null;
  authLoading: boolean;
  authError: string | null;
  isAuthenticated: boolean;
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
- `types.ts` - Core types (Project, Lead, BlogPost, Division, Testimonial, TeamMember, Devis, NewsletterSubscription, SearchQuery, ChatHistory, QuizResult)
- `services/mockDataService.ts` - PricingPackage, FAQItem

### New Types

#### NewsletterSubscription
```typescript
interface NewsletterSubscription {
  id: string;
  email: string;
  source: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  isActive: boolean;
}
```

#### SearchQuery
```typescript
interface SearchQuery {
  id: string;
  query: string;
  resultsCount: number;
  searchedAt: string;
  userId?: string;
}
```

#### ChatHistory
```typescript
interface ChatHistory {
  id: string;
  userId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

#### QuizResult
```typescript
interface QuizResult {
  id: string;
  quizType: 'brand_audit' | 'roi_calculator' | 'other';
  answers: number[];
  score: number;
  recommendation?: string;
  metadata?: Record<string, any>;
  completedAt: string;
  userId?: string;
}
```

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

