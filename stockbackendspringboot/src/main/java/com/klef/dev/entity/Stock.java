package com.klef.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stock_table")
public class Stock {

  @Id
  @Column(name = "stock_id")
  private int id; // manual, like Student

  @Column(name = "stock_name", nullable = false, length = 100)
  private String name;

  @Column(name = "stock_price", nullable = false)
  private double price;

  // "INC" or "DEC"
  @Column(name = "stock_state", nullable = false, length = 3)
  private String state;

  @Column(name = "stock_investment", nullable = false)
  private double investment;

  // ---- getters & setters ----
  public int getId() { return id; }
  public void setId(int id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public double getPrice() { return price; }
  public void setPrice(double price) { this.price = price; }

  public String getState() { return state; }
  public void setState(String state) { this.state = state; }

  public double getInvestment() { return investment; }
  public void setInvestment(double investment) { this.investment = investment; }

  @Override
  public String toString() {
    return "Stock [id=" + id + ", name=" + name + ", price=" + price +
           ", state=" + state + ", investment=" + investment + "]";
  }
}
