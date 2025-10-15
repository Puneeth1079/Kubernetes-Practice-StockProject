package com.klef.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.dev.entity.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer>
{
    // analogous to email/contact lookups, but for stocks
    Stock findByName(String name);
    Stock findByState(String state); // "INC" or "DEC"
}
