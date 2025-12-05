# Admin Backoffice - Quick Reference Guide

## Overview

This is a quick reference guide for the Admin Backoffice. For complete details, see [ADMIN_BACKOFFICE_SPECIFICATION.md](./ADMIN_BACKOFFICE_SPECIFICATION.md).

## All Admin Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/admin/login` | Login | Authentication |
| `/admin/dashboard` | Dashboard Home | Overview & metrics |
| `/admin/projects` | Projects | Manage portfolio projects |
| `/admin/leads` | Leads | Manage customer inquiries |
| `/admin/blog` | Blog Posts | Manage blog content |
| `/admin/team` | Team Members | Manage team profiles |
| `/admin/testimonials` | Testimonials | Manage client testimonials |
| `/admin/pricing` | Pricing Packages | Manage pricing tiers |
| `/admin/faqs` | FAQs | Manage frequently asked questions |
| `/admin/devis` | Devis | View and manage quotes |
| `/admin/newsletter` | Newsletter | Manage subscriptions |
| `/admin/content` | Content | Edit home page content |
| `/admin/settings` | Settings | Site configuration |
| `/admin/analytics` | Analytics | Reports & insights |
| `/admin/users` | Users | User management (future) |
| `/admin/search` | Search Analytics | Search query analytics |
| `/admin/chat` | Chat History | View chat conversations |
| `/admin/quiz` | Quiz Results | View quiz completions |

## Core Features by Page

### Dashboard (`/admin/dashboard`)
- Key metrics cards
- Charts (leads, projects, blog posts)
- Recent activity feed
- Quick actions

### Projects (`/admin/projects`)
- List, create, edit, delete projects
- Filter by division, search, sort
- AI-powered description generation
- Image gallery management
- SEO fields

### Leads (`/admin/leads`)
- View all leads
- Update status (new → contacted → closed)
- Filter by status, division, date
- Export to CSV
- Create devis from lead

### Blog Posts (`/admin/blog`)
- List, create, edit, delete posts
- Rich text editor
- Publish/unpublish
- SEO optimization
- Category management

### Team Members (`/admin/team`)
- Manage team profiles
- Division assignment
- Featured member toggle
- Expertise tags
- Social links

### Testimonials (`/admin/testimonials`)
- Add/edit testimonials
- Rating system (1-5 stars)
- Division association
- Video testimonials support

### Pricing Packages (`/admin/pricing`)
- Create/edit pricing tiers
- Feature lists
- Popular/highlight flags
- Division-specific packages

### FAQs (`/admin/faqs`)
- Manage FAQ items
- Category organization
- Display order

### Devis (`/admin/devis`)
- View all generated quotes
- Filter by client, division, date
- Download as PDF
- Send via email

### Newsletter (`/admin/newsletter`)
- View all subscriptions
- Active/inactive status
- Export email list
- Unsubscribe management

### Content (`/admin/content`)
- Edit home page sections:
  - Hero section
  - Metrics
  - Methodology steps
  - Tech stack
  - Why us items
  - Team teaser
  - Blog section

### Settings (`/admin/settings`)
- Site name & description
- Footer links
- Social media links
- SEO settings
- Feature toggles

### Analytics (`/admin/analytics`)
- Traffic overview
- Page performance
- Lead analytics
- Content performance
- Export reports

## Common Actions

### CRUD Operations
All content types support:
- **Create**: Add new items via forms
- **Read**: View in list and detail views
- **Update**: Edit existing items
- **Delete**: Remove items (with confirmation)

### Filtering & Search
Most list views support:
- Text search
- Filter by division/status/category
- Date range filtering
- Sorting options

### Bulk Actions
Available where applicable:
- Bulk delete
- Bulk status update
- Export to CSV/Excel

## Data Types Managed

1. **Projects** - Portfolio items
2. **Leads** - Customer inquiries
3. **Blog Posts** - Blog content
4. **Team Members** - Team profiles
5. **Testimonials** - Client reviews
6. **Pricing Packages** - Service pricing
7. **FAQs** - Frequently asked questions
8. **Devis** - Generated quotes
9. **Newsletter Subscriptions** - Email list
10. **Home Page Content** - Dynamic homepage
11. **Site Settings** - Configuration
12. **Search Queries** - Search analytics
13. **Chat History** - Chat conversations
14. **Quiz Results** - Quiz completions

## API Endpoints

All endpoints are available in `services/apiService.ts`:

- `apiService.projects.*`
- `apiService.leads.*`
- `apiService.blogPosts.*`
- `apiService.teamMembers.*`
- `apiService.testimonials.*`
- `apiService.pricingPackages.*`
- `apiService.faqs.*`
- `apiService.devis.*`
- `apiService.newsletter.*`
- `apiService.homePageContent.*`
- `apiService.siteSettings.*`
- `apiService.search.*`
- `apiService.chat.*`
- `apiService.quiz.*`

## Implementation Checklist

### Phase 1: Core (Priority 1)
- [ ] Dashboard with metrics
- [ ] Projects CRUD
- [ ] Leads management
- [ ] Blog Posts CRUD

### Phase 2: Content (Priority 1)
- [ ] Team Members CRUD
- [ ] Testimonials CRUD
- [ ] Pricing Packages CRUD
- [ ] FAQs CRUD
- [ ] Home Page Content Editor

### Phase 3: Advanced (Priority 2)
- [ ] Devis management
- [ ] Newsletter subscriptions
- [ ] Site Settings
- [ ] Search Analytics
- [ ] Chat History

### Phase 4: Analytics (Priority 2)
- [ ] Analytics Dashboard
- [ ] Reports & Exports

### Phase 5: Users (Priority 3)
- [ ] User Management
- [ ] Role-based Permissions

## UI Components Needed

### Reusable Components
- `AdminLayout` - Main layout with sidebar
- `AdminSidebar` - Navigation menu
- `AdminHeader` - Top header
- `DataTable` - Reusable table
- `FormField` - Form input wrapper
- `ImageUploader` - Image upload
- `RichTextEditor` - WYSIWYG editor
- `StatusBadge` - Status indicator
- `FilterBar` - Search/filter bar
- `Pagination` - Page navigation
- `ConfirmDialog` - Confirmation modal
- `StatsCard` - Metric card
- `Chart` - Data visualization

## Key Features

### AI Integration
- Auto-generate project descriptions (Gemini)
- Chat assistant for visitors
- Content suggestions

### Media Management
- Image uploads
- Image gallery
- Video embeds
- File management

### SEO Tools
- Meta titles
- Meta descriptions
- Custom slugs
- Keywords management

### Export Options
- CSV export
- Excel export
- PDF generation (for devis)
- Data backup

## Quick Start

1. **Authentication**: Login at `/admin/login`
2. **Dashboard**: View overview at `/admin/dashboard`
3. **Content**: Start managing content via sidebar navigation
4. **Settings**: Configure site at `/admin/settings`

## Notes

- All routes are protected (require authentication)
- Mock data is currently used (ready for real API)
- Responsive design for mobile/tablet/desktop
- Dark theme with division color accents
- TypeScript for type safety

For complete implementation details, see [ADMIN_BACKOFFICE_SPECIFICATION.md](./ADMIN_BACKOFFICE_SPECIFICATION.md).

