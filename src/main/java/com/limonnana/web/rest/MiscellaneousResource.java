package com.limonnana.web.rest;

import com.limonnana.domain.Miscellaneous;
import com.limonnana.repository.MiscellaneousRepository;
import com.limonnana.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.limonnana.domain.Miscellaneous}.
 */
@RestController
@RequestMapping("/api/miscellaneous")
@Transactional
public class MiscellaneousResource {

    private static final Logger LOG = LoggerFactory.getLogger(MiscellaneousResource.class);

    private static final String ENTITY_NAME = "miscellaneous";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MiscellaneousRepository miscellaneousRepository;

    public MiscellaneousResource(MiscellaneousRepository miscellaneousRepository) {
        this.miscellaneousRepository = miscellaneousRepository;
    }

    /**
     * {@code POST  /miscellaneous} : Create a new miscellaneous.
     *
     * @param miscellaneous the miscellaneous to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new miscellaneous, or with status {@code 400 (Bad Request)} if the miscellaneous has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Miscellaneous> createMiscellaneous(@Valid @RequestBody Miscellaneous miscellaneous) throws URISyntaxException {
        LOG.debug("REST request to save Miscellaneous : {}", miscellaneous);
        if (miscellaneous.getId() != null) {
            throw new BadRequestAlertException("A new miscellaneous cannot already have an ID", ENTITY_NAME, "idexists");
        }
        miscellaneous = miscellaneousRepository.save(miscellaneous);
        return ResponseEntity.created(new URI("/api/miscellaneous/" + miscellaneous.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, miscellaneous.getId().toString()))
            .body(miscellaneous);
    }

    /**
     * {@code PUT  /miscellaneous/:id} : Updates an existing miscellaneous.
     *
     * @param id the id of the miscellaneous to save.
     * @param miscellaneous the miscellaneous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated miscellaneous,
     * or with status {@code 400 (Bad Request)} if the miscellaneous is not valid,
     * or with status {@code 500 (Internal Server Error)} if the miscellaneous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Miscellaneous> updateMiscellaneous(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Miscellaneous miscellaneous
    ) throws URISyntaxException {
        LOG.debug("REST request to update Miscellaneous : {}, {}", id, miscellaneous);
        if (miscellaneous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, miscellaneous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!miscellaneousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        miscellaneous = miscellaneousRepository.save(miscellaneous);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, miscellaneous.getId().toString()))
            .body(miscellaneous);
    }

    /**
     * {@code PATCH  /miscellaneous/:id} : Partial updates given fields of an existing miscellaneous, field will ignore if it is null
     *
     * @param id the id of the miscellaneous to save.
     * @param miscellaneous the miscellaneous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated miscellaneous,
     * or with status {@code 400 (Bad Request)} if the miscellaneous is not valid,
     * or with status {@code 404 (Not Found)} if the miscellaneous is not found,
     * or with status {@code 500 (Internal Server Error)} if the miscellaneous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Miscellaneous> partialUpdateMiscellaneous(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Miscellaneous miscellaneous
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Miscellaneous partially : {}, {}", id, miscellaneous);
        if (miscellaneous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, miscellaneous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!miscellaneousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Miscellaneous> result = miscellaneousRepository
            .findById(miscellaneous.getId())
            .map(existingMiscellaneous -> {
                if (miscellaneous.getLastUpdate() != null) {
                    existingMiscellaneous.setLastUpdate(miscellaneous.getLastUpdate());
                }

                return existingMiscellaneous;
            })
            .map(miscellaneousRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, miscellaneous.getId().toString())
        );
    }

    /**
     * {@code GET  /miscellaneous} : get all the miscellaneous.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of miscellaneous in body.
     */
    @GetMapping("")
    public List<Miscellaneous> getAllMiscellaneous() {
        LOG.debug("REST request to get all Miscellaneous");
        getLastUpdate();
        return miscellaneousRepository.findAll();
    }

    @GetMapping("/lastupdate")
    public String getLastUpdate() {
        // Miscellaneous m =  miscellaneousRepository.findFirstByOrderByIdDesc();
        Miscellaneous m = miscellaneousRepository.findLastRecord();
        LOG.debug("REST request to get last investment update" + m.getId() + " " + m.getLastUpdate().toString());
        return m.getLastUpdate().toString();
    }

    /**
     * {@code GET  /miscellaneous/:id} : get the "id" miscellaneous.
     *
     * @param id the id of the miscellaneous to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the miscellaneous, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Miscellaneous> getMiscellaneous(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Miscellaneous : {}", id);
        Optional<Miscellaneous> miscellaneous = miscellaneousRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(miscellaneous);
    }

    /**
     * {@code DELETE  /miscellaneous/:id} : delete the "id" miscellaneous.
     *
     * @param id the id of the miscellaneous to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMiscellaneous(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Miscellaneous : {}", id);
        miscellaneousRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
