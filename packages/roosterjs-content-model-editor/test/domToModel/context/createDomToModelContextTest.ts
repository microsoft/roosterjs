import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { defaultProcessorMap } from '../../../lib/domToModel/context/defaultProcessors';
import { defaultStyleMap } from '../../../lib/formatHandlers/utils/defaultStyles';
import { DomToModelListFormat } from '../../../lib/publicTypes/context/DomToModelFormatContext';
import { EditorContext } from '../../../lib/publicTypes/context/EditorContext';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    defaultFormatParsers,
    getFormatParsers,
} from '../../../lib/formatHandlers/defaultFormatHandlers';

describe('createDomToModelContext', () => {
    const editorContext: EditorContext = {
        isDarkMode: false,
    };
    const listFormat: DomToModelListFormat = {
        threadItemCounts: [],
        levels: [],
    };
    const contextOptions = {
        elementProcessors: defaultProcessorMap,
        defaultStyles: defaultStyleMap,
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
            zoomScaleFormat: {},
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
            allowCacheElement: true,
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
            zoomScaleFormat: {},
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
            allowCacheElement: true,
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
            zoomScaleFormat: {},
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
            allowCacheElement: true,
            ...contextOptions,
        });
    });

    it('with normal selection', () => {
        const mockNode = ('Node' as any) as Node;
        const mockedRange = ({
            startContainer: 'DIV 1',
            startOffset: 0,
            endContainer: 'DIV 2',
            endOffset: 1,
            collapsed: false,
            commonAncestorContainer: mockNode,
        } as any) as Range;
        const context = createDomToModelContext(undefined, {
            selectionRange: {
                type: SelectionRangeTypes.Normal,
                ranges: [mockedRange],
                areAllCollapsed: false,
            },
        });

        expect(context).toEqual({
            ...editorContext,
            segmentFormat: {},
            blockFormat: {},
            zoomScaleFormat: {},
            isInSelection: false,
            regularSelection: {
                startContainer: 'DIV 1' as any,
                startOffset: 0,
                endContainer: 'DIV 2' as any,
                endOffset: 1,
                isSelectionCollapsed: false,
            },
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
            selectionRootNode: mockNode,
            allowCacheElement: true,
            ...contextOptions,
        });
    });

    it('with table selection', () => {
        const mockTable = ('Table' as any) as HTMLTableElement;
        const context = createDomToModelContext(undefined, {
            selectionRange: {
                type: SelectionRangeTypes.TableSelection,
                ranges: [],
                areAllCollapsed: false,
                table: mockTable,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
        });

        expect(context).toEqual({
            ...editorContext,
            segmentFormat: {},
            blockFormat: {},
            zoomScaleFormat: {},
            isInSelection: false,
            tableSelection: {
                table: mockTable,
                firstCell: { x: 1, y: 2 },
                lastCell: { x: 3, y: 4 },
            },
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
            selectionRootNode: mockTable,
            allowCacheElement: true,
            ...contextOptions,
        });
    });

    it('with image selection', () => {
        const mockImage = ('Image' as any) as HTMLImageElement;
        const context = createDomToModelContext(undefined, {
            selectionRange: {
                type: SelectionRangeTypes.ImageSelection,
                ranges: [],
                areAllCollapsed: false,
                image: mockImage,
            },
        });

        expect(context).toEqual({
            ...editorContext,
            segmentFormat: {},
            blockFormat: {},
            zoomScaleFormat: {},
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
            isInSelection: false,
            imageSelection: {
                image: mockImage,
            },
            listFormat,
            selectionRootNode: mockImage,
            allowCacheElement: true,
            ...contextOptions,
        });
    });

    it('with base parameters and wrong selection 1', () => {
        const context = createDomToModelContext(
            {
                isDarkMode: true,
            },
            {
                selectionRange: {
                    type: SelectionRangeTypes.Normal,
                    ranges: [],
                    areAllCollapsed: true,
                },
            }
        );

        expect(context).toEqual({
            isDarkMode: true,
            isInSelection: false,
            blockFormat: {},
            zoomScaleFormat: {},
            segmentFormat: {},
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
            allowCacheElement: true,
            ...contextOptions,
        });
    });

    it('with base parameters and wrong selection 2', () => {
        const context = createDomToModelContext(
            {
                isDarkMode: true,
            },
            {
                selectionRange: {
                    type: SelectionRangeTypes.TableSelection,
                    ranges: [],
                    areAllCollapsed: false,
                    table: null!,
                    coordinates: null!,
                },
            }
        );

        expect(context).toEqual({
            isDarkMode: true,
            isInSelection: false,
            blockFormat: {},
            zoomScaleFormat: {},
            segmentFormat: {},
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
            listFormat,
            allowCacheElement: true,
            ...contextOptions,
        });
    });

    it('with override', () => {
        const mockedAProcessor = 'a' as any;
        const mockedOlStyle = 'ol' as any;
        const mockedBoldParser = 'bold' as any;
        const mockedBlockParser = 'block' as any;
        const context = createDomToModelContext(undefined, {
            processorOverride: {
                a: mockedAProcessor,
            },
            defaultStyleOverride: {
                ol: mockedOlStyle,
            },
            formatParserOverride: {
                bold: mockedBoldParser,
            },
            additionalFormatParsers: {
                block: mockedBlockParser,
            },
        });

        expect(context.elementProcessors.a).toBe(mockedAProcessor);
        expect(context.defaultStyles.ol).toBe(mockedOlStyle);
        expect(context.formatParsers.segment.indexOf(mockedBoldParser)).toBeGreaterThanOrEqual(0);
        expect(context.formatParsers.block).toEqual([
            ...getFormatParsers().block,
            mockedBlockParser,
        ]);
    });
});
