package com.limonnana.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A Investment.
 */
@Entity
@Table(name = "investment")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Investment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "start_amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal startAmount;

    @NotNull
    @Column(name = "current_value", precision = 21, scale = 2, nullable = false)
    private BigDecimal currentValue;

    @Column(name = "description")
    private String description;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Investment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Investment startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public BigDecimal getStartAmount() {
        return this.startAmount;
    }

    public Investment startAmount(BigDecimal startAmount) {
        this.setStartAmount(startAmount);
        return this;
    }

    public void setStartAmount(BigDecimal startAmount) {
        this.startAmount = startAmount;
    }

    public BigDecimal getCurrentValue() {
        return this.currentValue;
    }

    public Investment currentValue(BigDecimal currentValue) {
        this.setCurrentValue(currentValue);
        return this;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public String getDescription() {
        return this.description;
    }

    public Investment description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Investment)) {
            return false;
        }
        return getId() != null && getId().equals(((Investment) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Investment{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", startAmount=" + getStartAmount() +
            ", currentValue=" + getCurrentValue() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
