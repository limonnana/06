package com.limonnana.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class MiscellaneousTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Miscellaneous getMiscellaneousSample1() {
        return new Miscellaneous().id(1L);
    }

    public static Miscellaneous getMiscellaneousSample2() {
        return new Miscellaneous().id(2L);
    }

    public static Miscellaneous getMiscellaneousRandomSampleGenerator() {
        return new Miscellaneous().id(longCount.incrementAndGet());
    }
}
