package com.limonnana.repository;

import com.limonnana.domain.Event;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Event entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByIdDesc();

    Event findFirstByOrderByIdDesc();
}
