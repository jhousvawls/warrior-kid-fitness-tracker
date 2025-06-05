# WordPress Custom Post Types for Warrior Kid Fitness Tracker

This guide shows you how to create custom post types in WordPress to store user data from your React fitness tracker app.

## Overview

We'll create these custom post types:
1. **Warrior Users** - Store user profiles
2. **Workout Sessions** - Store completed workouts
3. **Screen Time Logs** - Track earned/used screen time
4. **Progress Entries** - Store pull-up and other progress data

---

## Step 1: Create Custom Post Types

### Method 1: Using functions.php (Recommended)

Add this code to your WordPress theme's `functions.php` file:

```php
<?php
// Register Custom Post Types for Warrior Kid Fitness Tracker

function register_warrior_kid_post_types() {
    
    // 1. Warrior Users
    register_post_type('warrior_users', array(
        'labels' => array(
            'name' => 'Warrior Users',
            'singular_name' => 'Warrior User',
            'add_new' => 'Add New User',
            'add_new_item' => 'Add New Warrior User',
            'edit_item' => 'Edit Warrior User',
            'new_item' => 'New Warrior User',
            'view_item' => 'View Warrior User',
            'search_items' => 'Search Warrior Users',
            'not_found' => 'No warrior users found',
            'not_found_in_trash' => 'No warrior users found in trash'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true, // Enable REST API
        'rest_base' => 'warrior-users',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-groups',
        'menu_position' => 25
    ));

    // 2. Workout Sessions
    register_post_type('workout_sessions', array(
        'labels' => array(
            'name' => 'Workout Sessions',
            'singular_name' => 'Workout Session',
            'add_new' => 'Add New Session',
            'add_new_item' => 'Add New Workout Session',
            'edit_item' => 'Edit Workout Session',
            'new_item' => 'New Workout Session',
            'view_item' => 'View Workout Session',
            'search_items' => 'Search Workout Sessions',
            'not_found' => 'No workout sessions found',
            'not_found_in_trash' => 'No workout sessions found in trash'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true, // Enable REST API
        'rest_base' => 'workout-sessions',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-heart',
        'menu_position' => 26
    ));

    // 3. Screen Time Logs
    register_post_type('screen_time_logs', array(
        'labels' => array(
            'name' => 'Screen Time Logs',
            'singular_name' => 'Screen Time Log',
            'add_new' => 'Add New Log',
            'add_new_item' => 'Add New Screen Time Log',
            'edit_item' => 'Edit Screen Time Log',
            'new_item' => 'New Screen Time Log',
            'view_item' => 'View Screen Time Log',
            'search_items' => 'Search Screen Time Logs',
            'not_found' => 'No screen time logs found',
            'not_found_in_trash' => 'No screen time logs found in trash'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true, // Enable REST API
        'rest_base' => 'screen-time-logs',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-clock',
        'menu_position' => 27
    ));

    // 4. Progress Entries
    register_post_type('progress_entries', array(
        'labels' => array(
            'name' => 'Progress Entries',
            'singular_name' => 'Progress Entry',
            'add_new' => 'Add New Entry',
            'add_new_item' => 'Add New Progress Entry',
            'edit_item' => 'Edit Progress Entry',
            'new_item' => 'New Progress Entry',
            'view_item' => 'View Progress Entry',
            'search_items' => 'Search Progress Entries',
            'not_found' => 'No progress entries found',
            'not_found_in_trash' => 'No progress entries found in trash'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true, // Enable REST API
        'rest_base' => 'progress-entries',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-chart-line',
        'menu_position' => 28
    ));
}

add_action('init', 'register_warrior_kid_post_types');

// Flush rewrite rules on theme activation
function warrior_kid_flush_rewrite_rules() {
    register_warrior_kid_post_types();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'warrior_kid_flush_rewrite_rules');
?>
```

---

## Step 2: Create ACF Field Groups for Custom Post Types

### Field Group 1: Warrior Users

1. Go to **Custom Fields → Field Groups**
2. Click **"Add New"**
3. **Title**: `Warrior User Fields`

