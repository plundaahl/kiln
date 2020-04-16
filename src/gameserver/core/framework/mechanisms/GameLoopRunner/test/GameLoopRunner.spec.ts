import { IGameLoopRunnerConfig } from '../IGameLoopRunnerConfig';
import { GameLoopRunner } from '../GameLoopRunner';
import { IFrameMetricProvider } from '../IFrameMetricProvider';

const NS_PER_SECOND = Math.pow(10, 9);
const NS_TO_MS = Math.pow(10, -6);

describe(`FrameMetricsProvider`, () => {
    describe(`getCurFrameLength`, () => {
        test(`On first run, should return target frame length in nanoseconds`, async done => {
            const ticksPerSecond = 20;
            const expectedFrameLength = NS_PER_SECOND / ticksPerSecond;
            let curFrameLengthResult: number = 0;

            await new Promise(resolve => {
                const updater = {
                    update: (metricProvider: IFrameMetricProvider) => {
                        curFrameLengthResult = metricProvider.getCurFrameLength();
                        resolve();
                    }
                };

                const runner = new GameLoopRunner(
                    { ticksPerSecond },
                    [[updater, 'update']],
                );

                runner.start();
            });

            expect(curFrameLengthResult * NS_TO_MS).toBeCloseTo(expectedFrameLength * NS_TO_MS, 0);
            done();
        });


        test(`On subsequent runs, should return nanoseconds since last frame update`, async done => {
            const ticksPerSecond = 20;
            let initialFrameStart: [number, number] = [0, 0];
            let curFrameLengthResult: number = 0;

            await new Promise(resolve => {
                let iteration = 0;

                const updater = {
                    update: (metricProvider: IFrameMetricProvider) => {
                        if (iteration++ === 0) {
                            initialFrameStart = process.hrtime();
                        } else {
                            curFrameLengthResult = metricProvider.getCurFrameLength();
                            resolve();
                        }
                    }
                };

                const runner = new GameLoopRunner(
                    { ticksPerSecond },
                    [[updater, 'update']],
                );

                runner.start();
            });


            const timeDiff = process.hrtime(initialFrameStart);
            const expectedFrameLength = (timeDiff[0] * NS_PER_SECOND) + timeDiff[1];

            expect(curFrameLengthResult * NS_TO_MS).toBeCloseTo(expectedFrameLength * NS_TO_MS, 0);
            done();
        });
    });
});

describe(`GameLoopRunner`, () => {
    describe(`Update`, () => {
        test(`Should update modules in provided order`, async done => {
            const a = 'a';
            const b = 'b';
            const c = 'c';
            const d = 'd';

            const callOrder: string[] = [];

            await new Promise(resolve => {
                const runner = new GameLoopRunner(
                    { ticksPerSecond: 20 },
                    [
                        [{
                            update: () => callOrder.push(a)
                        }, 'update'],
                        [{
                            update: () => callOrder.push(b)
                        }, 'update'],
                        [{
                            update: () => callOrder.push(c)
                        }, 'update'],
                        [{
                            update: () => callOrder.push(d)
                        }, 'update'],
                        [{
                            update: () => {
                                runner.stop();
                                resolve();
                            },
                        }, 'update'],
                    ]
                );

                runner.start();
            });

            expect(callOrder[0]).toBe(a);
            expect(callOrder[1]).toBe(b);
            expect(callOrder[2]).toBe(c);
            expect(callOrder[3]).toBe(d);
            done();
        });

        test(`Should update each module once per update`, async done => {
            const updates = [0, 0, 0, 0];

            await new Promise(resolve => {
                const runner = new GameLoopRunner(
                    { ticksPerSecond: 20 },
                    [
                        [{
                            update: () => updates[0]++
                        }, 'update'],
                        [{
                            update: () => updates[1]++
                        }, 'update'],
                        [{
                            update: () => updates[2]++
                        }, 'update'],
                        [{
                            update: () => updates[3]++
                        }, 'update'],
                        [{
                            update: () => {
                                runner.stop();
                                resolve();
                            },
                        }, 'update'],
                    ]
                );

                runner.start();
            });

            expect(updates[0]).toBe(1);
            expect(updates[1]).toBe(1);
            expect(updates[2]).toBe(1);
            expect(updates[3]).toBe(1);
            done();
        });
    });
});
