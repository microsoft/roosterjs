import { cacheGetEventData } from '../../../lib/domUtils/event/cacheGetEventData';
import { EditorReadyEvent } from 'roosterjs-content-model-types';

describe('cacheGetEventData', () => {
    const cacheKey = '__Key';
    it('get cached data', () => {
        const event: EditorReadyEvent = {
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const mockedData = 'DATA';
        const mockedGetter = jasmine.createSpy('getter').and.returnValue(mockedData);

        const data = cacheGetEventData(event, cacheKey, mockedGetter);

        expect(data).toBe(mockedData);
        expect(mockedGetter).toHaveBeenCalledTimes(1);
        expect(mockedGetter).toHaveBeenCalledWith(event);
        expect(event).toEqual({
            eventType: 'editorReady',
            eventDataCache: {
                [cacheKey]: mockedData,
            },
            addedBlockElements: [],
            removedBlockElements: [],
        });

        const data2 = cacheGetEventData(event, cacheKey, mockedGetter);

        expect(data2).toBe(mockedData);
        expect(mockedGetter).toHaveBeenCalledTimes(1);
    });
});
