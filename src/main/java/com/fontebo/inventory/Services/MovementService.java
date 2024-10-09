package com.fontebo.inventory.Services;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
import java.util.Map;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class MovementService {

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private ProductRepository productRepository;

        @PersistenceContext
    private EntityManager entityManager;

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

    public List<Movement> movementFilter( LocalDateTime startDate, LocalDateTime endDate) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movement> query = cb.createQuery(Movement.class);
        Root<Movement> root = query.from(Movement.class);
        if(startDate==null||endDate==null){
            query.select(root);
        }
        else{query.select(root).where(cb.between(root.get("movementDate"), startDate, endDate));}
        
     
        return entityManager.createQuery(query).getResultList();
    }

    public Page<MovementListRecord> getItems(Pageable pageable, LocalDateTime startDate, LocalDateTime endDate) {
        if(startDate==null||endDate==null){
            return movementRepository.findAll(pageable).map(MovementListRecord::new);

        }else{
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movement> query = cb.createQuery(Movement.class);
        Root<Movement> root = query.from(Movement.class);
     
        query.select(root).where(cb.between(root.get("movementDate"), startDate, endDate));
        List<MovementListRecord> movementListRecord = entityManager.createQuery(query)
                .getResultList()
                .stream()
                .map(MovementListRecord::new)
                .collect(Collectors.toList());

        int total = movementListRecord.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);

        Page<MovementListRecord> page = new PageImpl<>(movementListRecord.subList(start, end), pageable, total);
        return page;}
        
    }

    public Page<MovementListRecord> getItemsByProduct(Pageable pageable, Long id,LocalDateTime startDate, LocalDateTime endDate) {
        if(startDate==null||endDate==null){
            return movementRepository.findByProductId(pageable,id).map(MovementListRecord::new);

        }else{
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movement> query = cb.createQuery(Movement.class);
        Root<Movement> root = query.from(Movement.class);
        query.select(root)
        .where(cb.and(
            cb.between(root.get("movementDate"), startDate, endDate),
            cb.equal(root.get("id"), id)
        ));
        List<MovementListRecord> movementListRecord = entityManager.createQuery(query)
                .getResultList()
                .stream()
                .map(MovementListRecord::new)
                .collect(Collectors.toList());

        int total = movementListRecord.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);

        Page<MovementListRecord> page = new PageImpl<>(movementListRecord.subList(start, end), pageable, total);
        return page;}
        
    }

}
