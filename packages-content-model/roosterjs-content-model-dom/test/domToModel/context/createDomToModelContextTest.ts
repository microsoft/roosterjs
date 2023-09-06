import { defaultProcessorMap } from '../../../lib/domToModel/context/defaultProcessors';
import { EditorContext } from 'roosterjs-content-model-types';
import {
    buildFormatParsers,
    createDomToModelContext,
} from '../../../lib/domToModel/context/createDomToModelContext';

describe('createDomToModelContext', () => {
    it('no param', () => {
        const context = createDomToModelContext();

        expect(context).toEqual({
            isInSelection: false,
            blockFormat: {},
            segmentFormat: {},
            listFormat: {
                threadItemCounts: [],
                levels: [],
            },
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
            elementProcessors: defaultProcessorMap,
            formatParsers: buildFormatParsers(),
            defaultElementProcessors: defaultProcessorMap,
        });
    });

    it('with editor context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createDomToModelContext(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            editorContext
        );

        expect(context).toEqual({
            ...editorContext,
            isInSelection: false,
            blockFormat: {},
            segmentFormat: {},
            listFormat: {
                threadItemCounts: [],
                levels: [],
            },
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
            elementProcessors: defaultProcessorMap,
            formatParsers: buildFormatParsers(),
            defaultElementProcessors: defaultProcessorMap,
        });
    });

    it('with selection', () => {
        const range = { name: 'SelectionContext' } as any;
        const context = createDomToModelContext(undefined, undefined, undefined, undefined, range);

        expect(context).toEqual({
            isInSelection: false,
            blockFormat: {},
            segmentFormat: {},
            listFormat: {
                threadItemCounts: [],
                levels: [],
            },
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
            elementProcessors: defaultProcessorMap,
            formatParsers: buildFormatParsers(),
            defaultElementProcessors: defaultProcessorMap,
            rangeEx: range,
        });
    });

    it('with override', () => {
        const mockedAProcessor = 'a' as any;
        const mockedBoldParser = 'bold' as any;
        const mockedBlockParser = 'block' as any;
        const mockedBaseProcessor = 'base' as any;
        const context = createDomToModelContext(
            {
                a: mockedAProcessor,
            },
            {
                bold: mockedBoldParser,
            },
            [
                {
                    block: mockedBlockParser,
                },
            ],
            {
                base: mockedBaseProcessor,
            } as any
        );

        const parsers = buildFormatParsers();

        parsers.block[4] = mockedBlockParser;
        parsers.elementBasedSegment[4] = mockedBoldParser;
        parsers.segment[7] = mockedBoldParser;
        parsers.segmentOnBlock[7] = mockedBoldParser;
        parsers.segmentOnTableCell[7] = mockedBoldParser;

        expect(context).toEqual({
            isInSelection: false,
            blockFormat: {},
            segmentFormat: {},
            listFormat: {
                threadItemCounts: [],
                levels: [],
            },
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
            elementProcessors: {
                base: mockedBaseProcessor,
                a: mockedAProcessor,
            } as any,
            formatParsers: parsers,
            defaultElementProcessors: {
                base: mockedBaseProcessor,
            } as any,
        });
    });
});
