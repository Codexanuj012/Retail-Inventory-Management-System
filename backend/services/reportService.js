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

  static async getInventoryValuationReport() {
    const valuation = await Report.getInventoryValuation();
    
    let totalCostValuation = 0;
    let totalRetailValuation = 0;

    const formattedData = valuation.map(item => {
      const costVal = parseFloat(item.total_cost_value || 0);
      const retailVal = parseFloat(item.total_retail_value || 0);

      totalCostValuation += costVal;
      totalRetailValuation += retailVal;

      return {
        ...item,
        total_cost_value: costVal.toFixed(2),
        total_retail_value: retailVal.toFixed(2)
      };
    });

    return {
      summary: {
        totalCostValuation: totalCostValuation.toFixed(2),
        totalRetailValuation: totalRetailValuation.toFixed(2),
        potentialProfit: (totalRetailValuation - totalCostValuation).toFixed(2)
      },
      items: formattedData
    };
  }

  static async getSalesReport(dateRange) {
    const sales = await Report.getSalesReport(dateRange);
    
    const totalSalesAmount = sales.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    return {
      summary: {
        totalOrders: sales.length,
        totalSalesAmount: totalSalesAmount.toFixed(2)
      },
      orders: sales
    };
  }
}

module.exports = ReportService;