import * as isWhiteSpacePreserved from 'roosterjs-content-model-dom/lib/domUtils/isWhiteSpacePreserved';
import { DomToModelContext } from 'roosterjs-content-model-types';
import { pasteTextProcessor } from '../../lib/override/pasteTextProcessor';

describe('pasteTextProcessor', () => {
    let isWhiteSpacePreservedSpy: jasmine.Spy;
    let defaultProcessorSpy: jasmine.Spy;
    let mockedContext: DomToModelContext;
    const mockedGroup = 'GROUP' as any;
    const mockedWhiteSpace = 'WHITESPACE' as any;

    beforeEach(() => {
        isWhiteSpacePreservedSpy = spyOn(isWhiteSpacePreserved, 'isWhiteSpacePreserved');
        defaultProcessorSpy = jasmine.createSpy('#text');
        mockedContext = {
            blockFormat: {
                whiteSpace: mockedWhiteSpace,
            },
            defaultElementProcessors: {
                '#text': defaultProcessorSpy,
            },
        } as any;
    });

    it('empty text node, isWhiteSpacePreserved=false', () => {
        const text = document.createTextNode('');

        isWhiteSpacePreservedSpy.and.returnValue(false);

        pasteTextProcessor(mockedGroup, text, mockedContext);

        expect(isWhiteSpacePreservedSpy).toHaveBeenCalledWith(mockedWhiteSpace);
        expect(defaultProcessorSpy).toHaveBeenCalledWith(mockedGroup, text, mockedContext);
        expect(text.nodeValue).toBe('');
    });

    it('empty text node, isWhiteSpacePreserved=true', () => {
        const text = document.createTextNode('');

        isWhiteSpacePreservedSpy.and.returnValue(true);

        pasteTextProcessor(mockedGroup, text, mockedContext);

        expect(isWhiteSpacePreservedSpy).toHaveBeenCalledWith(mockedWhiteSpace);
        expect(defaultProcessorSpy).toHaveBeenCalledWith(mockedGroup, text, mockedContext);
        expect(text.nodeValue).toBe('');
    });

    it('text node with space, isWhiteSpacePreserved=false', () => {
        const text = document.createTextNode('    ');

        isWhiteSpacePreservedSpy.and.returnValue(false);

        pasteTextProcessor(mockedGroup, text, mockedContext);

        expect(isWhiteSpacePreservedSpy).toHaveBeenCalledWith(mockedWhiteSpace);
        expect(defaultProcessorSpy).toHaveBeenCalledWith(mockedGroup, text, mockedContext);
        expect(text.nodeValue).toBe('    ');
    });

    it('text node with space, isWhiteSpacePreserved=true', () => {
        const text = document.createTextNode('    ');

        isWhiteSpacePreservedSpy.and.returnValue(true);

        pasteTextProcessor(mockedGroup, text, mockedContext);

        expect(isWhiteSpacePreservedSpy).toHaveBeenCalledWith(mockedWhiteSpace);
        expect(defaultProcessorSpy).toHaveBeenCalledWith(mockedGroup, text, mockedContext);
        expect(text.nodeValue).toBe(' \u00A0 \u00A0');
    });
});
