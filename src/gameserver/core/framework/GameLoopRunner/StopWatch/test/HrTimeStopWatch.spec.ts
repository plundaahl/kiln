import {
    HrTimeStopWatch,
    TimeUnit,
} from '..'

describe(`reset`, () => {
    test(`If provided no arguments then immediately queried, should return close to 0`, () => {
        const timer = new HrTimeStopWatch();

        timer.reset();
        expect(timer.getCountMilliseconds()).toBeCloseTo(0, 0);
    });

    test(`If provided offset of -1 second, should return close to 1 second`, () => {
        const timer = new HrTimeStopWatch();

        timer.reset(-1, TimeUnit.MILLISECONDS);
        expect(timer.getCountMilliseconds()).toBeCloseTo(1, 0);
    });
});
