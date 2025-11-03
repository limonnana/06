package com.limonnana.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.limonnana.domain.Investment;
import com.limonnana.repository.InvestmentRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.limonnana.domain.Investment}.
 */
@Service
@Transactional
public class InvestmentService {

    private static final Logger LOG = LoggerFactory.getLogger(InvestmentService.class);

    private final InvestmentRepository investmentRepository;

    public InvestmentService(InvestmentRepository investmentRepository) {
        this.investmentRepository = investmentRepository;
    }

    public BigDecimal getTotalInvestments() {
        BigDecimal total = new BigDecimal(0);
        List<Investment> investmentList = findAll();

        for (Investment i : investmentList) {
            total = total.add(i.getCurrentValue());
        }

        return total;
    }

    /**
     * Save a investment.
     *
     * @param investment the entity to save.
     * @return the persisted entity.
     */
    public Investment save(Investment investment) {
        LOG.debug("Request to save Investment : {}", investment);
        return investmentRepository.save(investment);
    }

    /**
     * Update a investment.
     *
     * @param investment the entity to save.
     * @return the persisted entity.
     */
    public Investment update(Investment investment) {
        LOG.debug("Request to update Investment : {}", investment);
        return investmentRepository.save(investment);
    }

    /**
     * Partially update a investment.
     *
     * @param investment the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Investment> partialUpdate(Investment investment) {
        LOG.debug("Request to partially update Investment : {}", investment);

        return investmentRepository
            .findById(investment.getId())
            .map(existingInvestment -> {
                if (investment.getStartDate() != null) {
                    existingInvestment.setStartDate(investment.getStartDate());
                }
                if (investment.getStartAmount() != null) {
                    existingInvestment.setStartAmount(investment.getStartAmount());
                }
                if (investment.getCurrentValue() != null) {
                    existingInvestment.setCurrentValue(investment.getCurrentValue());
                }
                if (investment.getDescription() != null) {
                    existingInvestment.setDescription(investment.getDescription());
                }

                return existingInvestment;
            })
            .map(investmentRepository::save);
    }

    /**
     * Get all the investments.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Investment> findAll() {
        LOG.debug("Request to get all Investments");
        return investmentRepository.findAll();
    }

    /**
     * Get one investment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Investment> findOne(Long id) {
        LOG.debug("Request to get Investment : {}", id);
        return investmentRepository.findById(id);
    }

    /**
     * Delete the investment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Investment : {}", id);
        investmentRepository.deleteById(id);
    }
}
