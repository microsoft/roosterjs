import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { defaultProcessorMap } from '../../../lib/domToModel/context/defaultProcessors';
import { DomToModelListFormat, EditorContext } from 'roosterjs-content-model-types';
import {
    defaultFormatParsers,
    getFormatParsers,
} from '../../../lib/formatHandlers/defaultFormatHandlers';

describe('createDomToModelContext', () => {
    const editorContext: EditorContext = {};
    const listFormat: DomToModelListFormat = {
        threadItemCounts: [],
        levels: [],
    };
    const contextOptions = {
        elementProcessors: defaultProcessorMap,
        formatParsers: getFormatParsers(),
        defaultElementProcessors: defaultProcessorMap,
        defaultFormatParsers: defaultFormatParsers,
    };
    it('no param', () => {
        const context = createDomToModelContext();

        expect(context).toEqual({
            ...editorContext,
            segmentFormat: {},
            blockFormat: {},
            isInSelection: false,
            listFormat,
            link: {
                format: {},
                dataset: {},
            },
            code: {
                format: {},
            },
            blockDecorator: {
                format: {},
                tagName: '',
            },
            ...contextOptions,
        });
    });

    it('with content model context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createDomToModelContext(editorContext);

        expect(context).toEqual({
            ...editorContext,
            segmentFormat: {},
            blockFormat: {},
            isInSelection: false,
            listFormat,
            link: {
                format: {},
                dataset: {},
            },
            code: {
                format: {},
            },
            blockDecorator: {
                format: {},
                tagName: '',
            },
            ...contextOptions,
        });
    });

    it('with content model context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createDomToModelContext(editorContext);

        expect(context).toEqual({
            ...editorContext,
            segmentFormat: {},
            blockFormat: {},
            isInSelection: false,
            listFormat,
            link: {
                format: {},
                dataset: {},
            },
            code: {
                format: {},
            },
            blockDecorator: {
                format: {},
                tagName: '',
            },
            ...contextOptions,
        });
    });

    it('with selection context', () => {
        const selectionContext = { name: 'SelectionContext' } as any;
        const context = createDomToModelContext(undefined, undefined, selectionContext);

        expect(context).toEqual({
            segmentFormat: {},
            blockFormat: {},
            isInSelection: false,
            listFormat,
            link: {
                format: {},
                dataset: {},
            },
            code: {
                format: {},
            },
            blockDecorator: {
                format: {},
                tagName: '',
            },
            ...contextOptions,
            rangeEx: selectionContext,
        });
    });

    it('with override', () => {
        const mockedAProcessor = 'a' as any;
        const mockedBoldParser = 'bold' as any;
        const mockedBlockParser = 'block' as any;
        const context = createDomToModelContext(undefined, {
            processorOverride: {
                a: mockedAProcessor,
            },
            formatParserOverride: {
                bold: mockedBoldParser,
            },
            additionalFormatParsers: {
                block: mockedBlockParser,
            },
        });

        expect(context.elementProcessors.a).toBe(mockedAProcessor);
        expect(context.formatParsers.segment.indexOf(mockedBoldParser)).toBeGreaterThanOrEqual(0);
        expect(context.formatParsers.block).toEqual([
            ...getFormatParsers().block,
            mockedBlockParser,
        ]);
    });
});
