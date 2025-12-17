--insert roles
INSERT INTO roles (name, description)
SELECT 'USER', 'Normal user role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'USER');

INSERT INTO roles (name, description)
SELECT 'MANAGER', 'Manager role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MANAGER');

INSERT INTO roles (name, description)
SELECT 'ADMIN', 'Administrator role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN');

--insert sample users
INSERT INTO users (email, password, full_name, status, phone_number, role_id)
SELECT 'user@example.com',
       '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
       'User Sample',
       'ACTIVE',
       '0123456789',
       r.id
FROM roles r
WHERE r.name = 'USER'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = 'user@example.com');

INSERT INTO users (email, password, full_name, status, phone_number, role_id)
SELECT 'manager@example.com',
       '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
       'Manager Sample',
       'ACTIVE',
       '0987654321',
       r.id
FROM roles r
WHERE r.name = 'MANAGER'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = 'manager@example.com');

INSERT INTO users (email, password, full_name, status, phone_number, role_id)
SELECT 'admin@example.com',
       '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
       'Admin Sample',
       'ACTIVE',
       '0909090909',
       r.id
FROM roles r
WHERE r.name = 'ADMIN'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = 'admin@example.com');

-- Insert 25 additional users manually
INSERT INTO users (email, password, full_name, status, phone_number, role_id)
SELECT CONCAT('user', n, '@example.com'),
       '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
       CONCAT('User Sample ', n),
       'ACTIVE',
       CONCAT('0900', LPAD(n, 6, '0')),
       r.id
FROM roles r
JOIN (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
  SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL
  SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL
  SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL
  SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
) AS numbers
WHERE r.name = 'USER'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = CONCAT('user', n, '@example.com'));

--
-- Insert sample categories
--
INSERT INTO categories (name, description, created_at, updated_at)
SELECT 'Environment', 'Events related to environmental protection and conservation.', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Environment');

INSERT INTO categories (name, description, created_at, updated_at)
SELECT 'Health', 'Events focused on health, wellness, and medical support.', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Health');

INSERT INTO categories (name, description, created_at, updated_at)
SELECT 'Education', 'Events related to teaching, learning, and skill development.', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Education');

INSERT INTO categories (name, description, created_at, updated_at)
SELECT 'Community', 'Events that support local community building and social welfare.', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Community');

--
-- Insert sample events (managed by 'manager@example.com')
--
INSERT INTO events (name, description, location, image_url, start_date, end_date, manager_id, created_at, updated_at)
SELECT
    'Beach Cleanup Day',
    'Join us to clean up our local beach and protect marine life. Gloves and bags will be provided.',
    'Sunnyvale Beach, Main Entrance',
    'https://i.imgur.com/example-beach.jpg',
    '2025-11-20 09:00:00',
    '2025-11-20 12:00:00',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (SELECT 1 FROM events WHERE name = 'Beach Cleanup Day');

INSERT INTO events (name, description, location, image_url, start_date, end_date, manager_id, created_at, updated_at)
SELECT
    'Run for Hope Charity Marathon',
    'Annual 5K marathon to raise funds for the children''s hospital. All participants get a t-shirt!',
    'City Center Park',
    'https://i.imgur.com/example-marathon.jpg',
    '2025-12-05 08:00:00',
    '2025-12-05 11:00:00',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (SELECT 1 FROM events WHERE name = 'Run for Hope Charity Marathon');

INSERT INTO events (name, description, location, image_url, start_date, end_date, manager_id, created_at, updated_at)
SELECT
    'Code for a Cause Workshop',
    'A workshop teaching basic web development skills to help non-profits build their websites.',
    'Community Tech Hub, 123 Main St',
    'https://i.imgur.com/example-code.jpg',
    '2025-12-10 10:00:00',
    '2025-12-10 16:00:00',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (SELECT 1 FROM events WHERE name = 'Code for a Cause Workshop');

--
-- Link events to categories
--
INSERT INTO events_categories (event_id, category_id)
SELECT
    (SELECT id FROM events WHERE name = 'Beach Cleanup Day'),
    (SELECT id FROM categories WHERE name = 'Environment')
WHERE NOT EXISTS (
    SELECT 1 FROM events_categories
    WHERE event_id = (SELECT id FROM events WHERE name = 'Beach Cleanup Day')
      AND category_id = (SELECT id FROM categories WHERE name = 'Environment')
);

INSERT INTO events_categories (event_id, category_id)
SELECT
    (SELECT id FROM events WHERE name = 'Run for Hope Charity Marathon'),
    (SELECT id FROM categories WHERE name = 'Health')
WHERE NOT EXISTS (
    SELECT 1 FROM events_categories
    WHERE event_id = (SELECT id FROM events WHERE name = 'Run for Hope Charity Marathon')
      AND category_id = (SELECT id FROM categories WHERE name = 'Health')
);

INSERT INTO events_categories (event_id, category_id)
SELECT
    (SELECT id FROM events WHERE name = 'Code for a Cause Workshop'),
    (SELECT id FROM categories WHERE name = 'Education')
WHERE NOT EXISTS (
    SELECT 1 FROM events_categories
    WHERE event_id = (SELECT id FROM events WHERE name = 'Code for a Cause Workshop')
      AND category_id = (SELECT id FROM categories WHERE name = 'Education')
);

INSERT INTO events_categories (event_id, category_id)
SELECT
    (SELECT id FROM events WHERE name = 'Code for a Cause Workshop'),
    (SELECT id FROM categories WHERE name = 'Community')
