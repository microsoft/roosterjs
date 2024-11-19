import { defaultContentModelHandlers } from '../../../lib/modelToDom/context/defaultContentModelHandlers';
import { defaultFormatAppliers } from '../../../lib/formatHandlers/defaultFormatHandlers';
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
            defaultFormatAppliers,
            metadataAppliers: {},
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('with editor context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createModelToDomContext(editorContext);

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
            defaultFormatAppliers,
            metadataAppliers: {},
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('with overrides', () => {
        const mockedBoldApplier = 'bold' as any;
        const mockedBlockApplier = 'block' as any;
        const mockedBrHandler = 'br' as any;
        const mockedTextApplier1 = 'applier1' as any;
        const mockedTextApplier2 = 'applier2' as any;
        const context = createModelToDomContext(
            undefined,
            {
                modelHandlerOverride: {
                    br: mockedBrHandler,
                },
                formatApplierOverride: {
                    bold: mockedBoldApplier,
                },
                additionalFormatAppliers: {
                    block: [mockedBlockApplier],
                    text: [mockedTextApplier1],
                },
            },
            {
                additionalFormatAppliers: {
                    text: [mockedTextApplier2],
                },
            }
        );

        const appliers = buildFormatAppliers();

        appliers.block[5] = mockedBlockApplier;
        appliers.elementBasedSegment[4] = mockedBoldApplier;
        appliers.segment[7] = mockedBoldApplier;
        appliers.segmentOnBlock[7] = mockedBoldApplier;
        appliers.segmentOnTableCell[7] = mockedBoldApplier;
        appliers.text = [mockedTextApplier1, mockedTextApplier2];

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
                ...defaultContentModelHandlers,
                br: mockedBrHandler,
            } as any,
            formatAppliers: appliers,
            defaultModelHandlers: defaultContentModelHandlers,
            defaultFormatAppliers,
            metadataAppliers: {},
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });
});
