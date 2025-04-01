import {
    isLinkUndeletable,
    setLinkUndeletable,
} from '../../../lib/domUtils/hiddenProperties/undeletableLink';

describe('setLinkUndeletable', () => {
    it('should set the undeletable property on the link element', () => {
        const linkElement = document.createElement('a');

        setLinkUndeletable(linkElement, true);

        expect((linkElement as any).__roosterjsHiddenProperty).toEqual({
            undeletable: true,
        });

        setLinkUndeletable(linkElement, false);

        expect((linkElement as any).__roosterjsHiddenProperty).toEqual({
            undeletable: false,
        });
    });
});

describe('isLinkUndeletable', () => {
    it('should read link undeletable value', () => {
        const linkElement = document.createElement('a');

        expect(isLinkUndeletable(linkElement)).toBe(false);

        (linkElement as any).__roosterjsHiddenProperty = {
            undeletable: true,
        };

        expect(isLinkUndeletable(linkElement)).toBe(true);
    });
});
