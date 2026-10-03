const { pool } = require('../config/db');

class Category {
  static async findAll() {
    const query = `
      SELECT id, name, description, is_active, created_at, updated_at
      FROM categories
      ORDER BY name ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, name, description, is_active, created_at, updated_at
      FROM categories
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByName(name) {
    const query = `SELECT id, name FROM categories WHERE name = ?`;
    const [rows] = await pool.execute(query, [name]);
    return rows[0] || null;
  }

  static async create(categoryData) {
    const { name, description } = categoryData;
    const query = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [name, description || null]);
    return result.insertId;
  }

  static async update(id, categoryData) {
    const { name, description, is_active } = categoryData;
    const query = `
      UPDATE categories
      SET name = ?, description = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name,
      description || null,
      is_active !== undefined ? is_active : true,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = `DELETE FROM categories WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Category;