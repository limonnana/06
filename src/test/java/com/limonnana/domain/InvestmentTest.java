package com.limonnana.domain;

import static com.limonnana.domain.InvestmentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.limonnana.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InvestmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Investment.class);
        Investment investment1 = getInvestmentSample1();
        Investment investment2 = new Investment();
        assertThat(investment1).isNotEqualTo(investment2);

        investment2.setId(investment1.getId());
        assertThat(investment1).isEqualTo(investment2);

        investment2 = getInvestmentSample2();
        assertThat(investment1).isNotEqualTo(investment2);
    }
}
