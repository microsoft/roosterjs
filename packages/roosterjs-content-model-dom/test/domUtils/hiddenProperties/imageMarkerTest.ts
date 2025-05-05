import { getImageMarker, setImageMarker } from '../../../lib/domUtils/hiddenProperties/imageMarker';

describe('setImageMarker', () => {
    it('should set the property', () => {
        const element = document.createElement('img');

        setImageMarker(element, 'testMarker');

        expect((element as any).__roosterjsHiddenProperty).toEqual({
            imageMarker: 'testMarker',
        });

        setImageMarker(element, 'testMarker2');

        expect((element as any).__roosterjsHiddenProperty).toEqual({
            imageMarker: 'testMarker2',
        });
    });
});

describe('getImageMarker', () => {
    it('should read value', () => {
        const element = document.createElement('img');

        expect(getImageMarker(element)).toBe(undefined);

        (element as any).__roosterjsHiddenProperty = {
            imageMarker: 'testMarker',
        };

        expect(getImageMarker(element)).toBe('testMarker');
    });
});
