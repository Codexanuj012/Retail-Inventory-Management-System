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
      SELECT u.id, u.role_id, r.name as role_name, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.created_at, u.updated_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findAll({ limit, offset, search, role_id }) {
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)');
      const searchParam = `%${search}%`;
      queryParams.push(searchParam, searchParam, searchParam);
    }

    if (role_id) {
      whereConditions.push('u.role_id = ?');
      queryParams.push(role_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM users u ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, queryParams);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT u.id, u.role_id, r.name as role_name, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Convert limit and offset to integers for execute bindings
    queryParams.push(String(limit), String(offset));
    
    const [rows] = await pool.query(dataQuery, queryParams);

    return { users: rows, total };
  }

  static async create(userData) {
    const { role_id, first_name, last_name, email, password_hash, phone } = userData;
    const query = `
      INSERT INTO users (role_id, first_name, last_name, email, password_hash, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      role_id || 3, // Default to Staff (3)
      first_name,
      last_name,
      email,
      password_hash,
      phone || null
    ]);
    return result.insertId;
  }

  static async update(id, updateData) {
    const { first_name, last_name, phone, role_id, is_active } = updateData;
    const query = `
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, role_id = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      first_name,
      last_name,
      phone || null,
      role_id,
      is_active,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;