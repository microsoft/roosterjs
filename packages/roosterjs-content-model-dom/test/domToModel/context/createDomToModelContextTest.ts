import { defaultFormatParsers } from '../../../lib/formatHandlers/defaultFormatHandlers';
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
            defaultFormatParsers,
            path: [],
        });
    });

    it('with editor context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createDomToModelContext(editorContext);

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
            defaultFormatParsers,
            path: [],
        });
    });

    it('with override', () => {
        const mockedAProcessor = 'a' as any;
        const mockedBoldParser = 'bold' as any;
        const mockedBlockParser = 'block' as any;
        const mockedTextParser1 = 'parser1' as any;
        const mockedTextParser2 = 'parser2' as any;
        const context = createDomToModelContext(
            undefined,
            undefined,
            {
                processorOverride: {
                    a: mockedAProcessor,
                },
                formatParserOverride: {
                    bold: mockedBoldParser,
                },
                additionalFormatParsers: {
                    block: mockedBlockParser,
                    text: [mockedTextParser1],
                },
            },
            {
                additionalFormatParsers: {
                    text: [mockedTextParser2],
                },
            }
        );

        const parsers = buildFormatParsers();

        parsers.block[5] = mockedBlockParser;
        parsers.elementBasedSegment[4] = mockedBoldParser;
        parsers.segment[7] = mockedBoldParser;
        parsers.segmentOnBlock[7] = mockedBoldParser;
        parsers.segmentOnTableCell[7] = mockedBoldParser;
        parsers.text = [mockedTextParser1, mockedTextParser2];

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
                ...defaultProcessorMap,
                a: mockedAProcessor,
            } as any,
            formatParsers: parsers,
            defaultElementProcessors: defaultProcessorMap,
            defaultFormatParsers,
            path: [],
        });
    });
});
