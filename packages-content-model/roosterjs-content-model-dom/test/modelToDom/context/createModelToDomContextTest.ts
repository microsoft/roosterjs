import { defaultContentModelHandlers } from '../../../lib/modelToDom/context/defaultContentModelHandlers';
import { EditorContext } from 'roosterjs-content-model-types';
import {
    buildFormatAppliers,
    createModelToDomContext,
} from '../../../lib/modelToDom/context/createModelToDomContext';

describe('createModelToDomContext', () => {
    it('no param', () => {
        const context = createModelToDomContext();

        expect(context).toEqual({
            regularSelection: {
                current: {
                    block: null,
                    segment: null,
                },
            },
            listFormat: {
                threadItemCounts: [],
                nodeStack: [],
            },
            implicitFormat: {},
            modelHandlers: defaultContentModelHandlers,
            formatAppliers: buildFormatAppliers(),
            defaultModelHandlers: defaultContentModelHandlers,
            onNodeCreated: undefined,
        });
    });

    it('with editor context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createModelToDomContext(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            editorContext
        );

        expect(context).toEqual({
            isDarkMode: true,
            regularSelection: {
                current: {
                    block: null,
                    segment: null,
                },
            },
            listFormat: {
                threadItemCounts: [],
                nodeStack: [],
            },
            implicitFormat: {},
            modelHandlers: defaultContentModelHandlers,
            formatAppliers: buildFormatAppliers(),
            defaultModelHandlers: defaultContentModelHandlers,
            onNodeCreated: undefined,
        });
    });

    it('with overrides', () => {
        const mockedBoldApplier = 'bold' as any;
        const mockedBlockApplier = 'block' as any;
        const mockedBrHandler = 'br' as any;
        const onNodeCreated = 'OnNodeCreated' as any;
        const mockedBaseHandler = 'base' as any;

        const context = createModelToDomContext(
            onNodeCreated,
            {
                br: mockedBrHandler,
            },
            {
                bold: mockedBoldApplier,
            },
            [
                {
                    block: [mockedBlockApplier],
                },
            ],
            {
                base: mockedBaseHandler,
            } as any
        );

        const appliers = buildFormatAppliers();

        appliers.block[4] = mockedBlockApplier;
        appliers.elementBasedSegment[4] = mockedBoldApplier;
        appliers.segment[7] = mockedBoldApplier;
        appliers.segmentOnBlock[7] = mockedBoldApplier;
        appliers.segmentOnTableCell[7] = mockedBoldApplier;

        expect(context).toEqual({
            regularSelection: {
                current: {
                    block: null,
                    segment: null,
                },
            },
            listFormat: {
                threadItemCounts: [],
                nodeStack: [],
            },
            implicitFormat: {},
            modelHandlers: {
                base: mockedBaseHandler,
                br: mockedBrHandler,
            } as any,
            formatAppliers: appliers,
            defaultModelHandlers: {
                base: mockedBaseHandler,
            } as any,
            onNodeCreated,
        });
    });
});
