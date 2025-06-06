# WordPress Plugin Installation Guide

## Quick Setup Instructions

### Step 1: Upload the Plugin

1. **Download the plugin file**: `warrior-kid-custom-post-types.php` from your project folder
2. **Go to your WordPress admin**: https://fitness4.wpenginepowered.com/wp-admin/
3. **Navigate to**: Plugins → Add New → Upload Plugin
4. **Upload**: `warrior-kid-custom-post-types.php`
5. **Activate** the plugin

### Step 2: Install Advanced Custom Fields (ACF) Plugin

1. **Go to**: Plugins → Add New
2. **Search for**: "Advanced Custom Fields"
3. **Install and Activate** the free version by Elliot Condon

### Step 3: Import ACF Field Groups (EASY METHOD!)

Instead of manually creating each field, you can import all field groups at once:

1. **Download the ACF export file**: `acf-field-groups-export.json` from your project folder
2. **Go to**: Custom Fields → Tools → Import Field Groups
3. **Choose File**: Select `acf-field-groups-export.json`
4. **Click Import**: This will create all 4 field groups automatically!

**What gets imported:**
- ✅ **Warrior User Fields** (name, age, password, total_screen_time, created_at, last_login)
- ✅ **Workout Session Fields** (user_id, session_date, exercises_completed, total_duration, screen_time_earned, completed_at)
- ✅ **Screen Time Log Fields** (user_id, action_type, minutes, source, timestamp)
- ✅ **Progress Entry Fields** (user_id, exercise_type, value, date, notes)

All fields are pre-configured with:
- Correct field types and validation
- Required field settings
- Location rules for each post type
- REST API enabled for all field groups

### Step 4: Verify Installation

1. **Check Admin Menu**: You should see new menu items:
   - Warrior Users
   - Workout Sessions
   - Screen Time Logs
   - Progress Entries

2. **Test API Endpoints**: Visit these URLs in your browser:
   - `https://fitness4.wpenginepowered.com/wp-json/wp/v2/warrior-users`
   - `https://fitness4.wpenginepowered.com/wp-json/warrior-kid/v1/user/create`

### Step 5: Test Your React App

After completing the WordPress setup, your React app should be able to:
- Create new warrior users
- Save workout sessions
- Track screen time
- Log progress entries

## Custom API Endpoints Created

The plugin creates these custom endpoints:

### User Management
- `GET /wp-json/warrior-kid/v1/user/{name}` - Get user by name (login)
- `POST /wp-json/warrior-kid/v1/user/create` - Create new user
- `GET /wp-json/warrior-kid/v1/user/{id}/stats` - Get user statistics

### Data Logging
- `POST /wp-json/warrior-kid/v1/workout/save` - Save workout session
- `POST /wp-json/warrior-kid/v1/screentime/log` - Log screen time
- `POST /wp-json/warrior-kid/v1/progress/save` - Save progress entry

## Troubleshooting

### If you get 404 errors:
1. Go to Settings → Permalinks
2. Click "Save Changes" to flush rewrite rules

### If CORS errors persist:
1. Check that the plugin is activated
2. Verify your site URL in the React app's .env file

### If ACF fields don't appear in API:
1. Make sure "Show in REST API" is enabled for each field group
2. Re-save the field groups

## Next Steps

Once WordPress is set up, you can:
1. Update your React app to use WordPress API instead of localStorage
2. Test user registration and login
3. Verify workout data is being saved to WordPress
4. Set up user authentication if needed

Your Warrior Kid Fitness Tracker will then have a robust, scalable backend powered by WordPress!
