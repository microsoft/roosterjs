import addUniqueId from '../../../lib/coreApi/utils/addUniqueId';

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
        expect(div.id).toBe('test0');
    });

    it('should unique id ', () => {
        const span = document.createElement('span');
        document.body.appendChild(span);
        addUniqueId(div, 'test');
        addUniqueId(span, 'test');
        expect(div.id).toBe('test0');
        expect(span.id).toBe('test1');
        document.body.removeChild(span);
    });

    it('should replace existing ids', () => {
        const span = document.createElement('span');
        span.id = 'test0';
        document.body.appendChild(span);
        addUniqueId(div, 'test');
        addUniqueId(span, 'test');
        expect(div.id).toBe('test1');
        expect(span.id).toBe('test0');
        document.body.removeChild(span);
    });
});
