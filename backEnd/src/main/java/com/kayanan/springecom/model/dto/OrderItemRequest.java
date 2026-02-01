package com.kayanan.springecom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {}
