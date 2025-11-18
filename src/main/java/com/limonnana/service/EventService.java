package com.limonnana.service;

import com.limonnana.domain.Event;
import com.limonnana.repository.EventRepository;
import com.limonnana.repository.InvestmentRepository;
import com.limonnana.web.rest.InvestmentResource;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.limonnana.domain.Event}.
 */
@Service
@Transactional
public class EventService {

    private static final Logger LOG = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;

    private final InvestmentService investmentService;

    private final UtilsService utilsService;

    public EventService(EventRepository eventRepository, InvestmentService investmentService, UtilsService utilsService) {
        this.eventRepository = eventRepository;
        this.investmentService = investmentService;
        this.utilsService = utilsService;
    }

    /**
     * Save a event.
     *
     * @param event the entity to save.
     * @return the persisted entity.
     */
    public Event save(Event event) {
        LOG.debug("Request to save Event : {}", event);
        setSaldo(event);
        Event e = eventRepository.save(event);
        utilsService.writerToFile(e.toString());
        return e;
    }

    private void setSaldo(Event event) {
        Event lastOldEvent = eventRepository.findFirstByOrderByIdDesc();
        BigDecimal oldSaldo = lastOldEvent.getSaldo();
        BigDecimal newSaldo = oldSaldo.add(event.getAmount());
        event.setSaldo(newSaldo);
    }

    public BigDecimal getSaldo() {
        Event lastEvent = eventRepository.findFirstByOrderByIdDesc();
        return lastEvent.getSaldo();
    }

    public BigDecimal getSaldoTotal() {
        BigDecimal saldo = getSaldo();
        BigDecimal investmentTotal = investmentService.getTotalInvestments();
        BigDecimal saldoTotal = saldo.add(investmentTotal);
        return saldoTotal;
    }

    /**
     * Update a event.
     *
     * @param event the entity to save.
     * @return the persisted entity.
     */
    public Event update(Event event) {
        LOG.debug("Request to update Event : {}", event);
        return eventRepository.save(event);
    }

    /**
     * Partially update a event.
     *
     * @param event the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Event> partialUpdate(Event event) {
        LOG.debug("Request to partially update Event : {}", event);

        return eventRepository
            .findById(event.getId())
            .map(existingEvent -> {
                if (event.getSaldo() != null) {
                    existingEvent.setSaldo(event.getSaldo());
                }
                if (event.getAmount() != null) {
                    existingEvent.setAmount(event.getAmount());
                }
                if (event.getDescription() != null) {
                    existingEvent.setDescription(event.getDescription());
                }
                if (event.getDateOfEvent() != null) {
                    existingEvent.setDateOfEvent(event.getDateOfEvent());
                }

                return existingEvent;
            })
            .map(eventRepository::save);
    }

    /**
     * Get all the events.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Event> findAll() {
        LOG.debug("Request to get all Events");
        return eventRepository.findAllByOrderByIdDesc();
    }

    /**
     * Get one event by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Event> findOne(Long id) {
        LOG.debug("Request to get Event : {}", id);
        return eventRepository.findById(id);
    }

    /**
     * Delete the event by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }
}
