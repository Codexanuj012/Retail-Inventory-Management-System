const { pool } = require('../config/db');

class User {
  static async findByEmail(email) {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `;
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = `
      SELECT u.id, u.role_id, r.name as role_name, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async create(userData) {
    const { role_id, first_name, last_name, email, password_hash, phone } = userData;
    const query = `
      INSERT INTO users (role_id, first_name, last_name, email, password_hash, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      role_id || 3, // Default to Staff role (3) if not specified
      first_name,
      last_name,
      email,
      password_hash,
      phone || null
    ]);
    return result.insertId;
  }
}

module.exports = User;