import { getImageState, setImageState } from '../../../lib/domUtils/hiddenProperties/imageState';

describe('setImageState', () => {
    it('should set the property', () => {
        const element = document.createElement('img');

        setImageState(element, 'testState');

        expect((element as any).__roosterjsHiddenProperty).toEqual({
            imageState: 'testState',
        });

        setImageState(element, 'testState2');

        expect((element as any).__roosterjsHiddenProperty).toEqual({
            imageState: 'testState2',
        });
    });
});

describe('getImageState', () => {
    it('should read value', () => {
        const element = document.createElement('img');

        expect(getImageState(element)).toBe(undefined);

        (element as any).__roosterjsHiddenProperty = {
            imageState: 'testState',
        };

        expect(getImageState(element)).toBe('testState');
    });
});
