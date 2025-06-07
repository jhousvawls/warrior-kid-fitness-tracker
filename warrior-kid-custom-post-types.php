<?php
/**
 * Plugin Name: Warrior Kid Custom Post Types
 * Description: Custom post types and API endpoints for the Warrior Kid Fitness Tracker React app
 * Version: 1.0.0
 * Author: Warrior Kid Fitness
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class WarriorKidCustomPostTypes {
    
    public function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'add_cors_headers'));
        add_action('rest_api_init', array($this, 'register_custom_endpoints'));
        add_filter('rest_authentication_errors', array($this, 'allow_anonymous_access'));
        register_activation_hook(__FILE__, array($this, 'flush_rewrite_rules'));
    }
    
    /**
     * Register all custom post types
     */
    public function register_post_types() {
        
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
            'show_in_rest' => true,
            'rest_base' => 'warrior-users',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'custom-fields'),
            'menu_icon' => 'dashicons-groups',
            'menu_position' => 25,
            'rest_controller_class' => 'WP_REST_Posts_Controller'
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
            'show_in_rest' => true,
            'rest_base' => 'workout-sessions',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'custom-fields'),
            'menu_icon' => 'dashicons-heart',
            'menu_position' => 26,
            'rest_controller_class' => 'WP_REST_Posts_Controller'
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
            'show_in_rest' => true,
            'rest_base' => 'screen-time-logs',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'custom-fields'),
            'menu_icon' => 'dashicons-clock',
            'menu_position' => 27,
            'rest_controller_class' => 'WP_REST_Posts_Controller'
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
            'show_in_rest' => true,
            'rest_base' => 'progress-entries',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'custom-fields'),
            'menu_icon' => 'dashicons-chart-line',
            'menu_position' => 28,
            'rest_controller_class' => 'WP_REST_Posts_Controller'
        ));
    }
    
    /**
     * Add CORS headers for React app
     */
    public function add_cors_headers() {
        // Handle preflight OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
            header("Access-Control-Allow-Credentials: true");
            exit(0);
        }
        
        // Add CORS headers to all requests
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
    }
    
    /**
     * Register custom API endpoints
     */
    public function register_custom_endpoints() {
        
        // Custom endpoint to get user by name (for login)
        register_rest_route('warrior-kid/v1', '/user/(?P<name>[a-zA-Z0-9-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_by_name'),
            'permission_callback' => '__return_true'
        ));
        
        // Custom endpoint to create new warrior user
        register_rest_route('warrior-kid/v1', '/user/create', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_warrior_user'),
            'permission_callback' => '__return_true'
        ));
        
        // Custom endpoint to get user stats
        register_rest_route('warrior-kid/v1', '/user/(?P<id>\d+)/stats', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_stats'),
            'permission_callback' => '__return_true'
        ));
        
        // Custom endpoint to save workout session
        register_rest_route('warrior-kid/v1', '/workout/save', array(
            'methods' => 'POST',
            'callback' => array($this, 'save_workout_session'),
            'permission_callback' => '__return_true'
        ));
        
        // Custom endpoint to log screen time
        register_rest_route('warrior-kid/v1', '/screentime/log', array(
            'methods' => 'POST',
            'callback' => array($this, 'log_screen_time'),
            'permission_callback' => '__return_true'
        ));
        
        // Custom endpoint to save progress entry
        register_rest_route('warrior-kid/v1', '/progress/save', array(
            'methods' => 'POST',
            'callback' => array($this, 'save_progress_entry'),
            'permission_callback' => '__return_true'
        ));
        
        // Custom endpoint for user login with password
        register_rest_route('warrior-kid/v1', '/user/login', array(
            'methods' => 'POST',
            'callback' => array($this, 'login_user'),
            'permission_callback' => '__return_true'
        ));
    }
    
    /**
     * Get user by name for login
     */
    public function get_user_by_name($request) {
        $name = $request['name'];
        
        $posts = get_posts(array(
            'post_type' => 'warrior_users',
            'meta_query' => array(
                array(
                    'key' => 'name',
                    'value' => $name,
                    'compare' => '='
                )
            ),
            'posts_per_page' => 1
        ));
        
        if (empty($posts)) {
            return new WP_Error('user_not_found', 'User not found', array('status' => 404));
        }
        
        $post = $posts[0];
        $user_data = array(
            'id' => $post->ID,
            'name' => get_field('name', $post->ID),
            'age' => get_field('age', $post->ID),
            'total_screen_time' => get_field('total_screen_time', $post->ID) ?: 0,
            'created_at' => get_field('created_at', $post->ID),
            'last_login' => get_field('last_login', $post->ID)
        );
        
        // Update last login
        update_field('last_login', current_time('mysql'), $post->ID);
        
        return rest_ensure_response($user_data);
    }
    
    /**
     * Create new warrior user
     */
    public function create_warrior_user($request) {
        $params = $request->get_json_params();
        
        if (empty($params['name']) || empty($params['age'])) {
            return new WP_Error('missing_data', 'Name and age are required', array('status' => 400));
        }
        
        // Check if user already exists
        $existing = get_posts(array(
            'post_type' => 'warrior_users',
            'meta_query' => array(
                array(
                    'key' => 'name',
                    'value' => $params['name'],
                    'compare' => '='
                )
            ),
            'posts_per_page' => 1
        ));
        
        if (!empty($existing)) {
            return new WP_Error('user_exists', 'User already exists', array('status' => 409));
        }
        
        // Create new user post
        $post_id = wp_insert_post(array(
            'post_type' => 'warrior_users',
            'post_title' => $params['name'],
            'post_status' => 'publish'
        ));
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        // Add custom fields
        update_field('name', $params['name'], $post_id);
        update_field('age', intval($params['age']), $post_id);
        update_field('password', $params['password'] ?: $params['name'] . '123', $post_id); // Simple default password
        update_field('total_screen_time', 0, $post_id);
        update_field('created_at', current_time('mysql'), $post_id);
        update_field('last_login', current_time('mysql'), $post_id);
        
        $user_data = array(
            'id' => $post_id,
            'name' => $params['name'],
            'age' => intval($params['age']),
            'total_screen_time' => 0,
            'created_at' => current_time('mysql'),
            'last_login' => current_time('mysql')
        );
        
        return rest_ensure_response($user_data);
    }
    
    /**
     * Get user statistics
     */
    public function get_user_stats($request) {
        $user_id = $request['id'];
        
        // Get user data
        $user_post = get_post($user_id);
        if (!$user_post || $user_post->post_type !== 'warrior_users') {
            return new WP_Error('user_not_found', 'User not found', array('status' => 404));
        }
        
        // Get workout sessions count
        $workout_sessions = get_posts(array(
            'post_type' => 'workout_sessions',
            'meta_query' => array(
                array(
                    'key' => 'user_id',
                    'value' => $user_id,
                    'compare' => '='
                )
            ),
            'posts_per_page' => -1
        ));
        
        // Get progress entries
        $progress_entries = get_posts(array(
            'post_type' => 'progress_entries',
            'meta_query' => array(
                array(
                    'key' => 'user_id',
                    'value' => $user_id,
                    'compare' => '='
                )
            ),
            'posts_per_page' => -1,
            'orderby' => 'meta_value',
            'meta_key' => 'date',
            'order' => 'DESC'
        ));
        
        $stats = array(
            'total_workouts' => count($workout_sessions),
            'total_screen_time' => get_field('total_screen_time', $user_id) ?: 0,
            'recent_progress' => array()
        );
        
        // Format recent progress
        foreach ($progress_entries as $entry) {
            $stats['recent_progress'][] = array(
                'exercise_type' => get_field('exercise_type', $entry->ID),
                'value' => get_field('value', $entry->ID),
                'date' => get_field('date', $entry->ID),
                'notes' => get_field('notes', $entry->ID)
            );
        }
        
        return rest_ensure_response($stats);
    }
    
    /**
     * Save workout session
     */
    public function save_workout_session($request) {
        $params = $request->get_json_params();
        
        if (empty($params['user_id']) || empty($params['exercises_completed'])) {
            return new WP_Error('missing_data', 'User ID and exercises are required', array('status' => 400));
        }
        
        $post_id = wp_insert_post(array(
            'post_type' => 'workout_sessions',
            'post_title' => 'Workout Session - ' . date('Y-m-d H:i:s'),
            'post_status' => 'publish'
        ));
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        // Save workout data
        update_field('user_id', $params['user_id'], $post_id);
        update_field('session_date', $params['session_date'] ?: date('Y-m-d'), $post_id);
        update_field('exercises_completed', $params['exercises_completed'], $post_id);
        update_field('total_duration', $params['total_duration'] ?: 0, $post_id);
        update_field('screen_time_earned', $params['screen_time_earned'] ?: 10, $post_id);
        update_field('completed_at', current_time('mysql'), $post_id);
        
        // Update user's total screen time
        $current_screen_time = get_field('total_screen_time', $params['user_id']) ?: 0;
        $new_screen_time = $current_screen_time + ($params['screen_time_earned'] ?: 10);
        update_field('total_screen_time', $new_screen_time, $params['user_id']);
        
        return rest_ensure_response(array('id' => $post_id, 'status' => 'success'));
    }
    
    /**
     * Log screen time usage
     */
    public function log_screen_time($request) {
        $params = $request->get_json_params();
        
        if (empty($params['user_id']) || empty($params['action_type']) || empty($params['minutes'])) {
            return new WP_Error('missing_data', 'User ID, action type, and minutes are required', array('status' => 400));
        }
        
        $post_id = wp_insert_post(array(
            'post_type' => 'screen_time_logs',
            'post_title' => 'Screen Time Log - ' . date('Y-m-d H:i:s'),
            'post_status' => 'publish'
        ));
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        update_field('user_id', $params['user_id'], $post_id);
        update_field('action_type', $params['action_type'], $post_id);
        update_field('minutes', intval($params['minutes']), $post_id);
        update_field('source', $params['source'] ?: '', $post_id);
        update_field('timestamp', current_time('mysql'), $post_id);
        
        // Update user's total screen time if used
        if ($params['action_type'] === 'used') {
            $current_screen_time = get_field('total_screen_time', $params['user_id']) ?: 0;
            $new_screen_time = max(0, $current_screen_time - intval($params['minutes']));
            update_field('total_screen_time', $new_screen_time, $params['user_id']);
        }
        
        return rest_ensure_response(array('id' => $post_id, 'status' => 'success'));
    }
    
    /**
     * Save progress entry
     */
    public function save_progress_entry($request) {
        $params = $request->get_json_params();
        
        if (empty($params['user_id']) || empty($params['exercise_type']) || !isset($params['value'])) {
            return new WP_Error('missing_data', 'User ID, exercise type, and value are required', array('status' => 400));
        }
        
        $post_id = wp_insert_post(array(
            'post_type' => 'progress_entries',
            'post_title' => $params['exercise_type'] . ' Progress - ' . date('Y-m-d'),
            'post_status' => 'publish'
        ));
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        update_field('user_id', $params['user_id'], $post_id);
        update_field('exercise_type', $params['exercise_type'], $post_id);
        update_field('value', intval($params['value']), $post_id);
        update_field('date', $params['date'] ?: date('Y-m-d'), $post_id);
        update_field('notes', $params['notes'] ?: '', $post_id);
        
        return rest_ensure_response(array('id' => $post_id, 'status' => 'success'));
    }
    
    /**
     * Login user with password
     */
    public function login_user($request) {
        $params = $request->get_json_params();
        
        if (empty($params['name']) || empty($params['password'])) {
            return new WP_Error('missing_data', 'Name and password are required', array('status' => 400));
        }
        
        $posts = get_posts(array(
            'post_type' => 'warrior_users',
            'meta_query' => array(
                array(
                    'key' => 'name',
                    'value' => $params['name'],
                    'compare' => '='
                )
            ),
            'posts_per_page' => 1
        ));
        
        if (empty($posts)) {
            return new WP_Error('user_not_found', 'Warrior not found', array('status' => 404));
        }
        
        $post = $posts[0];
        $stored_password = get_field('password', $post->ID);
        
        // Check password
        if ($stored_password !== $params['password']) {
            return new WP_Error('invalid_password', 'Incorrect password', array('status' => 401));
        }
        
        // Update last login
        update_field('last_login', current_time('mysql'), $post->ID);
        
        $user_data = array(
            'id' => $post->ID,
            'name' => get_field('name', $post->ID),
            'age' => get_field('age', $post->ID),
            'total_screen_time' => get_field('total_screen_time', $post->ID) ?: 0,
            'created_at' => get_field('created_at', $post->ID),
            'last_login' => current_time('mysql')
        );
        
        return rest_ensure_response($user_data);
    }
    
    /**
     * Allow anonymous access to our custom endpoints
     */
    public function allow_anonymous_access($result) {
        // If there's already an authentication error, return it
        if (is_wp_error($result)) {
            return $result;
        }
        
        // Allow anonymous access to our custom warrior-kid endpoints
        if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp-json/warrior-kid/v1/') !== false) {
            return true;
        }
        
        // For all other requests, use default authentication
        return $result;
    }
    
    /**
     * Flush rewrite rules on activation
     */
    public function flush_rewrite_rules() {
        $this->register_post_types();
        flush_rewrite_rules();
    }
}

// Initialize the plugin
new WarriorKidCustomPostTypes();

?>
