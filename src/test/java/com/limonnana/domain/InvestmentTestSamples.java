package com.limonnana.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InvestmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Investment getInvestmentSample1() {
        return new Investment().id(1L).description("description1");
    }

    public static Investment getInvestmentSample2() {
        return new Investment().id(2L).description("description2");
    }

    public static Investment getInvestmentRandomSampleGenerator() {
        return new Investment().id(longCount.incrementAndGet()).description(UUID.randomUUID().toString());
    }
}
