# ACF Field Groups - Step-by-Step Setup Guide

This guide walks you through creating each ACF field group with exact steps and screenshots references.

## Prerequisites

1. ✅ ACF Pro plugin installed and activated
2. ✅ WordPress pages created (Homepage, About, Contact)
3. ✅ ACF REST API enabled in settings

---

## Field Group 1: Homepage Content

### Step 1: Create New Field Group
1. Go to WordPress Admin → **Custom Fields → Field Groups**
2. Click **"Add New"**
3. **Title**: `Homepage Content`

### Step 2: Add Hero Section Fields

#### Field 1: Hero Title
- Click **"Add Field"**
- **Field Label**: `Hero Title`
- **Field Name**: `hero_title` (auto-generated)
- **Field Type**: `Text`
- **Instructions**: `Main title displayed in the hero section`
- **Required**: `Yes`
- **Default Value**: `🏆 Warrior Kid Fitness Tracker`

#### Field 2: Hero Subtitle
- Click **"Add Field"**
- **Field Label**: `Hero Subtitle`
- **Field Name**: `hero_subtitle`
- **Field Type**: `Textarea`
- **Instructions**: `Subtitle text below the main title`
- **Required**: `Yes`
- **Rows**: `3`
- **Default Value**: `Build discipline, strength, and character through fun fitness challenges designed for young warriors aged 5-18.`

#### Field 3: Hero Primary Button Text
- Click **"Add Field"**
- **Field Label**: `Hero Primary Button Text`
- **Field Name**: `hero_primary_button_text`
- **Field Type**: `Text`
- **Instructions**: `Text for the main call-to-action button`
- **Required**: `Yes`
- **Default Value**: `🚀 Start Training Now`

#### Field 4: Hero Primary Button Link
- Click **"Add Field"**
- **Field Label**: `Hero Primary Button Link`
- **Field Name**: `hero_primary_button_link`
- **Field Type**: `Text`
- **Instructions**: `URL for the main button (use /app for the fitness tracker)`
- **Required**: `Yes`
- **Default Value**: `/app`

#### Field 5: Hero Secondary Button Text
- Click **"Add Field"**
- **Field Label**: `Hero Secondary Button Text`
- **Field Name**: `hero_secondary_button_text`
- **Field Type**: `Text`
- **Instructions**: `Text for the secondary button`
- **Required**: `Yes`
- **Default Value**: `Learn More`

#### Field 6: Hero Secondary Button Link
- Click **"Add Field"**
- **Field Label**: `Hero Secondary Button Link`
- **Field Name**: `hero_secondary_button_link`
- **Field Type**: `Text`
- **Instructions**: `URL for the secondary button`
- **Required**: `Yes`
- **Default Value**: `/about`

### Step 3: Add How It Works Section

#### Field 7: How It Works Title
- Click **"Add Field"**
- **Field Label**: `How It Works Title`
- **Field Name**: `how_it_works_title`
- **Field Type**: `Text`
- **Instructions**: `Title for the How It Works section`
- **Required**: `Yes`
- **Default Value**: `How It Works`

#### Field 8: How It Works Features (Repeater)
- Click **"Add Field"**
- **Field Label**: `How It Works Features`
- **Field Name**: `how_it_works_features`
- **Field Type**: `Repeater`
- **Instructions**: `Feature cards explaining how the app works`
- **Required**: `Yes`
- **Button Label**: `Add Feature`
- **Min**: `3`
- **Max**: `6`

##### Sub-field 1: Icon
- **Field Label**: `Icon`
- **Field Name**: `icon`
- **Field Type**: `Text`
- **Instructions**: `Emoji or icon character`
- **Required**: `Yes`
- **Default Value**: `🎯`

##### Sub-field 2: Title
- **Field Label**: `Title`
- **Field Name**: `title`
- **Field Type**: `Text`
- **Instructions**: `Feature title`
- **Required**: `Yes`
- **Default Value**: `Simple Login`

##### Sub-field 3: Description
- **Field Label**: `Description`
- **Field Name**: `description`
- **Field Type**: `Textarea`
- **Instructions**: `Feature description`
- **Required**: `Yes`
- **Rows**: `3`
- **Default Value**: `Kids create their warrior profile with just a name and age.`

##### Sub-field 4: Color
- **Field Label**: `Color`
- **Field Name**: `color`
- **Field Type**: `Select`
- **Instructions**: `Border color for the feature card`
- **Required**: `Yes`
- **Choices**:
  ```
  navy-blue : Navy Blue
  forest-green : Forest Green
  amber-orange : Amber Orange
  success-green : Success Green
  ```
