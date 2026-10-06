const Report = require('../models/Report');

class ReportService {
  static async getDashboardMetrics() {
    const overview = await Report.getOverviewStats();
    const lowStockAlerts = await Report.getLowStockAlerts(10);
    const recentMovements = await Report.getRecentStockMovements(10);
    const recentOrders = await Report.getRecentOrders(5);

    return {
      overview: {
        totalProducts: Number(overview.total_products),
        totalCategories: Number(overview.total_categories),
        totalWarehouses: Number(overview.total_warehouses),
        totalSuppliers: Number(overview.total_suppliers),
        totalInventoryItems: Number(overview.total_inventory_items),
        totalSalesOrders: Number(overview.total_sales_orders),
        totalRevenue: parseFloat(overview.total_revenue).toFixed(2)
      },
      lowStockAlerts,
      recentMovements,
      recentOrders
    };
  }
}

module.exports = ReportService;