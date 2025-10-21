package com.limonnana.repository;

import com.limonnana.domain.Investment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Investment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {}
