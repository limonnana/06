package com.limonnana.web.rest;

import static com.limonnana.domain.EventAsserts.*;
import static com.limonnana.web.rest.TestUtil.createUpdateProxyForBean;
import static com.limonnana.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.limonnana.IntegrationTest;
import com.limonnana.domain.Event;
import com.limonnana.repository.EventRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventResourceIT {

    private static final BigDecimal DEFAULT_SALDO = new BigDecimal(1);
    private static final BigDecimal UPDATED_SALDO = new BigDecimal(2);

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_OF_EVENT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OF_EVENT = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMockMvc;

    private Event event;

    private Event insertedEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createEntity() {
        return new Event().saldo(DEFAULT_SALDO).amount(DEFAULT_AMOUNT).description(DEFAULT_DESCRIPTION).dateOfEvent(DEFAULT_DATE_OF_EVENT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createUpdatedEntity() {
        return new Event().saldo(UPDATED_SALDO).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION).dateOfEvent(UPDATED_DATE_OF_EVENT);
    }

    @BeforeEach
    void initTest() {
        event = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedEvent != null) {
            eventRepository.delete(insertedEvent);
            insertedEvent = null;
        }
    }

    @Test
    @Transactional
    void createEvent() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Event
        var returnedEvent = om.readValue(
            restEventMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Event.class
        );

        // Validate the Event in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEventUpdatableFieldsEquals(returnedEvent, getPersistedEvent(returnedEvent));

        insertedEvent = returnedEvent;
    }

    @Test
    @Transactional
    void createEventWithExistingId() throws Exception {
        // Create the Event with an existing ID
        event.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSaldoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        event.setSaldo(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        event.setAmount(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateOfEventIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        event.setDateOfEvent(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEvents() throws Exception {
        // Initialize the database
        insertedEvent = eventRepository.saveAndFlush(event);

        // Get all the eventList
        restEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(event.getId().intValue())))
            .andExpect(jsonPath("$.[*].saldo").value(hasItem(sameNumber(DEFAULT_SALDO))))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dateOfEvent").value(hasItem(DEFAULT_DATE_OF_EVENT.toString())));
    }

    @Test
    @Transactional
    void getEvent() throws Exception {
        // Initialize the database
        insertedEvent = eventRepository.saveAndFlush(event);

        // Get the event
        restEventMockMvc
            .perform(get(ENTITY_API_URL_ID, event.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(event.getId().intValue()))
            .andExpect(jsonPath("$.saldo").value(sameNumber(DEFAULT_SALDO)))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.dateOfEvent").value(DEFAULT_DATE_OF_EVENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEvent() throws Exception {
        // Get the event
        restEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEvent() throws Exception {
        // Initialize the database
        insertedEvent = eventRepository.saveAndFlush(event);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the event
        Event updatedEvent = eventRepository.findById(event.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEvent are not directly saved in db
        em.detach(updatedEvent);
        updatedEvent.saldo(UPDATED_SALDO).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION).dateOfEvent(UPDATED_DATE_OF_EVENT);

        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEventToMatchAllProperties(updatedEvent);
    }

    @Test
    @Transactional
    void putNonExistingEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        event.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(put(ENTITY_API_URL_ID, event.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        event.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        event.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(event)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventWithPatch() throws Exception {
        // Initialize the database
        insertedEvent = eventRepository.saveAndFlush(event);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the event using partial update
        Event partialUpdatedEvent = new Event();
        partialUpdatedEvent.setId(event.getId());

        partialUpdatedEvent.saldo(UPDATED_SALDO).description(UPDATED_DESCRIPTION);

        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEventUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedEvent, event), getPersistedEvent(event));
    }

    @Test
    @Transactional
    void fullUpdateEventWithPatch() throws Exception {
        // Initialize the database
        insertedEvent = eventRepository.saveAndFlush(event);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the event using partial update
        Event partialUpdatedEvent = new Event();
        partialUpdatedEvent.setId(event.getId());

        partialUpdatedEvent.saldo(UPDATED_SALDO).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION).dateOfEvent(UPDATED_DATE_OF_EVENT);

        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEventUpdatableFieldsEquals(partialUpdatedEvent, getPersistedEvent(partialUpdatedEvent));
    }

    @Test
    @Transactional
    void patchNonExistingEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        event.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, event.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        event.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        event.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(event)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Event in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvent() throws Exception {
        // Initialize the database
        insertedEvent = eventRepository.saveAndFlush(event);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the event
        restEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, event.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return eventRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Event getPersistedEvent(Event event) {
        return eventRepository.findById(event.getId()).orElseThrow();
    }

    protected void assertPersistedEventToMatchAllProperties(Event expectedEvent) {
        assertEventAllPropertiesEquals(expectedEvent, getPersistedEvent(expectedEvent));
    }

    protected void assertPersistedEventToMatchUpdatableProperties(Event expectedEvent) {
        assertEventAllUpdatablePropertiesEquals(expectedEvent, getPersistedEvent(expectedEvent));
    }
}