- **Default Value**: `navy-blue`

### Step 4: Add Call to Action Section

#### Field 9: CTA Title
- Click **"Add Field"**
- **Field Label**: `CTA Title`
- **Field Name**: `cta_title`
- **Field Type**: `Text`
- **Instructions**: `Title for the call-to-action section`
- **Required**: `Yes`
- **Default Value**: `Ready to Start Your Warrior Journey?`

#### Field 10: CTA Description
- Click **"Add Field"**
- **Field Label**: `CTA Description`
- **Field Name**: `cta_description`
- **Field Type**: `Textarea`
- **Instructions**: `Description text for the CTA section`
- **Required**: `Yes`
- **Rows**: `2`
- **Default Value**: `Join thousands of young warriors building discipline, strength, and character through fitness.`

#### Field 11: CTA Button Text
- Click **"Add Field"**
- **Field Label**: `CTA Button Text`
- **Field Name**: `cta_button_text`
- **Field Type**: `Text`
- **Instructions**: `Text for the CTA button`
- **Required**: `Yes`
- **Default Value**: `🚀 Begin Training`

#### Field 12: CTA Button Link
- Click **"Add Field"**
- **Field Label**: `CTA Button Link`
- **Field Name**: `cta_button_link`
- **Field Type**: `Text`
- **Instructions**: `URL for the CTA button`
- **Required**: `Yes`
- **Default Value**: `/app`

### Step 5: Set Location Rules
1. Scroll down to **"Location"**
2. **Rule 1**: 
   - **Show this field group if**: `Page`
   - **is equal to**: `Homepage` (select the page you created)
3. Click **"Add rule group"**
4. **Rule 2**:
   - **Show this field group if**: `Page Template`
   - **is equal to**: `Default Template`
   - **AND Page**: `is equal to`: `Homepage`

### Step 6: Configure Settings
1. Scroll down to **"Settings"**
2. **Order No.**: `0`
3. **Position**: `Normal (after content)`
4. **Style**: `Default (WP metabox)`
5. **Label placement**: `Top aligned`
6. **Instruction placement**: `Label`
7. **Hide on screen**: Leave unchecked
8. **Show in REST API**: `Yes` ⚠️ **VERY IMPORTANT**
9. **REST API format**: `Standard`

### Step 7: Publish
- Click **"Publish"** button

---

## Field Group 2: About Page Content

### Step 1: Create New Field Group
1. Go to **Custom Fields → Field Groups**
2. Click **"Add New"**
3. **Title**: `About Page Content`

### Step 2: Add Fields

#### Field 1: Hero Title
- **Field Label**: `Hero Title`
- **Field Name**: `hero_title`
- **Field Type**: `Text`
- **Required**: `Yes`
- **Default Value**: `About Me`

#### Field 2: Hero Subtitle
- **Field Label**: `Hero Subtitle`
- **Field Name**: `hero_subtitle`
- **Field Type**: `Textarea`
- **Required**: `Yes`
- **Default Value**: `Building the next generation of disciplined, strong, and confident young warriors.`

#### Field 3: Mission Statement
- **Field Label**: `Mission Statement`
- **Field Name**: `mission_statement`
- **Field Type**: `Wysiwyg Editor`
- **Instructions**: `Main content for the about page`
- **Required**: `Yes`
- **Toolbar**: `Full`
- **Media Upload**: `Yes`

#### Field 4: Values Title
- **Field Label**: `Values Title`
- **Field Name**: `values_title`
- **Field Type**: `Text`
- **Required**: `Yes`
- **Default Value**: `Core Values`

#### Field 5: Core Values (Repeater)
- **Field Label**: `Core Values`
- **Field Name**: `core_values`
- **Field Type**: `Repeater`
- **Button Label**: `Add Value`
- **Min**: `3`
- **Max**: `6`

##### Sub-fields for Core Values:
1. **Icon** (Text) - Default: `💪`
2. **Title** (Text) - Default: `Discipline`
3. **Description** (Textarea) - Default: `Building consistent habits and mental toughness.`
4. **Color** (Select) - Same choices as homepage

#### Field 6: CTA Title
- **Field Label**: `CTA Title`
- **Field Name**: `cta_title`
- **Field Type**: `Text`
- **Default Value**: `Ready to Join the Mission?`

