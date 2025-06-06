# WordPress Exercise Management Setup Guide

## Overview

This guide will help you set up the WordPress Exercise Management system for the Warrior Kid Fitness Tracker. This system allows you to easily manage workout exercises through WordPress admin instead of hardcoded data in the React app.

## What You'll Get

✅ **WordPress Admin Interface** for managing exercises
✅ **Exercise CRUD Operations** (Create, Read, Update, Delete)
✅ **Workout Program Management** with exercise selection
✅ **Real-time Exercise Updates** in the React app
✅ **Fallback Support** - app works even if WordPress is offline
✅ **Exercise Statistics** and analytics
✅ **Advanced Exercise Properties** (difficulty, category, rest time, etc.)

## Prerequisites

- WordPress site with admin access
- Advanced Custom Fields (ACF) Pro plugin
- WordPress REST API enabled (default in modern WordPress)

## Step 1: Install the WordPress Plugin

1. **Upload the Plugin File**
   - Copy `warrior-kid-exercise-management.php` to your WordPress site
   - Upload it to `/wp-content/plugins/warrior-kid-exercise-management/`
   - Or upload via WordPress admin: Plugins > Add New > Upload Plugin

2. **Activate the Plugin**
   - Go to WordPress Admin > Plugins
   - Find "Warrior Kid Exercise Management"
   - Click "Activate"

## Step 2: Install Required Dependencies

1. **Install ACF Pro**
   - Purchase and download ACF Pro from advancedcustomfields.com
   - Install via WordPress admin: Plugins > Add New > Upload Plugin
   - Activate the plugin

2. **Verify REST API**
   - Test your REST API: `https://yoursite.com/wp-json/wp/v2/`
   - Should return JSON (not HTML)
   - If returning HTML, check your permalink settings

## Step 3: Configure WordPress

1. **Set Permalink Structure**
   - Go to Settings > Permalinks
   - Select "Post name" or custom structure
   - Click "Save Changes"

2. **Verify Custom Post Types**
   - After activating the plugin, you should see:
     - "Exercises" menu item in WordPress admin
     - "Workout Programs" menu item in WordPress admin

## Step 4: Import Default Exercises

1. **Access Migration Tools**
   - Go to WordPress Admin > Exercises > Migration Tools
   - Click "Import Default Exercises"
   - This creates all 8 default exercises from your React app

2. **Verify Import**
   - Go to Exercises > All Exercises
   - You should see 8 exercises (Push-ups, Superman Pose, etc.)
   - Each exercise should have all fields populated

## Step 5: Configure React App

1. **Update Environment Variables**
   ```env
   REACT_APP_WORDPRESS_API_URL=https://yoursite.com/wp-json/wp/v2
   ```

2. **Initialize Exercise Service**
   - The app will automatically detect and use WordPress exercises
   - Fallback to local exercises if WordPress is unavailable

## Step 6: Test the Integration

1. **Test WordPress Admin**
   - Create a new exercise in WordPress admin
   - Edit an existing exercise
   - Verify all fields save correctly

2. **Test React App**
   - Start your React app
   - Go to Admin Panel > Exercise Manager tab
   - Verify connection status shows "WordPress Connected"
   - Test creating/editing exercises through the React interface

3. **Test Workout Session**
   - Start a workout in the React app
   - Verify exercises load from WordPress
   - Check that any changes in WordPress appear in the app

## WordPress Admin Interface

### Managing Exercises

1. **Add New Exercise**
   - Go to Exercises > Add New
   - Fill in all required fields:
     - Exercise Name (required)
     - Exercise Avatar (emoji)
     - Exercise Type (reps/time/sets)
     - Target Value (number)
     - Instructions (required)
     - Video URL (optional)
     - Difficulty Level
     - Category
     - Rest Time After
     - Display Order

2. **Edit Existing Exercise**
   - Go to Exercises > All Exercises
   - Click on exercise title to edit
   - Make changes and click "Update"

3. **Exercise Fields Explained**
   - **Avatar**: Emoji displayed in the app (e.g., 💪, 🦸‍♂️)
   - **Type**: How the exercise is measured
     - `reps`: Count-based (e.g., 10 push-ups)
     - `time`: Duration-based (e.g., 30 seconds)
     - `sets`: Multiple rounds (e.g., 3 sets of pull-ups)
   - **Target Value**: The goal number for the exercise
   - **Unit Label**: Display text (e.g., "reps", "seconds")
   - **Special Tracking**: Enable for exercises like pull-ups that need progress tracking
   - **Rest Time**: Seconds of rest after this exercise
   - **Screen Time Bonus**: Extra screen time minutes for completing
   - **Display Order**: Order in workout (lower numbers first)

### Managing Workout Programs

1. **Create Workout Program**
   - Go to Workout Programs > Add New
   - Set program name and description
   - Select exercises using the relationship field
   - Set total rounds, difficulty, duration
   - Choose target age groups
   - Mark as active/inactive

2. **Program Fields**
   - **Exercises**: Select from available exercises
   - **Total Rounds**: How many times to repeat the exercise set
   - **Difficulty**: Beginner/Intermediate/Advanced
   - **Estimated Duration**: Time to complete in minutes
   - **Age Groups**: Target age ranges
   - **Program Active**: Whether available in the app

## React App Features

### Admin Panel - Exercise Manager Tab

1. **Connection Status**
   - Shows WordPress connection status
   - Displays exercise count and last sync time
   - Source indicator (WordPress vs Local)

2. **Exercise Statistics**
   - Total exercise count
   - Breakdown by type, difficulty, category
   - Visual statistics cards

