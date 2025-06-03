# Advanced Custom Fields (ACF) Setup Guide

This guide outlines the ACF field groups that need to be created in WordPress to support the headless React frontend.

## Prerequisites

1. Install ACF Pro plugin in WordPress
2. Ensure ACF fields are exposed to REST API (ACF Pro feature)

## Field Groups to Create

### 1. Homepage Fields

**Field Group Name:** Homepage Content
**Location Rules:** Page Template = Homepage OR Page Slug = home

#### Fields:

**Hero Section:**
- `hero_title` (Text) - Main hero title
- `hero_subtitle` (Textarea) - Hero subtitle/description
- `hero_primary_button_text` (Text) - Primary CTA button text
- `hero_primary_button_link` (Text) - Primary CTA button link
- `hero_secondary_button_text` (Text) - Secondary button text
- `hero_secondary_button_link` (Text) - Secondary button link

**How It Works Section:**
- `how_it_works_title` (Text) - Section title
- `how_it_works_features` (Repeater) - Feature cards
  - `icon` (Text) - Emoji or icon
  - `title` (Text) - Feature title
  - `description` (Textarea) - Feature description
  - `color` (Select) - Border color (navy-blue, forest-green, amber-orange, success-green)

**Call to Action Section:**
- `cta_title` (Text) - CTA section title
- `cta_description` (Textarea) - CTA description
- `cta_button_text` (Text) - CTA button text
- `cta_button_link` (Text) - CTA button link

---

### 2. About Page Fields

**Field Group Name:** About Page Content
**Location Rules:** Page Template = About OR Page Slug = about

#### Fields:

**Hero Section:**
- `hero_title` (Text) - Page title
- `hero_subtitle` (Textarea) - Hero subtitle

**Main Content:**
- `mission_statement` (Wysiwyg Editor) - Main mission/about content

**Core Values Section:**
- `values_title` (Text) - Values section title
- `core_values` (Repeater) - Value cards
  - `icon` (Text) - Emoji or icon
  - `title` (Text) - Value title
  - `description` (Textarea) - Value description
  - `color` (Select) - Border color (navy-blue, forest-green, amber-orange, success-green)

**Call to Action Section:**
- `cta_title` (Text) - CTA section title
- `cta_description` (Textarea) - CTA description
- `cta_primary_button_text` (Text) - Primary button text
- `cta_primary_button_link` (Text) - Primary button link
- `cta_secondary_button_text` (Text) - Secondary button text
- `cta_secondary_button_link` (Text) - Secondary button link

---

### 3. Contact Page Fields

**Field Group Name:** Contact Page Content
**Location Rules:** Page Template = Contact OR Page Slug = contact

#### Fields:

**Hero Section:**
- `hero_title` (Text) - Page title
- `hero_subtitle` (Textarea) - Hero subtitle

**Contact Information:**
- `contact_intro` (Wysiwyg Editor) - Introduction text
- `response_time` (Text) - Email response time
- `contact_topics` (Repeater) - Best topics for contact
  - `topic` (Text) - Topic name

**FAQ Section:**
- `faq_title` (Text) - FAQ section title
- `faqs` (Repeater) - FAQ items
  - `question` (Text) - FAQ question
  - `answer` (Textarea) - FAQ answer

---

### 4. Homepage Dynamic Content (Optional Enhancement)

**Field Group Name:** Homepage Dynamic Sections
**Location Rules:** Page Template = Homepage OR Page Slug = home

#### Additional Fields for Future Enhancement:

**Statistics Section:**
- `show_stats_section` (True/False) - Show/hide stats
- `stats_title` (Text) - Stats section title
- `statistics` (Repeater) - Stat items
  - `number` (Text) - Statistic number
  - `label` (Text) - Statistic label
  - `icon` (Text) - Emoji or icon

**Testimonials Section:**
- `show_testimonials` (True/False) - Show/hide testimonials
- `testimonials_title` (Text) - Testimonials section title
- `testimonials` (Repeater) - Testimonial items
  - `quote` (Textarea) - Testimonial quote
  - `author_name` (Text) - Author name
  - `author_age` (Number) - Author age
  - `author_photo` (Image) - Author photo

---

## WordPress Pages to Create

Create the following pages in WordPress and populate them with ACF fields:

1. **Homepage** (slug: `home`)
2. **About** (slug: `about`)
3. **Contact** (slug: `contact`)

## ACF REST API Settings

Ensure the following settings are configured in ACF:

1. **Field Groups → [Each Field Group] → Settings:**
   - Show in REST API: Yes
   - REST API format: Standard

2. **ACF Options → REST API:**
   - Enable ACF to REST API: Yes

## Sample Content Structure

### Homepage ACF Data Example:
```json
{
  "acf": {
    "hero_title": "🏆 Warrior Kid Fitness Tracker",
    "hero_subtitle": "Build discipline, strength, and character through fun fitness challenges designed for young warriors aged 5-18.",
    "hero_primary_button_text": "🚀 Start Training Now",
    "hero_primary_button_link": "/app",
    "hero_secondary_button_text": "Learn More",
    "hero_secondary_button_link": "/about",
    "how_it_works_title": "How It Works",
    "how_it_works_features": [
      {
        "icon": "🎯",
        "title": "Simple Login",
        "description": "Kids create their warrior profile with just a name and age. A fun math challenge keeps it secure and engaging.",
        "color": "navy-blue"
      },
      {
        "icon": "💪",
        "title": "Fun Workouts",
        "description": "Complete 3 rounds of bodyweight exercises with animated guides, timers, and motivational celebrations.",
        "color": "forest-green"
      },
      {
        "icon": "🏆",
        "title": "Earn Rewards",
        "description": "Earn screen time, track progress, compete on leaderboards, and watch your warrior character grow stronger.",
        "color": "amber-orange"
      }
    ],
    "cta_title": "Ready to Start Your Warrior Journey?",
    "cta_description": "Join thousands of young warriors building discipline, strength, and character through fitness.",
    "cta_button_text": "🚀 Begin Training",
    "cta_button_link": "/app"
  }
}
```

## Implementation Notes

1. **Field Names:** Use snake_case for field names to match JavaScript conventions
2. **Color Values:** Use CSS variable names (navy-blue, forest-green, etc.) for consistency
3. **Links:** Store relative paths (/app, /about) for internal links
4. **Icons:** Store emoji characters directly in text fields for simplicity
5. **Repeater Fields:** Ensure minimum and maximum values are set appropriately

## Testing

After setting up ACF fields:

1. Create test pages with sample content
2. Test API endpoints:
   - `GET /wp-json/wp/v2/pages?slug=home`
   - `GET /wp-json/wp/v2/pages?slug=about`
   - `GET /wp-json/wp/v2/pages?slug=contact`
3. Verify ACF fields appear in the `acf` object in API responses
4. Test React components with real WordPress data

## Troubleshooting

**ACF fields not appearing in REST API:**
- Verify ACF Pro is installed and activated
- Check field group REST API settings
- Ensure fields are published and assigned to correct pages

**Empty ACF data:**
- Verify pages exist with correct slugs
- Check that ACF fields have been populated with content
- Confirm field group location rules are correctly configured
