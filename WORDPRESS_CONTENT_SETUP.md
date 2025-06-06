# WordPress Content Setup for Headless CMS

## Understanding the Architecture

Your React app (`https://h2s82zsfzj2lh45zd5axee1dx.js.wpenginepowered.com/`) is the **frontend** that users see.
Your WordPress site (`https://fitness4.wpenginepowered.com/`) is the **backend CMS** where you manage content.

## Step 1: Create WordPress Pages

You need to create these pages in your WordPress admin:

### 1. Homepage Content
1. Go to WordPress Admin → **Pages → Add New**
2. **Title**: "Homepage"
3. **Slug**: "home" (very important!)
4. **Content**: You can leave this blank or add a note like "Homepage content managed via ACF fields"
5. **Publish** the page

### 2. About Page Content
1. Go to WordPress Admin → **Pages → Add New**
2. **Title**: "About"
3. **Slug**: "about" (very important!)
4. **Content**: You can leave this blank or add a note like "About page content managed via ACF fields"
5. **Publish** the page

### 3. Contact Page Content
1. Go to WordPress Admin → **Pages → Add New**
2. **Title**: "Contact"
3. **Slug**: "contact" (very important!)
4. **Content**: You can leave this blank or add a note like "Contact page content managed via ACF fields"
5. **Publish** the page

## Step 2: Install Required Plugins

### Advanced Custom Fields Pro
1. Purchase and download ACF Pro from https://www.advancedcustomfields.com/
2. Install and activate the plugin
3. Go to **Custom Fields → Settings**
4. Enable **REST API** support

## Step 3: Create ACF Field Groups

Follow the detailed instructions in `ACF_SETUP_GUIDE.md` to create field groups for:
- Homepage Content
- About Page Content  
- Contact Page Content

## Step 4: Populate Content

Once you've created the pages and ACF field groups:

1. Go to **Pages** in WordPress admin
2. Edit the "Homepage" page
3. You'll see the ACF fields at the bottom
4. Fill in all the content fields
5. Repeat for About and Contact pages

## Step 5: Fix CORS Issues

The React app needs to access WordPress via API. Add this to your WordPress theme's `functions.php`:

```php
// Enable CORS for headless WordPress
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: https://h2s82zsfzj2lh45zd5axee1dx.js.wpenginepowered.com");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init','add_cors_http_header');

// Handle preflight requests
function handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: https://h2s82zsfzj2lh45zd5axee1dx.js.wpenginepowered.com");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        exit(0);
    }
}
add_action('init', 'handle_preflight');
```

## Step 6: Test the API

After setup, test these URLs in your browser:

```
https://fitness4.wpenginepowered.com/wp-json/wp/v2/pages?slug=home
https://fitness4.wpenginepowered.com/wp-json/wp/v2/pages?slug=about
https://fitness4.wpenginepowered.com/wp-json/wp/v2/pages?slug=contact
```

You should see JSON data with your ACF fields.

## How Content Management Works

### For Content Editors:
1. **Log into WordPress** at `https://fitness4.wpenginepowered.com/wp-admin`
2. **Edit Pages** → Choose Homepage, About, or Contact
3. **Update ACF fields** with new content
4. **Publish changes**
5. **React app automatically updates** (may take a few minutes due to caching)

### What Gets Managed in WordPress:
- ✅ Homepage hero text, buttons, features
- ✅ About page content, values, team info
- ✅ Contact page info, FAQs
- ✅ Blog posts and categories
- ✅ Images and media

### What Stays in React Code:
- ✅ App functionality (workout tracker, login, etc.)
- ✅ Styling and layout
- ✅ Interactive features
- ✅ Fallback content (when WordPress is unavailable)

## Example: Editing Homepage Content

1. Go to WordPress Admin → **Pages** → **Edit "Homepage"**
2. Scroll down to **Homepage Content** fields
3. Update **Hero Title**: "🏆 New Warrior Kid Fitness Tracker"
4. Update **Hero Subtitle**: "Your new subtitle here"
5. Update **CTA Button Text**: "🚀 Start Your Journey"
6. **Update** the page
7. Visit your React app - changes appear automatically!

## Troubleshooting

### If content doesn't update:
1. Check WordPress page slugs are correct (home, about, contact)
2. Verify ACF fields are filled in
3. Test API endpoints directly
4. Check browser console for CORS errors
5. Clear any caching

### If API returns errors:
1. Ensure WordPress REST API is enabled
2. Check permalink settings in WordPress
3. Verify CORS headers are added
4. Contact WP Engine support if needed

## Benefits of This Setup

✅ **Easy Content Management**: Non-technical users can update content
✅ **Professional Workflow**: Separate concerns (content vs. functionality)
✅ **Scalable**: Easy to add new pages and content types
✅ **Reliable**: React app works even if WordPress is down
✅ **SEO Friendly**: Content can be managed for optimal SEO
✅ **Version Control**: WordPress handles content versioning

This is the standard approach for headless WordPress and gives you the best of both worlds!
