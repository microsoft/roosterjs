import { getVisibleViewport } from '../../lib/coreApi/getVisibleViewport';

describe('getVisibleViewport', () => {
    it('scrollContainer is same with contentDiv', () => {
        const div = {
            getBoundingClientRect: () => ({ left: 100, right: 200, top: 300, bottom: 400 }),
        };
        const core = {
            contentDiv: div,
            domEvent: {
                scrollContainer: div,
            },
        } as any;

        const result = getVisibleViewport(core);

        expect(result).toEqual({ left: 100, right: 200, top: 300, bottom: 400 });
    });

    it('scrollContainer is different than contentDiv', () => {
        const div1 = {
            getBoundingClientRect: () => ({ left: 100, right: 200, top: 300, bottom: 400 }),
        };
        const div2 = {
            getBoundingClientRect: () => ({ left: 150, right: 250, top: 350, bottom: 450 }),
        };
        const core = {
            contentDiv: div1,
            domEvent: {
                scrollContainer: div2,
            },
        } as any;

        const result = getVisibleViewport(core);

        expect(result).toEqual({ left: 150, right: 200, top: 350, bottom: 400 });
    });
});
