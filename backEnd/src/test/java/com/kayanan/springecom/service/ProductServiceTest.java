package com.kayanan.springecom.service;

import com.kayanan.springecom.model.Product;
import com.kayanan.springecom.model.dto.AddOrUpdateProductRequest;
import com.kayanan.springecom.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOException;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    private  ProductRepo testProductRepo;

    @InjectMocks
    private ProductService testProductService;

    private Product testProduct;
    private AddOrUpdateProductRequest testAddOrUpdateProductRequest;
    @Mock
    private MultipartFile testImage;


    @BeforeEach
    void setUp() {
        testProduct= Product.builder()
                .id(1)
                .brand("Samsung")
                .category("Mobile")
                .description("iphone 14 pro 12gb ram 128 gb memory")
                .price(new BigDecimal("245000"))
                .imageData(null)
                .name("i phone")
                .productAvailable(true)
                .imageName("I phone14")
                .imageType("image/jpeg")
                .releaseDate(new Date())
                .stockQuantity(12)
                .build();
        testAddOrUpdateProductRequest= AddOrUpdateProductRequest.builder()
                .brand("Samsung")
                .category("Mobile")
                .description("iphone 14 pro 12gb ram 128 gb memory")
                .price(new BigDecimal("245000"))
                .name("i phone")
                .productAvailable(true)
                .releaseDate(new Date())
                .stockQuantity(12)
                .build();

    }


    @Test
    void getAllProducts() {
    }

    @Test
    void getProductById() {
    }

    @Test
    void addOrUpdateProduct() throws IOException {
        when(testImage.getContentType()).thenReturn("image/png");
        when(testImage.getOriginalFilename()).thenReturn("iphone.png");
        when(testImage.getBytes()).thenReturn("test-image".getBytes());
        when(testProductRepo.save(any(Product.class))).thenReturn(testProduct);

       Product result= testProductService.addOrUpdateProduct(testAddOrUpdateProductRequest,testImage);
        System.out.println(result);
        System.out.println(testProduct);
        assertNotNull(result);
        assertEquals(testProduct,result);
        verify(testProductRepo,times(1)).save(testProduct);

    }

    @Test
    void deleteProduct() {
    }

    @Test
    void searchProducts() {
    }
}