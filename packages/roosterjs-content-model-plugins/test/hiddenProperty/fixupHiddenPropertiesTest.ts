import { fixupHiddenProperties } from '../../lib/hiddenProperty/fixupHiddenProperties';
import { HiddenPropertyOptions } from '../../lib/hiddenProperty/HiddenPropertyOptions';
import { IEditor } from 'roosterjs-content-model-types';

describe('fixupHiddenProperties', () => {
    it('should not throw an error when called', () => {
        const editor: any = {}; // Mocked editor object
        const options: any = {}; // Mocked options object

        expect(() => fixupHiddenProperties(editor, options)).not.toThrow();
    });
});

describe('fixupHiddenProperties with undeletableLinkChecker', () => {
    it('should call checker for each element', () => {
        const mockedNode1: HTMLElement = {
            name: 'node1',
        } as any;
        const mockedNode2: HTMLElement = {
            name: 'node2',
        } as any;
        const queryElementsSpy = jasmine
            .createSpy('queryElements')
            .and.returnValue([mockedNode1, mockedNode2]);
        const editor: IEditor = {
            getDOMHelper: () => {
                return {
                    queryElements: queryElementsSpy,
                };
            },
        } as any;

        const checker = jasmine.createSpy('checker').and.callFake((node: HTMLElement) => {
            return (node as any).name === 'node1';
        });
        const options: HiddenPropertyOptions = {
            undeletableLinkChecker: checker,
        };

        fixupHiddenProperties(editor, options);

        expect(mockedNode1).toEqual({
            name: 'node1',
            __roosterjsHiddenProperty: { undeletable: true },
        } as any);
        expect(mockedNode2).toEqual({
            name: 'node2',
        } as any);
        expect(queryElementsSpy).toHaveBeenCalledWith('a');
        expect(checker).toHaveBeenCalledTimes(2);
        expect(checker.calls.argsFor(0)).toEqual([mockedNode1]);
        expect(checker.calls.argsFor(1)).toEqual([mockedNode2]);
    });
});
