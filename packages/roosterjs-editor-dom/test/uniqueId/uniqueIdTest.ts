import { addUniqueId, getUniqueId } from '../../lib/uniqueId/uniqueId';

describe('addUniqueId', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('should add an id ', () => {
        addUniqueId(div, 'test');
        expect(getUniqueId(div)).toBe('test0');
    });

    it('should unique id ', () => {
        const span = document.createElement('span');
        document.body.appendChild(span);
        addUniqueId(div, 'test');
        addUniqueId(span, 'test');
        expect(getUniqueId(div)).toBe('test0');
        expect(getUniqueId(span)).toBe('test1');
        document.body.removeChild(span);
    });
});
