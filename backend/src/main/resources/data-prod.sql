-- ======================
-- INSERT ROLES
-- ======================
INSERT INTO roles (name, description)
SELECT 'USER', 'Normal user role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'USER');

INSERT INTO roles (name, description)
SELECT 'MANAGER', 'Manager role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MANAGER');

INSERT INTO roles (name, description)
SELECT 'ADMIN', 'Administrator role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN');


-- ======================
-- INSERT SAMPLE USERS (POSTGRES)
-- ======================

INSERT INTO users (
    email, password, full_name, status, phone_number, role_id,
    created_at, updated_at
)
SELECT
    'user@example.com',
    '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
    'User Sample',
    'ACTIVE',
    '0123456789',
    r.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'USER'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'user@example.com'
);

INSERT INTO users (
    email, password, full_name, status, phone_number, role_id,
    created_at, updated_at
)
SELECT
    'manager@example.com',
    '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
    'Manager Sample',
    'ACTIVE',
    '0987654321',
    r.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'MANAGER'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'manager@example.com'
);

INSERT INTO users (
    email, password, full_name, status, phone_number, role_id,
    created_at, updated_at
)
SELECT
    'admin@example.com',
    '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
    'Admin Sample',
    'ACTIVE',
    '0909090909',
    r.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'admin@example.com'
);

-- ======================
-- INSERT 25 ADDITIONAL USERS
-- ======================

INSERT INTO users (
    email, password, full_name, status, phone_number, role_id,
    created_at, updated_at
)
SELECT
    'user' || n || '@example.com',
    '$2a$10$t57F0BQCUeyePPAanxw3/OwCjtDAgD4Qejxavm/USimM47.49y2iO',
    'User Sample ' || n,
    'ACTIVE',
    '0900' || LPAD(n::text, 6, '0'),
    r.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
CROSS JOIN generate_series(1, 25) AS n
WHERE r.name = 'USER'
  AND NOT EXISTS (
    SELECT 1
    FROM users u
    WHERE u.email = 'user' || n || '@example.com'
);



-- ======================
-- INSERT SAMPLE CATEGORIES
-- ======================
INSERT INTO categories (name, description, created_at, updated_at)
SELECT
    'Environment',
    'Events related to environmental protection and conservation.',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Environment');

INSERT INTO categories (name, description, created_at, updated_at)
SELECT
    'Health',
    'Events focused on health, wellness, and medical support.',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Health');

INSERT INTO categories (name, description, created_at, updated_at)
SELECT
    'Education',
    'Events related to teaching, learning, and skill development.',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Education');

INSERT INTO categories (name, description, created_at, updated_at)
SELECT
    'Community',
    'Events that support local community building and social welfare.',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Community');


-- ======================
-- INSERT SAMPLE EVENTS
-- ======================
INSERT INTO events (
    name, description, location, image_url,
    start_date, end_date,
    manager_id, created_at, updated_at
)
SELECT
    'Beach Cleanup Day',
    'Join us to clean up our local beach and protect marine life. Gloves and bags will be provided.',
    'Sunnyvale Beach, Main Entrance',
    'https://i.imgur.com/example-beach.jpg',
    TIMESTAMP '2025-11-20 09:00:00',
    TIMESTAMP '2025-11-20 12:00:00',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM events WHERE name = 'Beach Cleanup Day'
);

INSERT INTO events (
    name, description, location, image_url,
    start_date, end_date,
    manager_id, created_at, updated_at
)
SELECT
    'Run for Hope Charity Marathon',
    'Annual 5K marathon to raise funds for the children''s hospital. All participants get a t-shirt!',
    'City Center Park',
    'https://i.imgur.com/example-marathon.jpg',
    TIMESTAMP '2025-12-05 08:00:00',
    TIMESTAMP '2025-12-05 11:00:00',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM events WHERE name = 'Run for Hope Charity Marathon'
);

INSERT INTO events (
    name, description, location, image_url,
    start_date, end_date,
    manager_id, created_at, updated_at
)
SELECT
    'Code for a Cause Workshop',
    'A workshop teaching basic web development skills to help non-profits build their websites.',
    'Community Tech Hub, 123 Main St',
    'https://i.imgur.com/example-code.jpg',
    TIMESTAMP '2025-12-10 10:00:00',
    TIMESTAMP '2025-12-10 16:00:00',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM events WHERE name = 'Code for a Cause Workshop'
);


-- ======================
-- LINK EVENTS TO CATEGORIES
-- ======================
INSERT INTO events_categories (event_id, category_id)
SELECT
    e.id,
    c.id
FROM events e
JOIN categories c ON c.name = 'Environment'
WHERE e.name = 'Beach Cleanup Day'
  AND NOT EXISTS (
    SELECT 1 FROM events_categories ec
    WHERE ec.event_id = e.id AND ec.category_id = c.id
);

INSERT INTO events_categories (event_id, category_id)
SELECT
    e.id,
    c.id
FROM events e
JOIN categories c ON c.name = 'Health'
WHERE e.name = 'Run for Hope Charity Marathon'
  AND NOT EXISTS (
    SELECT 1 FROM events_categories ec
    WHERE ec.event_id = e.id AND ec.category_id = c.id
);

INSERT INTO events_categories (event_id, category_id)
SELECT
    e.id,
    c.id
FROM events e
JOIN categories c ON c.name IN ('Education', 'Community')
WHERE e.name = 'Code for a Cause Workshop'
  AND NOT EXISTS (
    SELECT 1 FROM events_categories ec
    WHERE ec.event_id = e.id AND ec.category_id = c.id
);


-- ======================
-- INSERT EVENT CREATE REQUESTS (PENDING)
-- ======================
INSERT INTO event_create_requests (
    name, description, location, image_url,
    start_date, end_date,
    status, manager_id,
    created_at, updated_at
)
SELECT
    'Community Park Planting Day',
    'Let''s plant new trees and flowers in the local park. This event is open to all ages.',
    'City Park, North Entrance',
    'https://i.imgur.com/example-plant.jpg',
    TIMESTAMP '2026-01-15 10:00:00',
    TIMESTAMP '2026-01-15 14:00:00',
    'PENDING',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM event_create_requests WHERE name = 'Community Park Planting Day'
);

INSERT INTO event_create_requests (
    name, description, location, image_url,
    start_date, end_date,
    status, manager_id,
    created_at, updated_at
)
SELECT
    'Fundraising Bake Sale for Shelter',
    'Raising money for the animal shelter. All proceeds go directly to helping animals in need.',
    'Town Hall Square',
    'https://i.imgur.com/example-bake.jpg',
    TIMESTAMP '2026-01-20 11:00:00',
    TIMESTAMP '2026-01-20 16:00:00',
    'PENDING',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM event_create_requests WHERE name = 'Fundraising Bake Sale for Shelter'
);

INSERT INTO event_create_requests (
    name, description, location, image_url,
    start_date, end_date,
    status, manager_id,
    created_at, updated_at
)
SELECT
    'Elderly Home Visit',
    'Spend an afternoon with residents at the SunnyDays Elderly Home.',
    'SunnyDays Elderly Home, 456 Old Rd',
    'https://i.imgur.com/example-visit.jpg',
    TIMESTAMP '2026-01-22 14:00:00',
    TIMESTAMP '2026-01-22 17:00:00',
    'PENDING',
    u.id,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'manager@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM event_create_requests WHERE name = 'Elderly Home Visit'
);
