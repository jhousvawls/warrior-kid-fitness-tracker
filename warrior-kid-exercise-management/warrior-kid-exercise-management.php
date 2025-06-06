<?php
/**
 * Plugin Name: Warrior Kid Exercise Management
 * Description: Custom post types and fields for managing workout exercises in the Warrior Kid Fitness Tracker
 * Version: 1.0
 * Author: Warrior Kid Fitness Team
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class WarriorKidExerciseManager {
    
    public function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_action('acf/init', array($this, 'register_acf_fields'));
    }
    
    /**
     * Register custom post types
     */
    public function register_post_types() {
        
        // Register Exercises Post Type
        register_post_type('warrior_exercises', array(
            'labels' => array(
                'name' => 'Exercises',
                'singular_name' => 'Exercise',
                'menu_name' => 'Exercises',
                'add_new' => 'Add New Exercise',
                'add_new_item' => 'Add New Exercise',
                'edit_item' => 'Edit Exercise',
                'new_item' => 'New Exercise',
                'view_item' => 'View Exercise',
                'search_items' => 'Search Exercises',
                'not_found' => 'No exercises found',
                'not_found_in_trash' => 'No exercises found in trash'
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_admin_bar' => true,
            'show_in_rest' => true,
            'rest_base' => 'warrior-exercises',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'menu_icon' => 'dashicons-heart',
            'menu_position' => 25,
            'has_archive' => false,
            'rewrite' => array('slug' => 'exercises'),
        ));
        
        // Register Workout Programs Post Type
        register_post_type('warrior_programs', array(
            'labels' => array(
                'name' => 'Workout Programs',
                'singular_name' => 'Workout Program',
                'menu_name' => 'Workout Programs',
                'add_new' => 'Add New Program',
                'add_new_item' => 'Add New Workout Program',
                'edit_item' => 'Edit Workout Program',
                'new_item' => 'New Workout Program',
                'view_item' => 'View Workout Program',
                'search_items' => 'Search Workout Programs',
                'not_found' => 'No workout programs found',
                'not_found_in_trash' => 'No workout programs found in trash'
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_admin_bar' => true,
            'show_in_rest' => true,
            'rest_base' => 'warrior-programs',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'menu_icon' => 'dashicons-list-view',
            'menu_position' => 26,
            'has_archive' => false,
            'rewrite' => array('slug' => 'workout-programs'),
        ));
    }
    
    /**
     * Register ACF field groups
     */
    public function register_acf_fields() {
        
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }
        
        // Exercise Fields
        acf_add_local_field_group(array(
            'key' => 'group_warrior_exercises',
            'title' => 'Exercise Details',
            'fields' => array(
                array(
                    'key' => 'field_exercise_avatar',
                    'label' => 'Exercise Avatar',
                    'name' => 'exercise_avatar',
                    'type' => 'text',
                    'instructions' => 'Emoji or icon for the exercise (e.g., 💪, 🦸‍♂️, 🦀)',
                    'required' => 1,
                    'default_value' => '💪',
                ),
                array(
                    'key' => 'field_exercise_type',
                    'label' => 'Exercise Type',
                    'name' => 'exercise_type',
                    'type' => 'select',
                    'instructions' => 'How is this exercise measured?',
                    'required' => 1,
                    'choices' => array(
                        'reps' => 'Repetitions (count)',
                        'time' => 'Time (seconds)',
                        'sets' => 'Sets (multiple rounds)',
                    ),
                    'default_value' => 'reps',
                ),
                array(
                    'key' => 'field_target_value',
                    'label' => 'Target Value',
                    'name' => 'target_value',
                    'type' => 'number',
                    'instructions' => 'Target number (reps, seconds, or sets)',
                    'required' => 1,
                    'default_value' => 10,
                    'min' => 1,
                ),
                array(
                    'key' => 'field_unit_label',
                    'label' => 'Unit Label',
                    'name' => 'unit_label',
                    'type' => 'text',
                    'instructions' => 'Display text for the unit (e.g., "reps", "seconds", "sets")',
                    'required' => 1,
                    'default_value' => 'reps',
                ),
                array(
                    'key' => 'field_exercise_instructions',
                    'label' => 'Instructions',
                    'name' => 'exercise_instructions',
                    'type' => 'textarea',
                    'instructions' => 'Clear, kid-friendly instructions for the exercise',
                    'required' => 1,
                    'rows' => 3,
                ),
                array(
                    'key' => 'field_video_url',
                    'label' => 'Video URL',
                    'name' => 'video_url',
                    'type' => 'url',
                    'instructions' => 'YouTube or other video demonstration link',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_is_special_tracking',
                    'label' => 'Special Tracking',
                    'name' => 'is_special_tracking',
                    'type' => 'true_false',
                    'instructions' => 'Enable special progress tracking (like pull-ups)',
                    'default_value' => 0,
                ),
                array(
                    'key' => 'field_difficulty_level',
                    'label' => 'Difficulty Level',
                    'name' => 'difficulty_level',
                    'type' => 'select',
                    'instructions' => 'Exercise difficulty',
                    'required' => 1,
                    'choices' => array(
                        'beginner' => 'Beginner',
                        'intermediate' => 'Intermediate',
                        'advanced' => 'Advanced',
                    ),
                    'default_value' => 'beginner',
                ),
                array(
                    'key' => 'field_exercise_category',
                    'label' => 'Exercise Category',
                    'name' => 'exercise_category',
                    'type' => 'select',
                    'instructions' => 'Type of exercise',
                    'required' => 1,
                    'choices' => array(
                        'upper_body' => 'Upper Body',
                        'core' => 'Core',
                        'cardio' => 'Cardio',
                        'flexibility' => 'Flexibility',
                        'full_body' => 'Full Body',
                    ),
                    'default_value' => 'upper_body',
                ),
                array(
                    'key' => 'field_rest_time_after',
                    'label' => 'Rest Time After (seconds)',
                    'name' => 'rest_time_after',
                    'type' => 'number',
                    'instructions' => 'Recommended rest time after this exercise',
                    'default_value' => 15,
                    'min' => 0,
                    'max' => 120,
                ),
                array(
                    'key' => 'field_screen_time_bonus',
                    'label' => 'Screen Time Bonus',
                    'name' => 'screen_time_bonus',
                    'type' => 'number',
                    'instructions' => 'Extra screen time minutes for completing this exercise',
                    'default_value' => 0,
                    'min' => 0,
                    'max' => 30,
                ),
                array(
                    'key' => 'field_exercise_order',
                    'label' => 'Display Order',
                    'name' => 'exercise_order',
                    'type' => 'number',
                    'instructions' => 'Order in workout (lower numbers appear first)',
                    'default_value' => 1,
                    'min' => 1,
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'warrior_exercises',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
        ));
        
        // Workout Program Fields
        acf_add_local_field_group(array(
            'key' => 'group_warrior_programs',
            'title' => 'Workout Program Details',
            'fields' => array(
                array(
                    'key' => 'field_program_description',
                    'label' => 'Program Description',
                    'name' => 'program_description',
                    'type' => 'textarea',
                    'instructions' => 'Description of this workout program',
                    'required' => 1,
                    'rows' => 3,
                ),
                array(
                    'key' => 'field_program_exercises',
                    'label' => 'Exercises',
                    'name' => 'program_exercises',
                    'type' => 'relationship',
                    'instructions' => 'Select exercises for this program',
                    'required' => 1,
                    'post_type' => array('warrior_exercises'),
                    'taxonomy' => '',
                    'filters' => array('search'),
                    'elements' => array('featured_image'),
                    'min' => 1,
                    'max' => 20,
                    'return_format' => 'id',
                ),
                array(
                    'key' => 'field_total_rounds',
                    'label' => 'Total Rounds',
                    'name' => 'total_rounds',
                    'type' => 'number',
                    'instructions' => 'Number of rounds for this program',
                    'required' => 1,
                    'default_value' => 3,
                    'min' => 1,
                    'max' => 10,
                ),
                array(
                    'key' => 'field_program_difficulty',
                    'label' => 'Program Difficulty',
                    'name' => 'program_difficulty',
                    'type' => 'select',
                    'instructions' => 'Overall difficulty of this program',
                    'required' => 1,
                    'choices' => array(
                        'beginner' => 'Beginner',
                        'intermediate' => 'Intermediate',
                        'advanced' => 'Advanced',
                    ),
                    'default_value' => 'beginner',
                ),
                array(
                    'key' => 'field_estimated_duration',
                    'label' => 'Estimated Duration (minutes)',
                    'name' => 'estimated_duration',
                    'type' => 'number',
                    'instructions' => 'Estimated time to complete this program',
                    'default_value' => 15,
                    'min' => 5,
                    'max' => 60,
                ),
                array(
                    'key' => 'field_age_groups',
                    'label' => 'Age Groups',
                    'name' => 'age_groups',
                    'type' => 'checkbox',
                    'instructions' => 'Recommended age groups for this program',
                    'choices' => array(
                        '6-8' => '6-8 years',
                        '9-11' => '9-11 years',
                        '12-14' => '12-14 years',
                        '15+' => '15+ years',
                    ),
                    'default_value' => array('6-8', '9-11'),
                ),
                array(
                    'key' => 'field_program_active',
                    'label' => 'Program Active',
                    'name' => 'program_active',
                    'type' => 'true_false',
                    'instructions' => 'Is this program currently available in the app?',
                    'default_value' => 1,
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'warrior_programs',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
        ));
    }
    
    /**
     * Register REST API fields
     */
    public function register_rest_fields() {
        
        // Register exercise fields for REST API
        $exercise_fields = array(
            'exercise_avatar', 'exercise_type', 'target_value', 'unit_label',
            'exercise_instructions', 'video_url', 'is_special_tracking',
            'difficulty_level', 'exercise_category', 'rest_time_after',
            'screen_time_bonus', 'exercise_order'
        );
        
        foreach ($exercise_fields as $field) {
            register_rest_field('warrior_exercises', $field, array(
                'get_callback' => function($post) use ($field) {
                    return get_field($field, $post['id']);
                },
                'update_callback' => function($value, $post) use ($field) {
                    return update_field($field, $value, $post->ID);
                },
                'schema' => null,
            ));
        }
        
        // Register program fields for REST API
        $program_fields = array(
            'program_description', 'program_exercises', 'total_rounds',
            'program_difficulty', 'estimated_duration', 'age_groups', 'program_active'
        );
        
        foreach ($program_fields as $field) {
            register_rest_field('warrior_programs', $field, array(
                'get_callback' => function($post) use ($field) {
                    return get_field($field, $post['id']);
                },
                'update_callback' => function($value, $post) use ($field) {
                    return update_field($field, $value, $post->ID);
                },
                'schema' => null,
            ));
        }
    }
}

// Initialize the plugin
new WarriorKidExerciseManager();

/**
 * Migration function to import existing exercises
 */
function warrior_kid_migrate_exercises() {
    
    // Default exercises from the React app
    $default_exercises = array(
        array(
            'name' => 'Push-Ups',
            'avatar' => '💪',
            'type' => 'reps',
            'target' => 10,
            'unit' => 'reps',
            'video_url' => 'https://youtube.com/shorts/whyp41YIN8A?si=IbTrb9nIFIJxoNA2',
            'instructions' => 'Keep your body straight and lower yourself down, then push back up!',
            'category' => 'upper_body',
            'difficulty' => 'beginner',
            'order' => 1
        ),
        array(
            'name' => 'Superman Pose',
            'avatar' => '🦸‍♂️',
            'type' => 'time',
            'target' => 15,
            'unit' => 'seconds',
            'video_url' => 'https://youtube.com/shorts/KTWWh3GsyYw?si=ETPL7fFspMys-wx9',
            'instructions' => 'Lie on your belly and lift your arms and legs like Superman flying!',
            'category' => 'core',
            'difficulty' => 'beginner',
            'order' => 2
        ),
        array(
            'name' => 'Crab Walk',
            'avatar' => '🦀',
            'type' => 'time',
            'target' => 30,
            'unit' => 'seconds',
            'video_url' => 'https://youtube.com/shorts/jYGPvnNn2vQ?si=3kg8Jj1mVBQYr2S7',
            'instructions' => 'Walk like a crab with your belly facing up!',
            'category' => 'full_body',
            'difficulty' => 'intermediate',
            'order' => 3
        ),
        array(
            'name' => 'Bear Crawl',
            'avatar' => '🐻',
            'type' => 'time',
            'target' => 30,
            'unit' => 'seconds',
            'video_url' => 'https://youtube.com/shorts/l8eRtgP7ZoY?si=fNilofrR31GWdgeo',
            'instructions' => 'Crawl forward like a bear, keeping your knees off the ground!',
            'category' => 'full_body',
            'difficulty' => 'intermediate',
            'order' => 4
        ),
        array(
            'name' => 'Wall Push-Ups',
            'avatar' => '🧗‍♂️',
            'type' => 'reps',
            'target' => 10,
            'unit' => 'reps',
            'video_url' => 'https://youtube.com/shorts/whyp41YIN8A?si=IbTrb9nIFIJxoNA2',
            'instructions' => 'Stand arm\'s length from a wall and do push-ups against it!',
            'category' => 'upper_body',
            'difficulty' => 'beginner',
            'order' => 5
        ),
        array(
            'name' => 'Overhead Arm Claps',
            'avatar' => '👏',
            'type' => 'time',
            'target' => 30,
            'unit' => 'seconds',
            'video_url' => 'https://youtube.com/shorts/wHNf8W1U4qA?si=N3Iz1WuNAgxJ2NPV',
            'instructions' => 'Clap your hands above your head as fast as you can!',
            'category' => 'cardio',
            'difficulty' => 'beginner',
            'order' => 6
        ),
        array(
            'name' => 'Plank',
            'avatar' => '🏗️',
            'type' => 'time',
            'target' => 30,
            'unit' => 'seconds',
            'video_url' => 'https://youtube.com/shorts/v3V6iyQfKzY?si=Ie96N5zdX-pDkGxN',
            'instructions' => 'Hold your body straight like a wooden plank!',
            'category' => 'core',
            'difficulty' => 'intermediate',
            'order' => 7
        ),
        array(
            'name' => 'Pull-ups',
            'avatar' => '🐒',
            'type' => 'sets',
            'target' => 3,
            'unit' => 'sets (as many as possible)',
            'video_url' => '',
            'instructions' => 'Hang from a bar and pull yourself up! Do as many as you can in each set.',
            'category' => 'upper_body',
            'difficulty' => 'advanced',
            'order' => 8,
            'is_special' => true
        )
    );
    
    foreach ($default_exercises as $exercise) {
        $post_id = wp_insert_post(array(
            'post_title' => $exercise['name'],
            'post_type' => 'warrior_exercises',
            'post_status' => 'publish',
            'post_content' => $exercise['instructions']
        ));
        
        if ($post_id) {
            update_field('exercise_avatar', $exercise['avatar'], $post_id);
            update_field('exercise_type', $exercise['type'], $post_id);
            update_field('target_value', $exercise['target'], $post_id);
            update_field('unit_label', $exercise['unit'], $post_id);
            update_field('exercise_instructions', $exercise['instructions'], $post_id);
            update_field('video_url', $exercise['video_url'], $post_id);
            update_field('is_special_tracking', isset($exercise['is_special']) ? $exercise['is_special'] : false, $post_id);
            update_field('difficulty_level', $exercise['difficulty'], $post_id);
            update_field('exercise_category', $exercise['category'], $post_id);
            update_field('rest_time_after', 15, $post_id);
            update_field('screen_time_bonus', 0, $post_id);
            update_field('exercise_order', $exercise['order'], $post_id);
        }
    }
    
    // Create default workout program
    $program_id = wp_insert_post(array(
        'post_title' => 'Default Warrior Workout',
        'post_type' => 'warrior_programs',
        'post_status' => 'publish',
        'post_content' => 'The classic Warrior Kid workout program with all essential exercises.'
    ));
    
    if ($program_id) {
        // Get all exercise IDs
        $exercise_posts = get_posts(array(
            'post_type' => 'warrior_exercises',
            'numberposts' => -1,
            'fields' => 'ids'
        ));
        
        update_field('program_description', 'The classic Warrior Kid workout program with all essential exercises.', $program_id);
        update_field('program_exercises', $exercise_posts, $program_id);
        update_field('total_rounds', 3, $program_id);
        update_field('program_difficulty', 'beginner', $program_id);
        update_field('estimated_duration', 15, $program_id);
        update_field('age_groups', array('6-8', '9-11', '12-14'), $program_id);
        update_field('program_active', true, $program_id);
    }
}

// Add admin menu for migration
add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=warrior_exercises',
        'Migration Tools',
        'Migration Tools',
        'manage_options',
        'warrior-migration',
        function() {
            if (isset($_POST['migrate_exercises']) && wp_verify_nonce($_POST['_wpnonce'], 'migrate_exercises')) {
                warrior_kid_migrate_exercises();
                echo '<div class="notice notice-success"><p>Exercises migrated successfully!</p></div>';
            }
            ?>
            <div class="wrap">
                <h1>Warrior Kid Migration Tools</h1>
                <div class="card" style="max-width: 600px;">
                    <h2>Import Default Exercises</h2>
                    <p>Click the button below to import the default exercises from your React app into WordPress.</p>
                    <p><strong>Note:</strong> This will create new exercise posts. Only run this once.</p>
                    
                    <form method="post">
                        <?php wp_nonce_field('migrate_exercises'); ?>
                        <input type="submit" name="migrate_exercises" class="button button-primary" value="Import Default Exercises">
                    </form>
                    
                    <h3>What will be imported:</h3>
                    <ul>
                        <li>💪 Push-Ups (10 reps)</li>
                        <li>🦸‍♂️ Superman Pose (15 seconds)</li>
                        <li>🦀 Crab Walk (30 seconds)</li>
                        <li>🐻 Bear Crawl (30 seconds)</li>
                        <li>🧗‍♂️ Wall Push-Ups (10 reps)</li>
                        <li>👏 Overhead Arm Claps (30 seconds)</li>
                        <li>🏗️ Plank (30 seconds)</li>
                        <li>🐒 Pull-ups (3 sets)</li>
                    </ul>
                    
                    <p><em>Plus one default workout program containing all exercises.</em></p>
                </div>
            </div>
            <?php
        }
    );
});
?>