#### Add these fields:

**Field 1: User ID**
- **Field Label**: `User ID`
- **Field Name**: `user_id`
- **Field Type**: `Text`
- **Required**: `Yes`
- **Instructions**: `Unique identifier for the user`

**Field 2: Name**
- **Field Label**: `Name`
- **Field Name**: `name`
- **Field Type**: `Text`
- **Required**: `Yes`

**Field 3: Age**
- **Field Label**: `Age`
- **Field Name**: `age`
- **Field Type**: `Number`
- **Required**: `Yes`
- **Min**: `5`
- **Max**: `18`

**Field 4: Created At**
- **Field Label**: `Created At`
- **Field Name**: `created_at`
- **Field Type**: `Date Time Picker`
- **Required**: `Yes`
- **Return Format**: `Y-m-d H:i:s`

**Field 5: Total Screen Time**
- **Field Label**: `Total Screen Time`
- **Field Name**: `total_screen_time`
- **Field Type**: `Number`
- **Instructions**: `Total screen time in minutes`
- **Default Value**: `0`

**Field 6: Last Login**
- **Field Label**: `Last Login`
- **Field Name**: `last_login`
- **Field Type**: `Date Time Picker`
- **Return Format**: `Y-m-d H:i:s`

#### Location Rules:
- **Show this field group if**: `Post Type` **is equal to**: `warrior_users`

#### Settings:
- **Show in REST API**: `Yes` ⚠️ **VERY IMPORTANT**

---

### Field Group 2: Workout Sessions

1. **Title**: `Workout Session Fields`

#### Add these fields:

**Field 1: User ID**
- **Field Label**: `User ID`
- **Field Name**: `user_id`
- **Field Type**: `Text`
- **Required**: `Yes`

**Field 2: Session Date**
- **Field Label**: `Session Date`
- **Field Name**: `session_date`
- **Field Type**: `Date Picker`
- **Required**: `Yes`
- **Return Format**: `Y-m-d`

**Field 3: Exercises Completed**
- **Field Label**: `Exercises Completed`
- **Field Name**: `exercises_completed`
- **Field Type**: `Repeater`
- **Button Label**: `Add Exercise`

##### Sub-fields for Exercises:
1. **Exercise ID** (Text)
2. **Exercise Name** (Text)
3. **Reps Completed** (Number)
4. **Target Reps** (Number)
5. **Completed** (True/False)

**Field 4: Total Duration**
- **Field Label**: `Total Duration`
- **Field Name**: `total_duration`
- **Field Type**: `Number`
- **Instructions**: `Duration in seconds`

**Field 5: Screen Time Earned**
- **Field Label**: `Screen Time Earned`
- **Field Name**: `screen_time_earned`
- **Field Type**: `Number`
- **Instructions**: `Screen time earned in minutes`
- **Default Value**: `10`

**Field 6: Completed At**
- **Field Label**: `Completed At`
- **Field Name**: `completed_at`
- **Field Type**: `Date Time Picker`
- **Required**: `Yes`

#### Location Rules:
- **Show this field group if**: `Post Type` **is equal to**: `workout_sessions`

#### Settings:
- **Show in REST API**: `Yes`

---

### Field Group 3: Screen Time Logs

1. **Title**: `Screen Time Log Fields`

#### Add these fields:

**Field 1: User ID**
- **Field Label**: `User ID`
- **Field Name**: `user_id`
- **Field Type**: `Text`
- **Required**: `Yes`

**Field 2: Action Type**
- **Field Label**: `Action Type`
- **Field Name**: `action_type`
- **Field Type**: `Select`
- **Required**: `Yes`
- **Choices**:
  ```
  earned : Earned
  used : Used
  ```

**Field 3: Minutes**
- **Field Label**: `Minutes`
- **Field Name**: `minutes`
- **Field Type**: `Number`
- **Required**: `Yes`

