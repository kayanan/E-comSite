package com.kayanan.springecom.model.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.Date;
@Builder
public record AddOrUpdateProductRequest(
     String name,
     String description,
     String brand,
     BigDecimal price,
     String category,
     Date releaseDate,
     boolean productAvailable,
     int stockQuantity
    ) {
}
