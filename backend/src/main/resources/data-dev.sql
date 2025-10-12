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
