package com.limonnana.repository;

import com.limonnana.domain.Miscellaneous;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Miscellaneous entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MiscellaneousRepository extends JpaRepository<Miscellaneous, Long> {}
