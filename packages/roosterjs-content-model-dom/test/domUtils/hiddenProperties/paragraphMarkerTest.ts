import {
    setParagraphMarker,
    getParagraphMarker,
} from '../../../lib/domUtils/hiddenProperties/paragraphMarker';

describe('setParagraphMarker', () => {
    it('should set the property', () => {
        const element = document.createElement('div');

        setParagraphMarker(element, 'testMarker');

        expect((element as any).__roosterjsHiddenProperty).toEqual({
            paragraphMarker: 'testMarker',
        });

        setParagraphMarker(element, 'testMarker2');

        expect((element as any).__roosterjsHiddenProperty).toEqual({
            paragraphMarker: 'testMarker2',
        });
    });
});

describe('getParagraphMarker', () => {
    it('should read value', () => {
        const element = document.createElement('div');

        expect(getParagraphMarker(element)).toBe(undefined);

        (element as any).__roosterjsHiddenProperty = {
            paragraphMarker: 'testMarker',
        };

        expect(getParagraphMarker(element)).toBe('testMarker');
    });
});