3. **Exercise Management**
   - View all exercises in card layout
   - Edit exercises with full form interface
   - Delete exercises (with confirmation)
   - Create new exercises
   - Real-time updates

4. **Exercise Form Fields**
   - All WordPress fields available
   - Form validation
   - Preview of exercise data
   - Save/cancel options

### Workout Session Integration

1. **Dynamic Exercise Loading**
   - Exercises load from WordPress on app start
   - Loading states while fetching
   - Error handling for connection issues
   - Automatic fallback to local exercises

2. **Real-time Updates**
   - Exercise changes in WordPress appear immediately
   - Cache refresh every 5 minutes
   - Manual refresh option in admin panel

## Troubleshooting

### WordPress Connection Issues

1. **REST API Not Working**
   ```bash
   # Test your REST API
   curl "https://yoursite.com/wp-json/wp/v2/"
   ```
   - Should return JSON, not HTML
   - If HTML, check permalink settings
   - Verify no security plugins blocking REST API

2. **Custom Post Types Not Showing**
   - Verify plugin is activated
   - Check for PHP errors in WordPress
   - Ensure ACF Pro is installed and activated

3. **Fields Not Saving**
   - Verify ACF Pro is properly installed
   - Check field group configuration
   - Look for JavaScript errors in browser console

### React App Issues

1. **Exercises Not Loading**
   - Check browser console for API errors
   - Verify REACT_APP_WORDPRESS_API_URL is correct
   - Test WordPress API directly in browser

2. **Connection Shows Disconnected**
   - Verify WordPress site is accessible
   - Check for CORS issues
   - Ensure REST API endpoints are working

3. **Changes Not Appearing**
   - Check cache timeout (5 minutes default)
   - Use manual refresh in admin panel
   - Verify exercises are published in WordPress

### Common Error Messages

1. **"WordPress connection required to save exercises"**
   - WordPress API is not accessible
   - Check your REACT_APP_WORDPRESS_API_URL
   - Verify WordPress site is online

2. **"Error loading exercises from WordPress"**
   - API endpoint not found
   - Custom post types not registered
   - Plugin not activated

3. **"No exercises found in WordPress"**
   - Run the migration tool to import default exercises
   - Create exercises manually in WordPress admin
   - Check if exercises are published

## Advanced Configuration

### Custom Exercise Types

To add new exercise types beyond reps/time/sets:

1. **Update WordPress Plugin**
   ```php
   // In warrior-kid-exercise-management.php
   'choices' => array(
       'reps' => 'Repetitions (count)',
       'time' => 'Time (seconds)',
       'sets' => 'Sets (multiple rounds)',
       'distance' => 'Distance (meters)', // Add new type
   ),
   ```

2. **Update React App**
   ```javascript
   // In ExerciseManager.js form options
   <option value="distance">Distance</option>
   ```

### Custom Categories

Add new exercise categories:

1. **WordPress Plugin**
   ```php
   'choices' => array(
       'upper_body' => 'Upper Body',
       'core' => 'Core',
       'cardio' => 'Cardio',
       'flexibility' => 'Flexibility',
       'full_body' => 'Full Body',
       'balance' => 'Balance', // Add new category
   ),
   ```

2. **React App**
   ```javascript
   <option value="balance">Balance</option>
   ```

### API Customization

To modify API endpoints or add custom fields:

1. **Custom REST Fields**
   ```php
   // Add to register_rest_fields() function
   register_rest_field('warrior_exercises', 'custom_field', array(
       'get_callback' => function($post) {
           return get_field('custom_field', $post['id']);
       },
   ));
   ```

2. **React Integration**
   ```javascript
   // Update transformExerciseData() in wordpressExerciseAPI.js
   customField: wpExercise.custom_field || '',
   ```

## Security Considerations

1. **User Permissions**
   - Only administrators can manage exercises by default
   - Customize capabilities if needed for other user roles

2. **REST API Security**
   - WordPress REST API is read-only for exercises
   - Write operations require authentication
   - Consider adding nonce verification for extra security

3. **Data Validation**
   - All form inputs are validated in React
   - WordPress ACF provides server-side validation
   - Sanitization handled by WordPress core

## Performance Optimization

1. **Caching**
   - Exercise data cached for 5 minutes in React app
   - WordPress object caching recommended
   - Consider CDN for API responses

2. **Database Optimization**
   - Index custom fields for better query performance
   - Regular database cleanup
   - Monitor query performance

## Backup and Migration

1. **Exercise Data Backup**
   - Use WordPress export tools
   - ACF includes custom fields in exports
   - Regular database backups recommended

2. **Migration Between Sites**
   - Export exercises from WordPress admin
   - Import on new site
   - Update REACT_APP_WORDPRESS_API_URL

## Support and Maintenance

1. **Regular Updates**
   - Keep ACF Pro updated
   - Monitor WordPress core updates
   - Test after any plugin updates

2. **Monitoring**
   - Check WordPress error logs
   - Monitor API response times
   - Track exercise usage analytics

3. **Documentation**
   - Keep this guide updated with any customizations
   - Document any custom fields or modifications
   - Maintain changelog for plugin updates

## Conclusion

The WordPress Exercise Management system provides a powerful, user-friendly way to manage workout exercises without requiring code changes. The hybrid approach ensures your app remains functional even if WordPress is temporarily unavailable, while providing the flexibility and ease of use that comes with WordPress content management.

For additional support or customization needs, refer to the WordPress and ACF documentation, or consult with a WordPress developer familiar with custom post types and REST API integration.
