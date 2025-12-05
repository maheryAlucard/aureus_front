# Admin Backoffice - Complete Specification

## Table of Contents

1. [Overview](#overview)
2. [Architecture & Structure](#architecture--structure)
3. [Authentication & Authorization](#authentication--authorization)
4. [Dashboard Pages](#dashboard-pages)
   - [Dashboard Home](#1-dashboard-home)
   - [Projects Management](#2-projects-management)
   - [Leads Management](#3-leads-management)
   - [Blog Posts Management](#4-blog-posts-management)
   - [Team Members Management](#5-team-members-management)
   - [Testimonials Management](#6-testimonials-management)
   - [Pricing Packages Management](#7-pricing-packages-management)
   - [FAQs Management](#8-faqs-management)
   - [Devis Management](#9-devis-management)
   - [Newsletter Subscriptions](#10-newsletter-subscriptions)
   - [Content Management](#11-content-management)
   - [Site Settings](#12-site-settings)
   - [Analytics & Reports](#13-analytics--reports)
   - [User Management](#14-user-management)
   - [Search Analytics](#15-search-analytics)
   - [Chat History Management](#16-chat-history-management)
   - [Quiz Results Management](#17-quiz-results-management)
5. [UI/UX Requirements](#uiux-requirements)
6. [API Integration](#api-integration)
7. [File Structure](#file-structure)
8. [Implementation Priority](#implementation-priority)

---

## Overview

The Admin Backoffice is a comprehensive content management system (CMS) for the Aureus Digital Agency website. It provides administrators with full control over all website content, user interactions, and business operations.

### Key Features

- **Content Management**: Full CRUD operations for all content types
- **Lead Management**: Track and manage customer inquiries
- **Analytics Dashboard**: Real-time insights and metrics
- **User Management**: Admin user roles and permissions
- **Media Management**: Image and file upload capabilities
- **SEO Management**: Meta tags, descriptions, and content optimization
- **Automated Features**: AI-powered content generation

---

## Architecture & Structure

### Routing Structure

```
/admin
├── /admin/login                    # Login page
├── /admin                          # Dashboard home (redirects to /admin/dashboard)
├── /admin/dashboard                # Main dashboard with overview
├── /admin/projects                 # Projects management
├── /admin/projects/:id            # Project detail/edit
├── /admin/leads                    # Leads management
├── /admin/leads/:id                # Lead detail/view
├── /admin/blog                     # Blog posts management
├── /admin/blog/:id                 # Blog post detail/edit
├── /admin/team                     # Team members management
├── /admin/team/:id                 # Team member detail/edit
├── /admin/testimonials             # Testimonials management
├── /admin/testimonials/:id         # Testimonial detail/edit
├── /admin/pricing                  # Pricing packages management
├── /admin/pricing/:id              # Pricing package detail/edit
├── /admin/faqs                     # FAQs management
├── /admin/faqs/:id                 # FAQ detail/edit
├── /admin/devis                    # Devis (quotes) management
├── /admin/devis/:id                # Devis detail/view
├── /admin/newsletter               # Newsletter subscriptions
├── /admin/content                  # Home page content editor
├── /admin/settings                 # Site settings
├── /admin/analytics                # Analytics & reports
├── /admin/users                    # User management
├── /admin/search                   # Search analytics
├── /admin/chat                     # Chat history management
└── /admin/quiz                     # Quiz results management
```

### Component Structure

```
pages/admin/
├── Dashboard.tsx                   # Main dashboard
├── Projects/
│   ├── ProjectsList.tsx
│   ├── ProjectForm.tsx
│   └── ProjectDetail.tsx
├── Leads/
│   ├── LeadsList.tsx
│   └── LeadDetail.tsx
├── Blog/
│   ├── BlogList.tsx
│   ├── BlogForm.tsx
│   └── BlogDetail.tsx
├── Team/
│   ├── TeamList.tsx
│   ├── TeamForm.tsx
│   └── TeamDetail.tsx
├── Testimonials/
│   ├── TestimonialsList.tsx
│   ├── TestimonialForm.tsx
│   └── TestimonialDetail.tsx
├── Pricing/
│   ├── PricingList.tsx
│   ├── PricingForm.tsx
│   └── PricingDetail.tsx
├── FAQs/
│   ├── FAQsList.tsx
│   ├── FAQForm.tsx
│   └── FAQDetail.tsx
├── Devis/
│   ├── DevisList.tsx
│   └── DevisDetail.tsx
├── Newsletter/
│   └── NewsletterSubscriptions.tsx
├── Content/
│   └── HomePageEditor.tsx
├── Settings/
│   └── SiteSettings.tsx
├── Analytics/
│   └── AnalyticsDashboard.tsx
├── Users/
│   ├── UsersList.tsx
│   └── UserForm.tsx
├── Search/
│   └── SearchAnalytics.tsx
├── Chat/
│   └── ChatHistory.tsx
└── Quiz/
    └── QuizResults.tsx

components/admin/
├── AdminLayout.tsx                 # Main admin layout with sidebar
├── AdminSidebar.tsx                # Navigation sidebar
├── AdminHeader.tsx                 # Top header with user info
├── DataTable.tsx                   # Reusable data table component
├── FormField.tsx                   # Reusable form field
├── ImageUploader.tsx               # Image upload component
├── RichTextEditor.tsx              # WYSIWYG editor
├── StatusBadge.tsx                 # Status indicator badge
├── FilterBar.tsx                   # Filter/search bar
├── Pagination.tsx                  # Pagination component
├── ConfirmDialog.tsx               # Confirmation dialog
├── StatsCard.tsx                   # Dashboard stat card
└── Chart.tsx                       # Chart component for analytics
```

---

## Authentication & Authorization

### Authentication Flow

1. **Login Page** (`/admin/login`)
   - Email/Username and password authentication
   - Remember me option
   - Forgot password link
   - Redirect to dashboard on success
   - Show error messages for invalid credentials

2. **Session Management**
   - JWT token stored in localStorage
   - Token refresh mechanism
   - Auto-logout on token expiration
   - Protected routes using `ProtectedRoute` component

3. **Authorization Levels** (Future Enhancement)
   - **Super Admin**: Full access to all features
   - **Admin**: Content management, no user management
   - **Editor**: Can edit content, cannot delete
   - **Viewer**: Read-only access

---

## Dashboard Pages

### 1. Dashboard Home

**Route**: `/admin/dashboard`

**Purpose**: Overview of key metrics and recent activity

**Features**:
- **Key Metrics Cards**:
  - Total Projects
  - Active Leads (new + contacted)
  - Blog Posts Published
  - Newsletter Subscribers
  - Total Devis Generated
  - Team Members
  - Recent Testimonials Count

- **Charts & Graphs**:
  - Leads by Status (pie chart)
  - Leads by Division (bar chart)
  - Projects by Division (bar chart)
  - Monthly Leads Trend (line chart)
  - Blog Posts Published Over Time (line chart)

- **Recent Activity Feed**:
  - Latest leads (last 10)
  - Recent projects added
  - Latest blog posts
  - Recent devis generated

- **Quick Actions**:
  - Create New Project
  - Create New Blog Post
  - View All Leads
  - Generate Report

**Data Required**:
- Aggregated statistics from all entities
- Recent items from each entity type
- Time-series data for charts

---

### 2. Projects Management

**Route**: `/admin/projects`

**List View Features**:
- **Data Table Columns**:
  - Thumbnail (image preview)
  - Title
  - Client Name
  - Division (TECH/STUDIO/BRAND) with color badge
  - Tags (comma-separated)
  - Created Date
  - Actions (Edit, Delete, View)

- **Filtering & Search**:
  - Search by title, client, or tags
  - Filter by Division
  - Filter by date range
  - Sort by: Date (newest/oldest), Title (A-Z), Client (A-Z)

- **Bulk Actions**:
  - Delete multiple projects
  - Export to CSV/Excel
  - Change division (bulk update)

- **Pagination**: 20 items per page

**Create/Edit Form Fields**:
- **Basic Information**:
  - Title* (text input)
  - Client Name* (text input)
  - Division* (dropdown: TECH, STUDIO, BRAND)
  - Tags* (multi-select with autocomplete, add new tags)
  - Main Image URL* (text input + image uploader)
  - Description* (textarea, 500 chars max)
  - Full Description (rich text editor)

- **Media**:
  - Additional Images (multiple image uploads)
  - Video URL (optional, YouTube/Vimeo embed)
  - Image Gallery Manager (reorder, delete)

- **Details**:
  - Technologies Used (multi-select)
  - Results/Outcomes (list of text inputs, add/remove)
  - Featured Project (checkbox)

- **AI Features**:
  - "Generate Description with AI" button (uses Gemini)
  - Auto-generate slug from title

- **SEO**:
  - Meta Title
  - Meta Description
  - Custom Slug

**Project Detail View**:
- Full project information display
- Preview mode (how it appears on frontend)
- Edit button
- Delete button with confirmation
- View on frontend link

**API Endpoints Used**:
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

---

### 3. Leads Management

**Route**: `/admin/leads`

**List View Features**:
- **Data Table Columns**:
  - Name
  - Email (clickable mailto link)
  - Division Interest (badge)
  - Status (badge: new/contacted/closed)
  - Date Received
  - Budget (if provided)
  - Actions (View, Mark as Contacted, Mark as Closed, Delete)

- **Status Indicators**:
  - New: Red badge
  - Contacted: Yellow badge
  - Closed: Green badge

- **Filtering & Search**:
  - Search by name, email, or message
  - Filter by Status
  - Filter by Division
  - Filter by date range
  - Show only unread/new leads

- **Quick Actions**:
  - Mark as Contacted (bulk)
  - Mark as Closed (bulk)
  - Export to CSV
  - Send Email (opens email client)

**Lead Detail View**:
- **Lead Information**:
  - Full name and email
  - Contact information
  - Division interest
  - Budget range
  - Event date (if applicable)
  - Date received

- **Message Content**:
  - Full message text
  - Formatted display

- **Status Management**:
  - Change status dropdown
  - Add notes/comments
  - Internal notes section (not visible to lead)

- **Actions**:
  - Reply via Email
  - Create Devis from Lead
  - Convert to Project
  - Delete Lead

**API Endpoints Used**:
- `GET /api/leads` - List all leads
- `GET /api/leads/:id` - Get lead by ID
- `PATCH /api/leads/:id` - Update lead
- `PATCH /api/leads/:id/status` - Update lead status
- `DELETE /api/leads/:id` - Delete lead

---

### 4. Blog Posts Management

**Route**: `/admin/blog`

**List View Features**:
- **Data Table Columns**:
  - Thumbnail (image preview)
  - Title
  - Category
  - Slug
  - Published Date
  - Reading Time
  - Status (Draft/Published)
  - Actions (Edit, Delete, View, Publish/Unpublish)

- **Filtering & Search**:
  - Search by title, category, or content
  - Filter by Category
  - Filter by Status
  - Filter by date range
  - Sort by: Date, Title, Category

**Create/Edit Form Fields**:
- **Content**:
  - Title* (text input)
  - Slug* (auto-generated from title, editable)
  - Excerpt* (textarea, 200 chars max)
  - Category* (dropdown with existing categories + add new)
  - Featured Image URL* (text input + image uploader)
  - Content* (rich text editor with markdown support)
  - Tags (multi-select)

- **Publishing**:
  - Published Date* (date picker)
  - Status (Draft/Published toggle)
  - Featured Post (checkbox)

- **SEO**:
  - Meta Title
  - Meta Description
  - Meta Keywords

- **Additional**:
  - Reading Time (auto-calculated, editable)
  - Author (dropdown from team members)

**Blog Post Detail View**:
- Full post preview
- Edit button
- Publish/Unpublish toggle
- View on frontend link
- Delete button

**API Endpoints Used**:
- `GET /api/blog-posts` - List all blog posts
- `GET /api/blog-posts/:id` - Get post by ID
- `GET /api/blog-posts/slug/:slug` - Get post by slug
- `POST /api/blog-posts` - Create post
- `PATCH /api/blog-posts/:id` - Update post
- `DELETE /api/blog-posts/:id` - Delete post

---

### 5. Team Members Management

**Route**: `/admin/team`

**List View Features**:
- **Data Table Columns**:
  - Photo (thumbnail)
  - Name
  - Role
  - Division (badge)
  - Featured (yes/no badge)
  - Actions (Edit, Delete, Toggle Featured)

- **Filtering & Search**:
  - Search by name or role
  - Filter by Division
  - Filter by Featured status
  - Sort by: Name, Division, Featured

**Create/Edit Form Fields**:
- **Basic Information**:
  - Name* (text input)
  - Role* (text input)
  - Division* (dropdown: TECH, STUDIO, BRAND)
  - Bio* (textarea, 500 chars max)
  - Photo URL* (text input + image uploader)

- **Expertise**:
  - Expertise Tags (multi-select with autocomplete)
  - Add custom expertise tags

- **Contact & Social**:
  - LinkedIn URL (optional)
  - Email (optional)
  - Other social links (optional)

- **Display Options**:
  - Featured Member (checkbox)
  - Display Order (number input)

**Team Member Detail View**:
- Full member information
- Preview card (how it appears on frontend)
- Edit button
- Delete button

**API Endpoints Used**:
- `GET /api/team-members` - List all team members
- `GET /api/team-members/:id` - Get member by ID
- `GET /api/team-members?division=:division` - Get by division
- `GET /api/team-members?featured=true` - Get featured members
- `POST /api/team-members` - Create member
- `PATCH /api/team-members/:id` - Update member
- `DELETE /api/team-members/:id` - Delete member

---

### 6. Testimonials Management

**Route**: `/admin/testimonials`

**List View Features**:
- **Data Table Columns**:
  - Photo/Logo (thumbnail)
  - Name
  - Company
  - Role
  - Rating (stars display)
  - Division (badge)
  - Actions (Edit, Delete, View)

- **Filtering & Search**:
  - Search by name, company, or content
  - Filter by Division
  - Filter by Rating (4+, 5 stars)
  - Sort by: Date, Rating, Company

**Create/Edit Form Fields**:
- **Client Information**:
  - Name* (text input)
  - Role* (text input)
  - Company* (text input)
  - Company Logo URL (optional, image uploader)
  - Photo URL (optional, image uploader)

- **Testimonial Content**:
  - Content* (textarea, 500 chars max)
  - Rating* (1-5 stars selector)
  - Division (dropdown, optional)

- **Media**:
  - Video URL (optional, for video testimonials)

**Testimonial Detail View**:
- Full testimonial display
- Preview card
- Edit button
- Delete button

**API Endpoints Used**:
- `GET /api/testimonials` - List all testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `GET /api/testimonials?division=:division` - Get by division
- `POST /api/testimonials` - Create testimonial
- `PATCH /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

---

### 7. Pricing Packages Management

**Route**: `/admin/pricing`

**List View Features**:
- **Data Table Columns**:
  - Title
  - Division (badge)
  - Price
  - Features Count
  - Popular/Highlight (badge)
  - Actions (Edit, Delete, View)

- **Filtering & Search**:
  - Search by title
  - Filter by Division
  - Filter by Popular/Highlight
  - Sort by: Price, Title, Division

**Create/Edit Form Fields**:
- **Package Information**:
  - Title* (text input)
  - Division* (dropdown: TECH, STUDIO, BRAND)
  - Price* (text input, e.g., "2,500€")
  - Price Note (text input, e.g., "Paiement unique")
  - Description (textarea)

- **Features**:
  - Features List (list of text inputs, add/remove)
  - Add feature button
  - Reorder features (drag & drop)

- **Display Options**:
  - Popular Package (checkbox)
  - Highlight Package (checkbox)
  - Delivery Time (text input)
  - Revisions (text input)

**Pricing Package Detail View**:
- Full package information
- Preview card
- Edit button
- Delete button

**API Endpoints Used**:
- `GET /api/pricing-packages` - List all packages
- `GET /api/pricing-packages/:id` - Get package by ID
- `POST /api/pricing-packages` - Create package
- `PATCH /api/pricing-packages/:id` - Update package
- `DELETE /api/pricing-packages/:id` - Delete package

---

### 8. FAQs Management

**Route**: `/admin/faqs`

**List View Features**:
- **Data Table Columns**:
  - Question (truncated)
  - Answer (truncated)
  - Category (optional)
  - Display Order
  - Actions (Edit, Delete, View)

- **Filtering & Search**:
  - Search by question or answer
  - Filter by Category
  - Sort by: Order, Question

**Create/Edit Form Fields**:
- **FAQ Content**:
  - Question* (text input)
  - Answer* (textarea or rich text editor)
  - Category (optional, dropdown)
  - Display Order (number input)

**FAQ Detail View**:
- Full FAQ display
- Preview
- Edit button
- Delete button

**API Endpoints Used**:
- `GET /api/faqs` - List all FAQs
- `GET /api/faqs/:id` - Get FAQ by ID
- `POST /api/faqs` - Create FAQ
- `PATCH /api/faqs/:id` - Update FAQ
- `DELETE /api/faqs/:id` - Delete FAQ

---

### 9. Devis Management

**Route**: `/admin/devis`

**List View Features**:
- **Data Table Columns**:
  - Client Name
  - Client Email
  - Company Name
  - Division (badge)
  - Created Date
  - Budget
  - Actions (View, Download PDF, Delete)

- **Filtering & Search**:
  - Search by client name, email, or company
  - Filter by Division
  - Filter by date range
  - Filter by User ID (if applicable)
  - Sort by: Date, Client Name

**Devis Detail View**:
- **Client Information**:
  - Full client details
  - Contact information

- **Project Details**:
  - Division
  - Project Description
  - Budget
  - Deadline
  - Additional Requirements

- **Generated Content**:
  - Full devis content (formatted)
  - Rich text display

- **Actions**:
  - Download as PDF
  - Send via Email
  - Edit Content
  - Convert to Project
  - Delete Devis

**API Endpoints Used**:
- `GET /api/devis` - List all devis
- `GET /api/devis/:id` - Get devis by ID
- `GET /api/devis?userId=:userId` - Get by user ID
- `PATCH /api/devis/:id` - Update devis
- `DELETE /api/devis/:id` - Delete devis

---

### 10. Newsletter Subscriptions

**Route**: `/admin/newsletter`

**List View Features**:
- **Data Table Columns**:
  - Email
  - Source (where they subscribed)
  - Subscribed Date
  - Status (Active/Unsubscribed)
  - Unsubscribed Date (if applicable)
  - Actions (View, Unsubscribe, Delete)

- **Statistics Cards**:
  - Total Subscribers
  - Active Subscribers
  - Unsubscribed Count
  - New This Month

- **Filtering & Search**:
  - Search by email
  - Filter by Status
  - Filter by Source
  - Filter by date range
  - Export to CSV

**Bulk Actions**:
- Export email list (CSV)
- Send Newsletter (integration with email service)
- Unsubscribe multiple

**API Endpoints Used**:
- `GET /api/newsletter/subscriptions` - List all subscriptions
- `GET /api/newsletter/subscriptions/:email` - Get by email
- `POST /api/newsletter/unsubscribe` - Unsubscribe

---

### 11. Content Management

**Route**: `/admin/content`

**Home Page Content Editor**:

**Sections to Edit**:
1. **Hero Section**:
   - Hero Badge Text
   - Hero Title
   - Hero Subtitle
   - Hero Description
   - Hero Description Highlight

2. **Metrics Section**:
   - List of metrics (value, label, icon, color, order)
   - Add/Edit/Delete metrics
   - Reorder metrics

3. **Methodology Section**:
   - Methodology Title
   - Methodology Description
   - Methodology Steps (step number, title, description, icon, order)
   - Add/Edit/Delete steps
   - Reorder steps

4. **Tech Stack Section**:
   - Tech Stack Title
   - Tech Stack Items (list of technologies)
   - Creative Stack Items (list of creative tools)

5. **Why Us Section**:
   - Why Us Title
   - Why Us Items (title, description, icon, color)
   - Add/Edit/Delete items

6. **Team Teaser Section**:
   - Team Teaser Title
   - Team Teaser Description

7. **Blog Section**:
   - Blog Section Title
   - Blog Section Description

**Features**:
- Live preview of changes
- Save draft / Publish
- Revert to previous version
- Section-by-section editing

**API Endpoints Used**:
- `GET /api/content/home-page` - Get home page content
- `PUT /api/content/home-page` - Update home page content

---

### 12. Site Settings

**Route**: `/admin/settings`

**Settings Categories**:

1. **General Settings**:
   - Site Name
   - Site Description
   - Footer Description
   - Contact Email
   - Careers Email

2. **Footer Links**:
   - Manage footer links by category:
     - Divisions links
     - Company links
     - Other links
   - Add/Edit/Delete links
   - Reorder links

3. **Social Media Links**:
   - Twitter URL
   - LinkedIn URL
   - GitHub URL
   - Instagram URL
   - YouTube URL

4. **SEO Settings**:
   - SEO Keywords (comma-separated)
   - Default Meta Title
   - Default Meta Description
   - Google Analytics ID
   - Facebook Pixel ID

5. **Feature Toggles**:
   - Enable Chat Assistant
   - Enable Newsletter
   - Enable Quiz Tools
   - Maintenance Mode

**Features**:
- Save all settings
- Reset to defaults
- Export settings (JSON)
- Import settings (JSON)

**API Endpoints Used**:
- `GET /api/settings/site` - Get site settings
- `PUT /api/settings/site` - Update site settings

---

### 13. Analytics & Reports

**Route**: `/admin/analytics`

**Dashboard Sections**:

1. **Overview Metrics**:
   - Total Page Views
   - Unique Visitors
   - Bounce Rate
   - Average Session Duration
   - Conversion Rate

2. **Traffic Sources**:
   - Direct
   - Organic Search
   - Social Media
   - Referrals
   - Paid Ads

3. **Page Performance**:
   - Most Visited Pages
   - Least Visited Pages
   - Page Load Times

4. **User Behavior**:
   - Top Search Queries
   - Most Popular Blog Posts
   - Most Viewed Projects
   - Division Interest Distribution

5. **Lead Analytics**:
   - Leads by Source
   - Leads by Division
   - Conversion Funnel
   - Lead Status Distribution

6. **Content Performance**:
   - Blog Post Views
   - Project Views
   - Newsletter Open Rate
   - Chat Interactions

**Charts & Visualizations**:
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Heatmaps for user activity

**Date Range Selector**:
- Today
- Last 7 days
- Last 30 days
- Last 3 months
- Last year
- Custom range

**Export Options**:
- Export to PDF
- Export to Excel
- Export to CSV

**API Endpoints** (to be implemented):
- `GET /api/analytics/overview` - Overview metrics
- `GET /api/analytics/traffic` - Traffic sources
- `GET /api/analytics/pages` - Page performance
- `GET /api/analytics/leads` - Lead analytics
- `GET /api/analytics/content` - Content performance

---

### 14. User Management

**Route**: `/admin/users`

**List View Features**:
- **Data Table Columns**:
  - Username
  - Email
  - Role
  - Created Date
  - Last Login
  - Status (Active/Inactive)
  - Actions (Edit, Delete, Reset Password)

**Create/Edit Form Fields**:
- Username* (text input)
- Email* (email input)
- Password* (password input, required for new users)
- Role* (dropdown: Super Admin, Admin, Editor, Viewer)
- Status (Active/Inactive toggle)

**Features**:
- Create new admin user
- Edit user details
- Reset password
- Deactivate/Activate user
- Delete user (with confirmation)

**API Endpoints** (to be implemented):
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/reset-password` - Reset password

---

### 15. Search Analytics

**Route**: `/admin/search`

**List View Features**:
- **Data Table Columns**:
  - Search Query
  - Results Count
  - Searched Date
  - User ID (if logged in)
  - Actions (View Details)

**Statistics**:
- Total Searches
- Unique Queries
- Average Results per Query
- Most Searched Terms
- Zero Results Queries

**Charts**:
- Search Volume Over Time
- Top Search Terms (word cloud or bar chart)
- Search Results Distribution

**Filtering**:
- Search by query text
- Filter by date range
- Filter by user ID
- Show only zero results

**API Endpoints Used**:
- `GET /api/search/history` - Get search history
- `GET /api/search/analytics` - Get search analytics (to be implemented)

---

### 16. Chat History Management

**Route**: `/admin/chat`

**List View Features**:
- **Data Table Columns**:
  - User ID (or "Anonymous")
  - Message Count
  - Created Date
  - Last Updated
  - Actions (View, Delete)

**Chat Detail View**:
- Full conversation history
- Messages displayed chronologically
- User and Assistant messages clearly distinguished
- Export conversation

**Statistics**:
- Total Conversations
- Active Conversations
- Average Messages per Conversation
- Most Common Questions

**Filtering**:
- Filter by User ID
- Filter by date range
- Search in conversations

**API Endpoints Used**:
- `GET /api/chat/histories` - List all chat histories
- `GET /api/chat/history/:id` - Get chat history by ID
- `DELETE /api/chat/history/:id` - Delete chat history

---

### 17. Quiz Results Management

**Route**: `/admin/quiz`

**List View Features**:
- **Data Table Columns**:
  - Quiz Type (badge)
  - Score
  - User ID (or "Anonymous")
  - Completed Date
  - Actions (View, Delete)

**Filtering & Search**:
- Filter by Quiz Type
- Filter by User ID
- Filter by date range
- Filter by score range
- Sort by: Date, Score

**Quiz Result Detail View**:
- Quiz Type
- User Information
- Answers (array display)
- Score
- Recommendation
- Metadata (if available)
- Completed Date

**Statistics**:
- Total Quiz Completions
- Average Score by Quiz Type
- Quiz Type Distribution
- Score Distribution

**API Endpoints Used**:
- `GET /api/quiz/results` - List all quiz results
- `GET /api/quiz/results/:id` - Get result by ID
- `GET /api/quiz/results?userId=:userId` - Get by user
- `GET /api/quiz/results?type=:quizType` - Get by type
- `DELETE /api/quiz/results/:id` - Delete result

---

## UI/UX Requirements

### Design System

**Color Scheme**:
- Primary: Dark theme with accent colors matching divisions
- TECH: Cyan (#06b6d4)
- STUDIO: Fuchsia (#d946ef)
- BRAND: Indigo (#6366f1)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

**Typography**:
- Headings: Bold, clear hierarchy
- Body: Readable, appropriate line height
- Code/Monospace: For technical data

**Components**:
- Consistent button styles
- Form inputs with clear labels
- Loading states (spinners, skeletons)
- Error states (clear error messages)
- Success states (toast notifications)
- Empty states (helpful messages when no data)

### Responsive Design

- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, adjusted column widths
- **Mobile**: Hamburger menu, single column, touch-friendly buttons

### Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus indicators
- Color contrast compliance (WCAG AA)
- Alt text for images

### Performance

- Lazy loading for images
- Pagination for large datasets
- Debounced search inputs
- Optimistic UI updates
- Loading states for async operations

---

## API Integration

### Current API Service

The project already has a comprehensive API service layer in `services/apiService.ts` with mock data. All endpoints are documented and ready to be connected to a real backend.

### API Service Methods Available

All CRUD operations are available for:
- Projects
- Leads
- Blog Posts
- Pricing Packages
- FAQs
- Testimonials
- Team Members
- Devis
- Newsletter Subscriptions
- Search
- Chat History
- Quiz Results
- Home Page Content
- Site Settings

### Migration to Real API

When connecting to a real backend:
1. Update `VITE_API_BASE_URL` in `.env`
2. Uncomment production API calls in `apiService.ts`
3. Remove mock data arrays
4. Ensure backend response types match TypeScript interfaces
5. Test all endpoints

---

## File Structure

### Recommended Structure

```
src/
├── pages/
│   └── admin/
│       ├── Dashboard.tsx
│       ├── Projects/
│       │   ├── ProjectsList.tsx
│       │   ├── ProjectForm.tsx
│       │   └── ProjectDetail.tsx
│       ├── Leads/
│       │   ├── LeadsList.tsx
│       │   └── LeadDetail.tsx
│       ├── Blog/
│       │   ├── BlogList.tsx
│       │   ├── BlogForm.tsx
│       │   └── BlogDetail.tsx
│       ├── Team/
│       │   ├── TeamList.tsx
│       │   ├── TeamForm.tsx
│       │   └── TeamDetail.tsx
│       ├── Testimonials/
│       │   ├── TestimonialsList.tsx
│       │   ├── TestimonialForm.tsx
│       │   └── TestimonialDetail.tsx
│       ├── Pricing/
│       │   ├── PricingList.tsx
│       │   ├── PricingForm.tsx
│       │   └── PricingDetail.tsx
│       ├── FAQs/
│       │   ├── FAQsList.tsx
│       │   ├── FAQForm.tsx
│       │   └── FAQDetail.tsx
│       ├── Devis/
│       │   ├── DevisList.tsx
│       │   └── DevisDetail.tsx
│       ├── Newsletter/
│       │   └── NewsletterSubscriptions.tsx
│       ├── Content/
│       │   └── HomePageEditor.tsx
│       ├── Settings/
│       │   └── SiteSettings.tsx
│       ├── Analytics/
│       │   └── AnalyticsDashboard.tsx
│       ├── Users/
│       │   ├── UsersList.tsx
│       │   └── UserForm.tsx
│       ├── Search/
│       │   └── SearchAnalytics.tsx
│       ├── Chat/
│       │   └── ChatHistory.tsx
│       └── Quiz/
│           └── QuizResults.tsx
│
├── components/
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       ├── DataTable.tsx
│       ├── FormField.tsx
│       ├── ImageUploader.tsx
│       ├── RichTextEditor.tsx
│       ├── StatusBadge.tsx
│       ├── FilterBar.tsx
│       ├── Pagination.tsx
│       ├── ConfirmDialog.tsx
│       ├── StatsCard.tsx
│       └── Chart.tsx
│
├── hooks/
│   └── admin/
│       ├── useAdminData.ts
│       ├── useFormValidation.ts
│       └── useImageUpload.ts
│
├── utils/
│   └── admin/
│       ├── formatters.ts
│       ├── validators.ts
│       └── exporters.ts
│
└── services/
    ├── apiService.ts (already exists)
    └── imageUploadService.ts (to be created)
```

---

## Implementation Priority

### Phase 1: Core Functionality (High Priority)
1. ✅ Authentication & Login
2. Dashboard Home with basic metrics
3. Projects Management (CRUD)
4. Leads Management (View, Update Status)
5. Blog Posts Management (CRUD)

### Phase 2: Content Management (High Priority)
6. Team Members Management (CRUD)
7. Testimonials Management (CRUD)
8. Pricing Packages Management (CRUD)
9. FAQs Management (CRUD)
10. Home Page Content Editor

### Phase 3: Advanced Features (Medium Priority)
11. Devis Management (View, Export)
12. Newsletter Subscriptions (View, Export)
13. Site Settings
14. Search Analytics
15. Chat History Management

### Phase 4: Analytics & Reports (Medium Priority)
16. Analytics Dashboard
17. Reports Generation
18. Export Functionality

### Phase 5: User Management (Low Priority)
19. User Management (if multi-user support needed)
20. Role-based Permissions

### Phase 6: Enhancements (Low Priority)
21. Image Upload Service
22. Rich Text Editor Integration
23. PDF Generation for Devis
24. Email Integration
25. Advanced Filtering & Search

---

## Additional Features to Consider

### Media Library
- Centralized image/file management
- Image cropping and resizing
- CDN integration
- File organization (folders, tags)

### Activity Log
- Track all admin actions
- User activity history
- Change history for content
- Audit trail

### Notifications
- New lead notifications
- System alerts
- Email notifications for important events

### Backup & Restore
- Export all data
- Import data
- Version control for content

### Multi-language Support (Future)
- Content translation
- Language-specific settings
- Localized content management

---

## Technical Requirements

### Dependencies to Add

```json
{
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "lucide-react": "^0.x",
  "framer-motion": "^11.x",
  "recharts": "^2.x", // For charts
  "react-hook-form": "^7.x", // For forms
  "zod": "^3.x", // For validation
  "react-hot-toast": "^2.x", // For notifications
  "date-fns": "^3.x", // For date formatting
  "react-quill": "^2.x" // For rich text editor (optional)
}
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GEMINI_API_KEY=your_gemini_key
VITE_UPLOAD_SERVICE_URL=http://localhost:3000/upload
```

---

## Conclusion

This specification provides a comprehensive blueprint for building a complete admin backoffice for the Aureus Digital Agency website. The system is designed to be:

- **Comprehensive**: Covers all content types and business operations
- **Scalable**: Easy to extend with new features
- **User-Friendly**: Intuitive interface with clear navigation
- **Maintainable**: Well-structured code with reusable components
- **Secure**: Authentication and authorization built-in
- **Performant**: Optimized for speed and efficiency

Follow the implementation priority to build the system incrementally, starting with core functionality and gradually adding advanced features.

