# WordPress REST API Troubleshooting Guide

## Current Issue

The WordPress REST API at `https://fitness4.wpenginepowered.com/wp-json/wp/v2/` is returning HTML instead of JSON, which means the REST API is not properly accessible.

## Quick Diagnosis

When testing the API endpoint, we get HTML content instead of JSON:
```bash
curl "https://fitness4.wpenginepowered.com/wp-json/wp/v2/"
# Returns HTML instead of JSON
```

## Possible Causes & Solutions

### 1. **WordPress REST API Not Enabled**
The REST API might be disabled by a plugin or theme.

**Solution:**
- Log into WordPress admin
- Go to **Settings > Permalinks**
- Click "Save Changes" (this refreshes the rewrite rules)
- Test the API again

### 2. **Permalink Structure Issues**
WP Engine sites sometimes have permalink issues.

**Solution:**
- In WordPress admin, go to **Settings > Permalinks**
- Select "Post name" or "Custom Structure: /%postname%/"
- Click "Save Changes"

### 3. **Security Plugin Blocking REST API**
Security plugins often block REST API access.

**Solution:**
- Check if you have security plugins like:
  - Wordfence
  - iThemes Security
  - All In One WP Security
- Look for REST API blocking settings and whitelist the endpoints

### 4. **WP Engine Specific Issues**
WP Engine has specific configurations that might affect REST API.

**Solution:**
- Contact WP Engine support
- Ask them to verify REST API is enabled
- Check if there are any server-level restrictions

### 5. **Plugin Conflicts**
A plugin might be interfering with the REST API.

**Solution:**
- Deactivate all plugins temporarily
- Test the REST API
- If it works, reactivate plugins one by one to find the culprit

## Testing the REST API

### Basic API Test:
```bash
curl -H "Accept: application/json" "https://fitness4.wpenginepowered.com/wp-json/wp/v2/"
```

### Test Posts Endpoint:
```bash
curl -H "Accept: application/json" "https://fitness4.wpenginepowered.com/wp-json/wp/v2/posts"
```

### Test Pages Endpoint:
```bash
curl -H "Accept: application/json" "https://fitness4.wpenginepowered.com/wp-json/wp/v2/pages"
```

## Expected JSON Response

A working REST API should return JSON like this:
```json
{
  "name": "John Housholder Site",
  "description": "Your SUPER-powered WP Engine Site",
  "url": "https://fitness4.wpenginepowered.com",
  "home": "https://fitness4.wpenginepowered.com",
  "gmt_offset": "0",
  "timezone_string": "",
  "namespaces": [
    "oembed/1.0",
    "wp/v2"
  ]
}
```

## WordPress Setup Steps

Once the REST API is working:

### 1. **Install Required Plugins**
- **Advanced Custom Fields Pro** (required for ACF integration)
- Ensure ACF REST API is enabled in settings

### 2. **Create Pages**
Create these pages in WordPress admin:
- **Home** (slug: `home`)
- **About** (slug: `about`) 
- **Contact** (slug: `contact`)

### 3. **Set Up ACF Field Groups**
Follow the detailed instructions in `ACF_SETUP_GUIDE.md`

### 4. **Test API Endpoints**
After setup, test these endpoints:
```bash
# Test pages
curl "https://fitness4.wpenginepowered.com/wp-json/wp/v2/pages?slug=home"

# Test posts
curl "https://fitness4.wpenginepowered.com/wp-json/wp/v2/posts"
```

## Temporary Workaround

Until the WordPress REST API is fixed, the React app will show the default fallback content. This is intentional behavior to ensure the site remains functional.

## Contact WP Engine Support

If the above solutions don't work, contact WP Engine support with:

1. **Issue**: WordPress REST API returning HTML instead of JSON
2. **URL**: `https://fitness4.wpenginepowered.com/wp-json/wp/v2/`
3. **Expected**: JSON response with site information
4. **Actual**: HTML page content

## Next Steps

1. Fix the WordPress REST API access
2. Install ACF Pro plugin
3. Create the required pages and field groups
4. Test the React app with live WordPress data

The React application is properly configured and will automatically start pulling content from WordPress once the REST API is accessible.
