package com.kayanan.springecom.controller;

import com.kayanan.springecom.config.SecurityConfig;
import com.kayanan.springecom.model.Order;
import com.kayanan.springecom.model.Product;
import com.kayanan.springecom.model.dto.OpenAiRequest;
import com.kayanan.springecom.repo.OrderRepo;
import com.kayanan.springecom.repo.ProductRepo;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ChatbotController {
    @Autowired
    private OpenAiChatModel model;
    @Autowired
    private OrderRepo oderRepo;
    @Autowired
    private ProductRepo productrepo;


    @PostMapping("/openai")
    public ResponseEntity<String> getAnswer(@RequestBody OpenAiRequest request){
        List<String> products= Collections.emptyList();

        List< String > orders=oderRepo.findByCustomerName(SecurityContextHolder.getContext().getAuthentication().getName())
                .stream()
                .map(order -> "OrderId: " + order.getOrderId() +
                        ", Order status: " + order.getStatus())
                .toList();
        try {
             products=productrepo.findProducts(request.message())
                     .stream()
                     .map(product ->
                             "Name: " + product.getName() +
                                     ", Price: " + product.getPrice() +
                                     ", Available: " + product.isProductAvailable() +
                                     ", Stock: " + product.getStockQuantity()
                     )
                     .toList();
        }
        catch (Exception e){
            System.out.println(e);
        }

        String context=orders.toString() + products.toString();
        String prompt = """
                You are a helpful e-commerce assistant.
                Answer only from the context below.
                if you find any thing about products then don't mention about orders
                if you found any thing about orders then don't mention details about products

                Context:
                %s

                Question:
                %s
                """.formatted(context, request.message());
        System.out.println(prompt);
        String response=model.call(prompt);

        return ResponseEntity.ok(response);


    }

}
