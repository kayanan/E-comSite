package com.kayanan.springecom.service;

import com.kayanan.springecom.model.Order;
import com.kayanan.springecom.model.OrderItem;
import com.kayanan.springecom.model.Product;
import com.kayanan.springecom.model.dto.OrderItemRequest;
import com.kayanan.springecom.model.dto.OrderItemResponse;
import com.kayanan.springecom.model.dto.OrderRequest;
import com.kayanan.springecom.model.dto.OrderResponse;
import com.kayanan.springecom.repo.OrderRepo;
import com.kayanan.springecom.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock
    private ProductRepo productRepo;
    @Mock
    private OrderRepo orderRepo;
    @InjectMocks
    private OrderService orderService;

    private OrderRequest orderRequest;
    private Order order;
    private OrderItem orderItem;
    private Product product;
    private OrderItemResponse orderItemResponse;
    private OrderItemRequest orderItemRequest;
    private OrderResponse orderResponse;

    @BeforeEach
    void setup(){
        this.orderRequest=OrderRequest.builder()
                .customerName("kayanan")
                .email("kayanan96@gmail.com")
                .items(List.of(this.orderItemRequest))
                .build();

        this.order=Order.builder()
                .orderId("ORD001")
                .customerName("Kayanan")
                .id(1L)
                .email("kayanan96@gmail.com")
                .orderDate(LocalDate.now())
                .orderItems(null)
                .status("PENDING")
                .build();


    }


    @Nested
    class PlaceOrderTests{
//        @Test
        void placeOrderSuccessfully(){
            //given

            //when
            //then
        }
    }
}