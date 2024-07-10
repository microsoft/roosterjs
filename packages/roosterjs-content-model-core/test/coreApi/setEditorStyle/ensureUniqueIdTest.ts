import { ensureUniqueId } from '../../../lib/coreApi/setEditorStyle/ensureUniqueId';

describe('ensureUniqueId', () => {
    let doc: Document;
    let querySelectorAllSpy: jasmine.Spy;

    beforeEach(() => {
        querySelectorAllSpy = jasmine.createSpy('querySelectorAll');
        doc = {
            querySelectorAll: querySelectorAllSpy,
        } as any;
    });

    it('no id', () => {
        const element = {
            ownerDocument: doc,
        } as any;
        querySelectorAllSpy.and.returnValue([]);
        const result = ensureUniqueId(element, 'prefix');

        expect(result).toBe('prefix_0');
    });

    it('Has unique id', () => {
        const element = {
            ownerDocument: doc,
            id: 'unique',
        } as any;
        querySelectorAllSpy.and.returnValue([{}]);
        const result = ensureUniqueId(element, 'prefix');

        expect(result).toBe('unique');
    });

    it('Has duplicated', () => {
        const element = {
            ownerDocument: doc,
            id: 'dup',
        } as any;
        querySelectorAllSpy.and.callFake((selector: string) =>
            selector == '[id="dup"]' ? [{}, {}] : []
        );
        const result = ensureUniqueId(element, 'prefix');

        expect(result).toBe('dup_0');
    });

    it('Should not throw when element id starts with number', () => {
        const element = {
            ownerDocument: doc,
            id: '0',
        } as any;

        let isFirst = true;
        querySelectorAllSpy.and.callFake((_selector: string) => {
            if (isFirst) {
                isFirst = false;
                return [{}, {}];
            }
            return [{}];
        });

        ensureUniqueId(element, 'prefix');

        expect(querySelectorAllSpy).toHaveBeenCalledWith('[id="0"]');
        expect(element.id).toEqual('0_0');
    });

    it('Should not throw when element id starts with hyphen', () => {
        const element = {
            ownerDocument: doc,
            id: '-',
        } as any;

        let isFirst = true;
        querySelectorAllSpy.and.callFake((_selector: string) => {
            if (isFirst) {
                isFirst = false;
                return [{}, {}];
            }
            return [{}];
        });

        ensureUniqueId(element, 'prefix');

        expect(querySelectorAllSpy).toHaveBeenCalledWith('[id="-"]');
        expect(element.id).toEqual('-_0');
    });
});
