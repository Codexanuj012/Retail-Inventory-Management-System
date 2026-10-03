const { pool } = require('../config/db');

class Product {
  static async findAll({ limit, offset, search, category_id, supplier_id, is_active }) {
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
      const searchParam = `%${search}%`;
      queryParams.push(searchParam, searchParam, searchParam);
    }

    if (category_id) {
      whereConditions.push('p.category_id = ?');
      queryParams.push(category_id);
    }

    if (supplier_id) {
      whereConditions.push('p.supplier_id = ?');
      queryParams.push(supplier_id);
    }

    if (is_active !== undefined) {
      whereConditions.push('p.is_active = ?');
      queryParams.push(is_active === 'true' || is_active === true ? 1 : 0);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM products p ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, queryParams);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT 
        p.id, p.category_id, c.name as category_name,
        p.supplier_id, s.name as supplier_name,
        p.sku, p.name, p.description, p.unit_price, p.cost_price,
        p.reorder_level, p.is_active, p.created_at, p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(String(limit), String(offset));
    const [rows] = await pool.query(dataQuery, queryParams);

    return { products: rows, total };
  }

  static async findById(id) {
    const query = `
      SELECT 
        p.id, p.category_id, c.name as category_name,
        p.supplier_id, s.name as supplier_name,
        p.sku, p.name, p.description, p.unit_price, p.cost_price,
        p.reorder_level, p.is_active, p.created_at, p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findBySku(sku) {
    const query = `SELECT id, sku FROM products WHERE sku = ?`;
    const [rows] = await pool.execute(query, [sku]);
    return rows[0] || null;
  }

  static async create(productData) {
    const { category_id, supplier_id, sku, name, description, unit_price, cost_price, reorder_level } = productData;
    const query = `
      INSERT INTO products (category_id, supplier_id, sku, name, description, unit_price, cost_price, reorder_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      category_id,
      supplier_id || null,
      sku,
      name,
      description || null,
      unit_price || 0.00,
      cost_price || 0.00,
      reorder_level || 10
    ]);
    return result.insertId;
  }

  static async update(id, productData) {
    const { category_id, supplier_id, sku, name, description, unit_price, cost_price, reorder_level, is_active } = productData;
    const query = `
      UPDATE products
      SET category_id = ?, supplier_id = ?, sku = ?, name = ?, description = ?, 
          unit_price = ?, cost_price = ?, reorder_level = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      category_id,
      supplier_id || null,
      sku,
      name,
      description || null,
      unit_price,
      cost_price,
      reorder_level,
      is_active,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = `DELETE FROM products WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;