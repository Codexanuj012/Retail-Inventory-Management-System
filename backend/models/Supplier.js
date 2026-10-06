const { pool } = require('../config/db');

class Supplier {
  static async findAll({ limit, offset, search, is_active }) {
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(name LIKE ? OR contact_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const searchParam = `%${search}%`;
      queryParams.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (is_active !== undefined) {
      whereConditions.push('is_active = ?');
      queryParams.push(is_active === 'true' || is_active === true ? 1 : 0);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM suppliers ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, queryParams);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT id, name, contact_name, email, phone, address, is_active, created_at, updated_at
      FROM suppliers
      ${whereClause}
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(String(limit), String(offset));
    const [rows] = await pool.query(dataQuery, queryParams);

    return { suppliers: rows, total };
  }

  static async findById(id) {
    const query = `
      SELECT id, name, contact_name, email, phone, address, is_active, created_at, updated_at
      FROM suppliers
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const query = `SELECT id, email FROM suppliers WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  static async create(supplierData) {
    const { name, contact_name, email, phone, address } = supplierData;
    const query = `
      INSERT INTO suppliers (name, contact_name, email, phone, address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      name,
      contact_name || null,
      email || null,
      phone || null,
      address || null
    ]);
    return result.insertId;
  }

  static async update(id, supplierData) {
    const { name, contact_name, email, phone, address, is_active } = supplierData;
    const query = `
      UPDATE suppliers
      SET name = ?, contact_name = ?, email = ?, phone = ?, address = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name,
      contact_name || null,
      email || null,
      phone || null,
      address || null,
      is_active,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = `DELETE FROM suppliers WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Supplier;