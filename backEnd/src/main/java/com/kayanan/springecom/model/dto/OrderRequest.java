package com.kayanan.springecom.model.dto;

import lombok.Builder;

import java.util.List;
@Builder
public record OrderRequest(
        String customerName,
        String email,
        List<OrderItemRequest> items
) {
}
