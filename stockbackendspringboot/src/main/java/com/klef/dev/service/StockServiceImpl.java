package com.klef.dev.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.dev.entity.Stock;
import com.klef.dev.repository.StockRepository;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Override
    public Stock addStock(Stock stock) {
        return stockRepository.save(stock);
    }

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Override
    public Stock getStockById(int id) {
        Optional<Stock> opt = stockRepository.findById(id);
        return opt.orElse(null);
    }

    @Override
    public Stock updateStock(Stock stock) {
        return stockRepository.save(stock);
    }

    @Override
    public void deleteStockById(int id) {
        stockRepository.deleteById(id);
    }
}
