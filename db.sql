CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT CHECK (status IN ('OPEN', 'ORDERED')) NOT NULL
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  count INT NOT NULL DEFAULT 1
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    cart_id UUID UNIQUE REFERENCES carts(id) ON DELETE CASCADE,
    payment JSON NOT NULL,
    delivery JSON NOT NULL,
    comments TEXT,
    status TEXT CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')) NOT NULL,
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (id, email, password, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'TEST_PASSWORD', 'User1'),
    ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'TEST_PASSWORD', 'User2'),
	('44444444-4444-4444-4444-444444444444', 'bob2@example.com', 'TEST_PASSWORD', 'User3');

INSERT INTO products (id, title, description, price) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Drone X1', 'High-performance drone with 4K camera and GPS', 599.99),
  ('22222222-2222-2222-2222-222222222222', 'Drone X2', 'Mid-range drone with HD camera and 30-minute flight time', 399.99),
  ('33333333-3333-3333-3333-333333333333', 'Drone X3', 'Entry-level drone with basic features', 199.99),
  ('44444444-4444-4444-4444-444444444444', 'Drone Pro 5000', 'Professional-grade drone for aerial photography with 8K camera', 999.99),
  ('55555555-5555-5555-5555-555555555555', 'Drone Mini', 'Compact drone perfect for beginners, with foldable arms', 149.99),
  ('9f244885-802d-4c0c-b06f-6b6b7ae43929', 'Item 2 from task 6', 'Description for Item 2', 29.00),
  ('746259f5-4e20-49c9-8f68-147434c7e6cc', 'Item 3 from task 6', 'Description for Item 3', 39.00),
  ('6ee3c642-2a0a-411c-aad5-1ee78f4abf96', 'Item 5 from task 6', 'Description for Item 5', 59.00),
  ('a0a27e73-988b-4e34-992d-3005c34acd58', 'Item 1 from task 6', 'Description for Item 1', 19.00),
  ('39d06635-018d-4df6-89a8-e19844d8ad9f', 'Item 4 from task 6', 'Description for Item 4', 49.00),
  ('a25e6d08-4318-4d66-bd08-2660d4001630', 'Item 6 from task 6', 'Description for Item 6', 69.00);

-- Insert test data
INSERT INTO carts (id, user_id, status) VALUES
    ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'OPEN'),
    ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count) VALUES
    ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 2),
    ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 3),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 1),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 4),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 5);


-- Insert test data
INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
     '{"method": "credit_card", "transaction_id": "txn_12345"}'::json,
     '{"address": "123 Main St, City", "eta": "2025-04-01"}'::json,
     'Please deliver in the morning', 'PAID', 100.50),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333',
     '{"method": "paypal", "transaction_id": "txn_67890"}'::json,
     '{"address": "456 Another St, City", "eta": "2025-04-02"}'::json,
     NULL, 'SHIPPED', 250.75);

