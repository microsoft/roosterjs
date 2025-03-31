import {
    getHiddenProperty,
    setHiddenProperty,
} from '../../../lib/domUtils/hiddenProperties/hiddenProperty';

describe('hiddenProperty.getHiddenProperty', () => {
    it('should return undefined if no hidden property is set', () => {
        const mockedNode: Node = {} as any;
        expect(getHiddenProperty(mockedNode, 'test' as any)).toBeUndefined();
    });

    it('should return the value of the hidden property if set', () => {
        const mockedNode: Node = {
            __roosterjsHiddenProperty: {
                test: 'testValue',
            },
        } as any;

        expect(getHiddenProperty(mockedNode, 'test' as any)).toBe('testValue');
    });
});

describe('hiddenProperty.setHiddenProperty', () => {
    it('should set the hidden property on the node', () => {
        const mockedNode: Node = {} as any;
        setHiddenProperty(mockedNode, 'test' as any, 'testValue');

        expect((mockedNode as any).__roosterjsHiddenProperty).toEqual({
            test: 'testValue',
        });
    });

    it('should update the hidden property if it already exists', () => {
        const mockedNode: Node = {
            __roosterjsHiddenProperty: {
                otherValue: 'otherValue',
                test: 'oldValue',
            },
        } as any;
        setHiddenProperty(mockedNode, 'test' as any, 'newValue');

        expect((mockedNode as any).__roosterjsHiddenProperty).toEqual({
            otherValue: 'otherValue',
            test: 'newValue',
        });
    });
});
