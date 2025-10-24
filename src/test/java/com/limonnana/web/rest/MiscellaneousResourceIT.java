package com.limonnana.web.rest;

import static com.limonnana.domain.MiscellaneousAsserts.*;
import static com.limonnana.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.limonnana.IntegrationTest;
import com.limonnana.domain.Miscellaneous;
import com.limonnana.repository.MiscellaneousRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link MiscellaneousResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MiscellaneousResourceIT {

    private static final LocalDate DEFAULT_LAST_UPDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LAST_UPDATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/miscellaneous";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MiscellaneousRepository miscellaneousRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMiscellaneousMockMvc;

    private Miscellaneous miscellaneous;

    private Miscellaneous insertedMiscellaneous;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Miscellaneous createEntity() {
        return new Miscellaneous().lastUpdate(DEFAULT_LAST_UPDATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Miscellaneous createUpdatedEntity() {
        return new Miscellaneous().lastUpdate(UPDATED_LAST_UPDATE);
    }

    @BeforeEach
    void initTest() {
        miscellaneous = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedMiscellaneous != null) {
            miscellaneousRepository.delete(insertedMiscellaneous);
            insertedMiscellaneous = null;
        }
    }

    @Test
    @Transactional
    void createMiscellaneous() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Miscellaneous
        var returnedMiscellaneous = om.readValue(
            restMiscellaneousMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(miscellaneous)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Miscellaneous.class
        );

        // Validate the Miscellaneous in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMiscellaneousUpdatableFieldsEquals(returnedMiscellaneous, getPersistedMiscellaneous(returnedMiscellaneous));

        insertedMiscellaneous = returnedMiscellaneous;
    }

    @Test
    @Transactional
    void createMiscellaneousWithExistingId() throws Exception {
        // Create the Miscellaneous with an existing ID
        miscellaneous.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMiscellaneousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(miscellaneous)))
            .andExpect(status().isBadRequest());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLastUpdateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        miscellaneous.setLastUpdate(null);

        // Create the Miscellaneous, which fails.

        restMiscellaneousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(miscellaneous)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMiscellaneous() throws Exception {
        // Initialize the database
        insertedMiscellaneous = miscellaneousRepository.saveAndFlush(miscellaneous);

        // Get all the miscellaneousList
        restMiscellaneousMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(miscellaneous.getId().intValue())))
            .andExpect(jsonPath("$.[*].lastUpdate").value(hasItem(DEFAULT_LAST_UPDATE.toString())));
    }

    @Test
    @Transactional
    void getMiscellaneous() throws Exception {
        // Initialize the database
        insertedMiscellaneous = miscellaneousRepository.saveAndFlush(miscellaneous);

        // Get the miscellaneous
        restMiscellaneousMockMvc
            .perform(get(ENTITY_API_URL_ID, miscellaneous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(miscellaneous.getId().intValue()))
            .andExpect(jsonPath("$.lastUpdate").value(DEFAULT_LAST_UPDATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMiscellaneous() throws Exception {
        // Get the miscellaneous
        restMiscellaneousMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMiscellaneous() throws Exception {
        // Initialize the database
        insertedMiscellaneous = miscellaneousRepository.saveAndFlush(miscellaneous);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the miscellaneous
        Miscellaneous updatedMiscellaneous = miscellaneousRepository.findById(miscellaneous.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMiscellaneous are not directly saved in db
        em.detach(updatedMiscellaneous);
        updatedMiscellaneous.lastUpdate(UPDATED_LAST_UPDATE);

        restMiscellaneousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMiscellaneous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMiscellaneous))
            )
            .andExpect(status().isOk());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMiscellaneousToMatchAllProperties(updatedMiscellaneous);
    }

    @Test
    @Transactional
    void putNonExistingMiscellaneous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        miscellaneous.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMiscellaneousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, miscellaneous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(miscellaneous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMiscellaneous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        miscellaneous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiscellaneousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(miscellaneous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMiscellaneous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        miscellaneous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiscellaneousMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(miscellaneous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMiscellaneousWithPatch() throws Exception {
        // Initialize the database
        insertedMiscellaneous = miscellaneousRepository.saveAndFlush(miscellaneous);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the miscellaneous using partial update
        Miscellaneous partialUpdatedMiscellaneous = new Miscellaneous();
        partialUpdatedMiscellaneous.setId(miscellaneous.getId());

        restMiscellaneousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMiscellaneous.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMiscellaneous))
            )
            .andExpect(status().isOk());

        // Validate the Miscellaneous in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMiscellaneousUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedMiscellaneous, miscellaneous),
            getPersistedMiscellaneous(miscellaneous)
        );
    }

    @Test
    @Transactional
    void fullUpdateMiscellaneousWithPatch() throws Exception {
        // Initialize the database
        insertedMiscellaneous = miscellaneousRepository.saveAndFlush(miscellaneous);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the miscellaneous using partial update
        Miscellaneous partialUpdatedMiscellaneous = new Miscellaneous();
        partialUpdatedMiscellaneous.setId(miscellaneous.getId());

        partialUpdatedMiscellaneous.lastUpdate(UPDATED_LAST_UPDATE);

        restMiscellaneousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMiscellaneous.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMiscellaneous))
            )
            .andExpect(status().isOk());

        // Validate the Miscellaneous in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMiscellaneousUpdatableFieldsEquals(partialUpdatedMiscellaneous, getPersistedMiscellaneous(partialUpdatedMiscellaneous));
    }

    @Test
    @Transactional
    void patchNonExistingMiscellaneous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        miscellaneous.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMiscellaneousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, miscellaneous.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(miscellaneous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMiscellaneous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        miscellaneous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiscellaneousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(miscellaneous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMiscellaneous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        miscellaneous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiscellaneousMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(miscellaneous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Miscellaneous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMiscellaneous() throws Exception {
        // Initialize the database
        insertedMiscellaneous = miscellaneousRepository.saveAndFlush(miscellaneous);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the miscellaneous
        restMiscellaneousMockMvc
            .perform(delete(ENTITY_API_URL_ID, miscellaneous.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return miscellaneousRepository.count();
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

    protected Miscellaneous getPersistedMiscellaneous(Miscellaneous miscellaneous) {
        return miscellaneousRepository.findById(miscellaneous.getId()).orElseThrow();
    }

    protected void assertPersistedMiscellaneousToMatchAllProperties(Miscellaneous expectedMiscellaneous) {
        assertMiscellaneousAllPropertiesEquals(expectedMiscellaneous, getPersistedMiscellaneous(expectedMiscellaneous));
    }

    protected void assertPersistedMiscellaneousToMatchUpdatableProperties(Miscellaneous expectedMiscellaneous) {
        assertMiscellaneousAllUpdatablePropertiesEquals(expectedMiscellaneous, getPersistedMiscellaneous(expectedMiscellaneous));
    }
}
