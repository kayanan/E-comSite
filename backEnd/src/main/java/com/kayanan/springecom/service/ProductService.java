package com.kayanan.springecom.service;

import com.kayanan.springecom.model.Product;
import com.kayanan.springecom.model.dto.AddOrUpdateProductRequest;
import com.kayanan.springecom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product getProductById(int id) {
        return productRepo.findById(id).orElse(new Product(-1));
    }

    public Product addOrUpdateProduct(AddOrUpdateProductRequest productRequest, MultipartFile image) throws IOException {
        Product product=Product.builder()
                .category(productRequest.category())
                .description(productRequest.description())
                .stockQuantity(productRequest.stockQuantity())
                .releaseDate(productRequest.releaseDate())
                .productAvailable(productRequest.productAvailable())
                .name(productRequest.name())
                .price(productRequest.price())
                .brand(productRequest.brand())
                .imageType(image.getContentType())
                .imageName(image.getOriginalFilename())
                .imageData(image.getBytes())
                .build();

        return productRepo.save(product);
    }


    public void deleteProduct(int id) {
        productRepo.deleteById(id);
    }


    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }
}
