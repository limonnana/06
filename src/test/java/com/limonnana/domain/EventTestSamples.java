package com.limonnana.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EventTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Event getEventSample1() {
        return new Event().id(1L).description("description1");
    }

    public static Event getEventSample2() {
        return new Event().id(2L).description("description2");
    }

    public static Event getEventRandomSampleGenerator() {
        return new Event().id(longCount.incrementAndGet()).description(UUID.randomUUID().toString());
    }
}
