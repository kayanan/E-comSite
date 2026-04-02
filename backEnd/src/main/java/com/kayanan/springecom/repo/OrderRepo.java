package com.kayanan.springecom.repo;

import com.kayanan.springecom.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderId(String orderId);
    List<Order> findByCustomerName(String customerName);

}
