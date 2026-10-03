const Category = require('../models/Category');

class CategoryService {
  static async getAllCategories() {
    return await Category.findAll();
  }

  static async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  static async createCategory(categoryData) {
    const existing = await Category.findByName(categoryData.name);
    if (existing) {
      const error = new Error('Category name already exists.');
      error.statusCode = 400;
      throw error;
    }

    const id = await Category.create(categoryData);
    return await Category.findById(id);
  }

  static async updateCategory(id, categoryData) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      throw error;
    }

    await Category.update(id, {
      name: categoryData.name || category.name,
      description: categoryData.description !== undefined ? categoryData.description : category.description,
      is_active: categoryData.is_active !== undefined ? categoryData.is_active : category.is_active
    });

    return await Category.findById(id);
  }

  static async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      throw error;
    }

    return await Category.delete(id);
  }
}

module.exports = CategoryService;