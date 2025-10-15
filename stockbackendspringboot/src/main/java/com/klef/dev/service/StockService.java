package com.klef.dev.service;

import java.util.List;
import com.klef.dev.entity.Stock;

public interface StockService {
    Stock addStock(Stock stock);
    List<Stock> getAllStocks();
    Stock getStockById(int id);
    Stock updateStock(Stock stock);
    void deleteStockById(int id);
}