**Field 4: Source**
- **Field Label**: `Source`
- **Field Name**: `source`
- **Field Type**: `Text`
- **Instructions**: `What earned/used the screen time (e.g., "workout", "gaming")`

**Field 5: Timestamp**
- **Field Label**: `Timestamp`
- **Field Name**: `timestamp`
- **Field Type**: `Date Time Picker`
- **Required**: `Yes`

#### Location Rules:
- **Show this field group if**: `Post Type` **is equal to**: `screen_time_logs`

#### Settings:
- **Show in REST API**: `Yes`

---

### Field Group 4: Progress Entries

1. **Title**: `Progress Entry Fields`

#### Add these fields:

**Field 1: User ID**
- **Field Label**: `User ID`
- **Field Name**: `user_id`
- **Field Type**: `Text`
- **Required**: `Yes`

**Field 2: Exercise Type**
- **Field Label**: `Exercise Type`
- **Field Name**: `exercise_type`
- **Field Type**: `Select`
- **Required**: `Yes`
- **Choices**:
  ```
  pullups : Pull-ups
  pushups : Push-ups
  squats : Squats
  burpees : Burpees
  plank : Plank
  jumping_jacks : Jumping Jacks
  ```

**Field 3: Value**
- **Field Label**: `Value`
- **Field Name**: `value`
- **Field Type**: `Number`
- **Required**: `Yes`
- **Instructions**: `Reps completed or seconds held`

**Field 4: Date**
- **Field Label**: `Date`
- **Field Name**: `date`
- **Field Type**: `Date Picker`
- **Required**: `Yes`
- **Return Format**: `Y-m-d`

**Field 5: Notes**
- **Field Label**: `Notes`
- **Field Name**: `notes`
- **Field Type**: `Textarea`
- **Instructions**: `Optional notes about the performance`

#### Location Rules:
- **Show this field group if**: `Post Type` **is equal to**: `progress_entries`

#### Settings:
- **Show in REST API**: `Yes`

---

## Step 3: API Endpoints

After creating the custom post types, you'll have these REST API endpoints:

### Warrior Users
- **GET**: `/wp-json/wp/v2/warrior-users`
- **POST**: `/wp-json/wp/v2/warrior-users`
- **GET**: `/wp-json/wp/v2/warrior-users/{id}`
- **PUT**: `/wp-json/wp/v2/warrior-users/{id}`
- **DELETE**: `/wp-json/wp/v2/warrior-users/{id}`

### Workout Sessions
- **GET**: `/wp-json/wp/v2/workout-sessions`
- **POST**: `/wp-json/wp/v2/workout-sessions`
- **GET**: `/wp-json/wp/v2/workout-sessions/{id}`

### Screen Time Logs
- **GET**: `/wp-json/wp/v2/screen-time-logs`
- **POST**: `/wp-json/wp/v2/screen-time-logs`

### Progress Entries
- **GET**: `/wp-json/wp/v2/progress-entries`
- **POST**: `/wp-json/wp/v2/progress-entries`

---

## Step 4: Enable CORS for React App

Add this to your `functions.php`:

```php
// Enable CORS for React app
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init','add_cors_http_header');

// Handle preflight OPTIONS requests
function handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        exit(0);
    }
}
add_action('init', 'handle_preflight');
```

---

## Step 5: Test the Setup

1. **Check Admin Panel**: Go to WordPress admin and verify you see the new post types in the menu
2. **Test API Endpoints**: Visit `https://your-site.com/wp-json/wp/v2/warrior-users` in your browser
3. **Create Test Data**: Add a test warrior user through the WordPress admin
4. **Verify JSON Response**: Check that the API returns the ACF fields in the response

---

## Next Steps

After setting up the custom post types, you'll need to:

1. **Update your React app** to use WordPress API instead of localStorage
2. **Create API service functions** for CRUD operations
3. **Handle authentication** for creating/updating user data
4. **Implement data migration** from localStorage to WordPress

This setup gives you a robust, scalable backend for your Warrior Kid Fitness Tracker while maintaining all the functionality you currently have with localStorage!
