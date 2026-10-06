const { pool } = require('../config/db');

class AuditLog {
  static async create(logData, connection = pool) {
    const { user_id, action, entity, entity_id, details, ip_address } = logData;
    const query = `
      INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      user_id || null,
      action,
      entity,
      entity_id || null,
      details ? JSON.stringify(details) : null,
      ip_address || null
    ]);
    return result.insertId;
  }

  static async findAll({ limit, offset, user_id, entity, action }) {
    let whereConditions = [];
    let queryParams = [];

    if (user_id) {
      whereConditions.push('al.user_id = ?');
      queryParams.push(user_id);
    }

    if (entity) {
      whereConditions.push('al.entity = ?');
      queryParams.push(entity);
    }

    if (action) {
      whereConditions.push('al.action = ?');
      queryParams.push(action);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM audit_logs al ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, queryParams);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT 
        al.id, al.user_id, CONCAT(u.first_name, ' ', u.last_name) as user_name,
        al.action, al.entity, al.entity_id, al.details, al.ip_address, al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(String(limit), String(offset));
    const [rows] = await pool.query(dataQuery, queryParams);

    return { logs: rows, total };
  }
}

module.exports = AuditLog;