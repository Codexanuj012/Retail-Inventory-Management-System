USE rims_db;

-- Insert System Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full access to system configuration and all modules'),
(2, 'Manager', 'Access to inventory, reports, and operational management'),
(3, 'Staff', 'Limited access to view inventory and process orders')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Default Admin User
INSERT INTO users (id, role_id, first_name, last_name, email, password_hash, phone, is_active) VALUES
(1, 1, 'System', 'Admin', 'admin@rims.local', '$2a$10$wN30E3rL/QZ2S1e0M1R4x.w1o9L9T9zO1y1O1y1O1y1O1y1O1y1O1', '1234567890', TRUE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Insert Initial Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Electronics', 'Consumer electronics and accessories'),
(2, 'Apparel', 'Clothing and garments'),
(3, 'Home & Kitchen', 'Home appliances and kitchenware')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Initial Warehouse
INSERT INTO warehouses (id, name, location) VALUES
(1, 'Main Warehouse', 'Building A, Industrial Zone 1')
ON DUPLICATE KEY UPDATE name=VALUES(name);