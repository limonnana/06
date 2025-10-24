package com.limonnana.domain;

import static com.limonnana.domain.MiscellaneousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.limonnana.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MiscellaneousTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Miscellaneous.class);
        Miscellaneous miscellaneous1 = getMiscellaneousSample1();
        Miscellaneous miscellaneous2 = new Miscellaneous();
        assertThat(miscellaneous1).isNotEqualTo(miscellaneous2);

        miscellaneous2.setId(miscellaneous1.getId());
        assertThat(miscellaneous1).isEqualTo(miscellaneous2);

        miscellaneous2 = getMiscellaneousSample2();
        assertThat(miscellaneous1).isNotEqualTo(miscellaneous2);
    }
}
