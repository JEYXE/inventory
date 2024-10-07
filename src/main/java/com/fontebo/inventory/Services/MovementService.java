package com.fontebo.inventory.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.fontebo.inventory.Exceptions.Exception;
import com.fontebo.inventory.Models.Movement;
import com.fontebo.inventory.Models.Product;
import com.fontebo.inventory.Records.MovementCreationRecord;
import com.fontebo.inventory.Records.MovementListRecord;
import com.fontebo.inventory.Repositories.MovementRepository;
import com.fontebo.inventory.Repositories.ProductRepository;

@Service
public class MovementService {

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private ProductRepository productRepository;

    public MovementListRecord createMovement(MovementCreationRecord movement) {
        Optional<Product> product = productRepository.findById(movement.productId());
        if (product.isPresent()) {
            var productPresent = product.get();
            var quantity = movement.quantity();
            var movementType = movement.movementType();

            if (movementType.name() == "entrada") {
                productPresent.setQuantity(productPresent.getQuantity() + quantity);
                productRepository.save(productPresent);
            } else {
                if (movementType.name() == "salida" && productPresent.getQuantity() - quantity < 0) {
                    throw new Exception("La cantidad del producto no puede quedar menor que cero");
                } else {
                    productPresent.setQuantity(productPresent.getQuantity() - quantity);
                    productRepository.save(productPresent);
                }
            }
            var date = movement.movementDate();
            var reason = movement.reason();
            var movementcreated = new Movement(productPresent, movementType, quantity, date,reason);
            movementRepository.save(movementcreated);
            return new MovementListRecord(movementcreated);
        }
        throw new Exception("Producto no existe en la base de datos");
    }

    public Page<MovementListRecord> getItems(Pageable pageable) {
        return movementRepository.findAll(pageable).map(MovementListRecord::new);
    }

    public Page<MovementListRecord> getItemsByProduct(Pageable pageable, Long id) {
        return movementRepository.findByProductId(pageable,id).map(MovementListRecord::new);
    }

}
