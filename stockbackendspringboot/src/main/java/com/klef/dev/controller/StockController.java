package com.klef.dev.controller;

import com.klef.dev.entity.Stock;
import com.klef.dev.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stockapi")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/")
    public String home() {
        return "Stock API is running";
    }

    @PostMapping("/add")
    public ResponseEntity<Stock> addStock(@RequestBody Stock stock) {
        Stock saved = stockService.addStock(stock);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Stock>> getAllStocks() {
        List<Stock> stocks = stockService.getAllStocks();
        return new ResponseEntity<>(stocks, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getStockById(@PathVariable int id) {
        Stock s = stockService.getStockById(id);
        if (s != null) {
            return new ResponseEntity<>(s, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Stock with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateStock(@RequestBody Stock stock) {
        // ID is primitive int in our entity; just check existence
        Stock existing = stockService.getStockById(stock.getId());
        if (existing != null) {
            Stock updated = stockService.updateStock(stock);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot update. Stock with ID " + stock.getId() + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStock(@PathVariable int id) {
        Stock existing = stockService.getStockById(id);
        if (existing != null) {
            stockService.deleteStockById(id);
            return new ResponseEntity<>("Stock with ID " + id + " deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot delete. Stock with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }
}
