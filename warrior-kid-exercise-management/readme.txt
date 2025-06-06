=== Warrior Kid Exercise Management ===
Contributors: Warrior Kid Fitness Team
Tags: fitness, exercise, workout, custom post types, ACF
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Custom post types and fields for managing workout exercises in the Warrior Kid Fitness Tracker React app.

== Description ==

The Warrior Kid Exercise Management plugin provides a complete WordPress backend for managing workout exercises used in the Warrior Kid Fitness Tracker React application. This plugin allows you to easily create, edit, and organize exercises through the WordPress admin interface without requiring code changes.

= Features =

* **Custom Post Types**: Exercises and Workout Programs
* **Advanced Custom Fields**: 12+ exercise properties including difficulty, category, rest time
* **REST API Integration**: Seamless connection with React app
* **Migration Tools**: Import existing exercises from React app
* **Exercise Management**: Full CRUD operations through WordPress admin
* **Workout Programs**: Create custom workout routines with selected exercises
* **Real-time Updates**: Changes appear immediately in the React app

= Exercise Properties =

* Exercise Name and Avatar (emoji)
* Exercise Type (reps, time, sets)
* Target Values and Unit Labels
* Instructions and Video URLs
* Difficulty Levels (Beginner, Intermediate, Advanced)
* Categories (Upper Body, Core, Cardio, Flexibility, Full Body)
* Rest Time and Screen Time Bonuses
* Display Order and Special Tracking

= Requirements =

* Advanced Custom Fields (ACF) Pro plugin
* WordPress REST API enabled (default)
* React app configured with WordPress API URL

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/warrior-kid-exercise-management/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Ensure ACF Pro is installed and activated
4. Go to Exercises > Migration Tools to import default exercises
5. Configure your React app with the WordPress API URL

== Frequently Asked Questions ==

= Do I need ACF Pro? =

Yes, this plugin requires Advanced Custom Fields Pro to function properly. The plugin uses ACF's advanced field types and REST API integration.

= Will this work with the free ACF plugin? =

No, this plugin specifically requires ACF Pro for the relationship fields and advanced functionality.

= How do I import my existing exercises? =

After activating the plugin, go to Exercises > Migration Tools in your WordPress admin and click "Import Default Exercises". This will create all 8 default exercises from the React app.

= Can I add new exercise types? =

Yes, you can modify the plugin code to add new exercise types beyond reps, time, and sets. See the setup documentation for details.

= What happens if WordPress is offline? =

The React app is designed with fallback support. If WordPress is unavailable, the app will automatically use the hardcoded exercises, ensuring uninterrupted functionality.

== Screenshots ==

1. Exercise management interface in WordPress admin
2. Exercise creation form with all custom fields
3. Workout program management
4. Migration tools for importing exercises
5. React app Exercise Manager integration

== Changelog ==

= 1.0 =
* Initial release
* Custom post types for exercises and workout programs
* ACF field groups with 12+ exercise properties
* REST API integration for React app
* Migration tools for importing default exercises
* WordPress admin interface for exercise management

== Upgrade Notice ==

= 1.0 =
Initial release of the Warrior Kid Exercise Management plugin.

== Technical Details ==

= Custom Post Types =

* `warrior_exercises` - Individual exercise management
* `warrior_programs` - Workout program collections

= REST API Endpoints =

* `/wp-json/wp/v2/warrior-exercises` - Exercise CRUD operations
* `/wp-json/wp/v2/warrior-programs` - Program CRUD operations

= ACF Field Groups =

* Exercise Details - 12 custom fields for exercise properties
* Workout Program Details - 7 custom fields for program management

= React App Integration =

The plugin is designed to work seamlessly with the Warrior Kid Fitness Tracker React application. The React app includes:

* WordPress API service for data fetching
* Exercise service with fallback support
* Admin panel integration
* Real-time exercise updates

== Support ==

For technical support or customization requests, please refer to the included setup documentation or contact the development team.

== Development ==

This plugin is part of the Warrior Kid Fitness Tracker project and is designed specifically for that React application. However, the code can be adapted for other fitness or exercise management applications.

= Hooks and Filters =

The plugin uses standard WordPress hooks and can be extended with custom functionality:

* `init` - Register custom post types
* `rest_api_init` - Register REST API fields
* `acf/init` - Register ACF field groups
* `admin_menu` - Add migration tools menu

= Database Tables =

The plugin uses standard WordPress tables:
* `wp_posts` - Exercise and program posts
* `wp_postmeta` - ACF field data
* `wp_options` - Plugin settings

== Privacy Policy ==

This plugin does not collect or store any personal user data. All exercise and workout data is stored locally in your WordPress database.
