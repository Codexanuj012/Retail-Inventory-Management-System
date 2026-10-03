const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductService {
  static async getAllProducts(params) {
    const { page, limit, offset, search, category_id, supplier_id, is_active } = params;
    return await Product.findAll({ limit, offset, search, category_id, supplier_id, is_active });
  }

  static async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  static async createProduct(productData) {
    const category = await Category.findById(productData.category_id);
    if (!category) {
      const error = new Error('Selected category does not exist.');
      error.statusCode = 400;
      throw error;
    }

    const existingSku = await Product.findBySku(productData.sku);
    if (existingSku) {
      const error = new Error('Product with this SKU already exists.');
      error.statusCode = 400;
      throw error;
    }

    const id = await Product.create(productData);
    return await Product.findById(id);
  }

  static async updateProduct(id, productData) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    await Product.update(id, {
      category_id: productData.category_id || product.category_id,
      supplier_id: productData.supplier_id !== undefined ? productData.supplier_id : product.supplier_id,
      sku: productData.sku || product.sku,
      name: productData.name || product.name,
      description: productData.description !== undefined ? productData.description : product.description,
      unit_price: productData.unit_price !== undefined ? productData.unit_price : product.unit_price,
      cost_price: productData.cost_price !== undefined ? productData.cost_price : product.cost_price,
      reorder_level: productData.reorder_level !== undefined ? productData.reorder_level : product.reorder_level,
      is_active: productData.is_active !== undefined ? productData.is_active : product.is_active
    });

    return await Product.findById(id);
  }

  static async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    return await Product.delete(id);
  }
}

module.exports = ProductService;