WHERE NOT EXISTS (
    SELECT 1 FROM events_categories
    WHERE event_id = (SELECT id FROM events WHERE name = 'Code for a Cause Workshop')
      AND category_id = (SELECT id FROM categories WHERE name = 'Community')
); 


--
-- Insert sample event create requests (in PENDING status)
--
INSERT INTO event_create_requests (
    name,  -- Changed from 'title'
    description, 
    location, 
    image_url, 
    start_date, 
    end_date, 
    status, 
    manager_id, 
    created_at, 
    updated_at
)
SELECT
    'Community Park Planting Day',
    'Let''s plant new trees and flowers in the local park. This event is open to all ages. We will provide all the tools and saplings.',
    'City Park, North Entrance',
    'https://i.imgur.com/example-plant.jpg',
    '2026-01-15 10:00:00',
    '2026-01-15 14:00:00',
    'PENDING',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_create_requests WHERE name = 'Community Park Planting Day'); -- Changed from 'title'

INSERT INTO event_create_requests (
    name,
    description, 
    location, 
    image_url, 
    start_date, 
    end_date, 
    status, 
    manager_id, 
    created_at, 
    updated_at
)
SELECT
    'Fundraising Bake Sale for Shelter',
    'Raising money for the animal shelter. All proceeds go directly to helping animals in need. We need volunteers to bake and to help sell.',
    'Town Hall Square',
    'https://i.imgur.com/example-bake.jpg',
    '2026-01-20 11:00:00',
    '2026-01-20 16:00:00',
    'PENDING',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_create_requests WHERE name = 'Fundraising Bake Sale for Shelter'); -- Changed from 'title'

INSERT INTO event_create_requests (
    name,  -- Changed from 'title'
    description, 
    location, 
    image_url, 
    start_date, 
    end_date, 
    status, 
    manager_id, 
    created_at, 
    updated_at
)
SELECT
    'Elderly Home Visit',
    'Spend an afternoon with residents at the SunnyDays Elderly Home. We will play board games, read, and chat. A small act of kindness goes a long way.',
    'SunnyDays Elderly Home, 456 Old Rd',
    'https://i.imgur.com/example-visit.jpg',
    '2026-01-22 14:00:00',
    '2026-01-22 17:00:00',
    'PENDING',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_create_requests WHERE name = 'Elderly Home Visit'); -- Changed from 'title'

-- Sample event_members for testing (time-consistent with events above)

-- Beach Cleanup Day (event date 2025-11-20) — completed participants
INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-11-15 09:00:00', NOW()
FROM events e, users u
WHERE e.name = 'Beach Cleanup Day' AND u.email = 'user1@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-11-18 14:30:00', NOW()
FROM events e, users u
WHERE e.name = 'Beach Cleanup Day' AND u.email = 'user2@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-11-19 08:45:00', NOW()
FROM events e, users u
WHERE e.name = 'Beach Cleanup Day' AND u.email = 'user3@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-11-19 10:00:00', NOW()
FROM events e, users u
WHERE e.name = 'Beach Cleanup Day' AND u.email = 'user4@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-11-20 08:20:00', NOW()
FROM events e, users u
WHERE e.name = 'Beach Cleanup Day' AND u.email = 'user5@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);


-- Run for Hope Charity Marathon (event date 2025-12-05) — mix of completed and no-shows
INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-12-01 11:00:00', NOW()
FROM events e, users u
WHERE e.name = 'Run for Hope Charity Marathon' AND u.email = 'user6@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'ABSENT', '2025-11-30 09:30:00', NOW()
FROM events e, users u
WHERE e.name = 'Run for Hope Charity Marathon' AND u.email = 'user7@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-12-03 16:15:00', NOW()
FROM events e, users u
WHERE e.name = 'Run for Hope Charity Marathon' AND u.email = 'user8@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-12-04 07:50:00', NOW()
FROM events e, users u
WHERE e.name = 'Run for Hope Charity Marathon' AND u.email = 'user9@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'ABSENT', '2025-12-05 08:10:00', NOW()
FROM events e, users u
WHERE e.name = 'Run for Hope Charity Marathon' AND u.email = 'user10@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);


-- Code for a Cause Workshop (event date 2025-12-10) — some pending (registered before event), some completed
INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'PENDING', '2025-12-08 13:20:00', NOW()
FROM events e, users u
WHERE e.name = 'Code for a Cause Workshop' AND u.email = 'user11@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'COMPLETED', '2025-12-09 09:00:00', NOW()
FROM events e, users u
WHERE e.name = 'Code for a Cause Workshop' AND u.email = 'user12@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'PENDING', '2025-12-09 19:45:00', NOW()
FROM events e, users u
WHERE e.name = 'Code for a Cause Workshop' AND u.email = 'user13@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);


-- Future event (Community Park Planting Day 2026-01-15) — registrations (PENDING)
INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'PENDING', '2025-12-10 12:00:00', NOW()
FROM events e, users u
WHERE e.name = 'Community Park Planting Day' AND u.email = 'user14@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);

INSERT INTO event_members (event_id, user_id, work_status, created_at, updated_at)
SELECT e.id, u.id, 'PENDING', '2025-12-11 15:30:00', NOW()
FROM events e, users u
WHERE e.name = 'Community Park Planting Day' AND u.email = 'user15@example.com'
  AND NOT EXISTS (SELECT 1 FROM event_members em WHERE em.event_id = e.id AND em.user_id = u.id);