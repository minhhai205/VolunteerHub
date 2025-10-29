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