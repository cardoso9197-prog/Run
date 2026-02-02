-- Clean up orphaned passengers whose user_id doesn't exist in users table
DELETE FROM passengers
WHERE user_id NOT IN (SELECT id FROM users);

-- Clean up orphaned rides whose passenger_id doesn't exist in passengers table
DELETE FROM rides
WHERE passenger_id NOT IN (SELECT id FROM passengers);

-- Clean up orphaned payment_methods whose user_id doesn't exist in users table
DELETE FROM payment_methods
WHERE user_id NOT IN (SELECT id FROM users);

-- Clean up orphaned drivers whose user_id doesn't exist in users table
DELETE FROM drivers
WHERE user_id NOT IN (SELECT id FROM users);

-- Reset sequences if needed (optional)
-- SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
-- SELECT setval('passengers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM passengers));
-- SELECT setval('rides_id_seq', (SELECT COALESCE(MAX(id), 1) FROM rides));
