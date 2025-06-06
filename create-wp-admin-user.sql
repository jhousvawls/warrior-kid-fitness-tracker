-- SQL script to create a WordPress admin user
-- Replace 'your_username', 'your_email@example.com', and 'your_password' with your desired values

INSERT INTO wp_users (user_login, user_pass, user_nicename, user_email, user_status, display_name) 
VALUES ('your_username', MD5('your_password'), 'your_username', 'your_email@example.com', 0, 'Your Display Name');

-- Get the user ID (replace X with the actual ID from the previous insert)
SET @user_id = LAST_INSERT_ID();

-- Set user capabilities to administrator
INSERT INTO wp_usermeta (user_id, meta_key, meta_value) 
VALUES (@user_id, 'wp_capabilities', 'a:1:{s:13:"administrator";b:1;}');

INSERT INTO wp_usermeta (user_id, meta_key, meta_value) 
VALUES (@user_id, 'wp_user_level', '10');

-- Instructions:
-- 1. Access your WP Engine database through phpMyAdmin or similar tool
-- 2. Replace the placeholder values in this script
-- 3. Execute the SQL commands
-- 4. You can now login with the new admin credentials