#### Field 7: CTA Description
- **Field Label**: `CTA Description`
- **Field Name**: `cta_description`
- **Field Type**: `Textarea`
- **Default Value**: `Start your warrior journey today and build the discipline that will serve you for life.`

#### Field 8: CTA Primary Button Text
- **Field Label**: `CTA Primary Button Text`
- **Field Name**: `cta_primary_button_text`
- **Field Type**: `Text`
- **Default Value**: `🚀 Start Training`

#### Field 9: CTA Primary Button Link
- **Field Label**: `CTA Primary Button Link`
- **Field Name**: `cta_primary_button_link`
- **Field Type**: `Text`
- **Default Value**: `/app`

#### Field 10: CTA Secondary Button Text
- **Field Label**: `CTA Secondary Button Text`
- **Field Name**: `cta_secondary_button_text`
- **Field Type**: `Text`
- **Default Value**: `Get in Touch`

#### Field 11: CTA Secondary Button Link
- **Field Label**: `CTA Secondary Button Link`
- **Field Name**: `cta_secondary_button_link`
- **Field Type**: `Text`
- **Default Value**: `/contact`

### Step 3: Set Location Rules
- **Show this field group if**: `Page` **is equal to**: `About`

### Step 4: Configure Settings
- **Show in REST API**: `Yes` ⚠️ **VERY IMPORTANT**
- **REST API format**: `Standard`

### Step 5: Publish

---

## Field Group 3: Contact Page Content

### Step 1: Create New Field Group
1. **Title**: `Contact Page Content`

### Step 2: Add Fields

#### Field 1: Hero Title
- **Field Label**: `Hero Title`
- **Field Name**: `hero_title`
- **Field Type**: `Text`
- **Default Value**: `Contact Me`

#### Field 2: Hero Subtitle
- **Field Label**: `Hero Subtitle`
- **Field Name**: `hero_subtitle`
- **Field Type**: `Textarea`
- **Default Value**: `Let's connect and build stronger warriors together!`

#### Field 3: Contact Intro
- **Field Label**: `Contact Intro`
- **Field Name**: `contact_intro`
- **Field Type**: `Wysiwyg Editor`
- **Instructions**: `Introduction text for the contact page`

#### Field 4: Response Time
- **Field Label**: `Response Time`
- **Field Name**: `response_time`
- **Field Type**: `Text`
- **Default Value**: `Usually within 24 hours`

#### Field 5: Contact Topics (Repeater)
- **Field Label**: `Contact Topics`
- **Field Name**: `contact_topics`
- **Field Type**: `Repeater`
- **Instructions**: `Best topics for contacting you`

##### Sub-field: Topic
- **Field Label**: `Topic`
- **Field Name**: `topic`
- **Field Type**: `Text`
- **Default Value**: `Fitness questions for kids`

#### Field 6: FAQ Title
- **Field Label**: `FAQ Title`
- **Field Name**: `faq_title`
- **Field Type**: `Text`
- **Default Value**: `Frequently Asked Questions`

#### Field 7: FAQs (Repeater)
- **Field Label**: `FAQs`
- **Field Name**: `faqs`
- **Field Type**: `Repeater`

##### Sub-fields for FAQs:
1. **Question** (Text)
2. **Answer** (Textarea)

### Step 3: Set Location Rules
- **Show this field group if**: `Page` **is equal to**: `Contact`

### Step 4: Configure Settings
- **Show in REST API**: `Yes` ⚠️ **VERY IMPORTANT**

### Step 5: Publish

---

## Final Steps

### 1. Verify REST API Settings
1. Go to **Custom Fields → Settings**
2. Ensure **"REST API"** is enabled
3. **Format**: `Standard`

### 2. Test Field Groups
1. Go to **Pages → Edit Homepage**
2. Scroll down - you should see all the Homepage Content fields
3. Fill in some test content
4. **Update** the page

### 3. Test API Endpoint
Visit: `https://fitness4.wpenginepowered.com/wp-json/wp/v2/pages?slug=home`

You should see JSON with an `acf` object containing your fields.

---

## Troubleshooting

### Fields Not Showing
- Check Location Rules are set correctly
- Ensure page slugs match exactly (home, about, contact)
- Verify ACF Pro is activated

### REST API Not Working
- Check **Show in REST API** is enabled for each field group
- Verify ACF REST API is enabled in settings
- Test the endpoint directly in browser

### Content Not Updating in React App
- Check CORS headers are added to WordPress
- Verify API endpoints return JSON (not HTML)
- Clear browser cache

This setup will give you complete content management control over your React app through WordPress!
