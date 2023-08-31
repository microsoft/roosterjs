import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { defaultContentModelHandlers } from '../../../lib/modelToDom/context/defaultContentModelHandlers';
import { EditorContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { getFormatAppliers } from '../../../lib/formatHandlers/defaultFormatHandlers';

describe('createModelToDomContext', () => {
    const editorContext: EditorContext = {};
    const defaultResult: ModelToDomContext = {
        ...editorContext,
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
        formatAppliers: getFormatAppliers(),
        modelHandlers: defaultContentModelHandlers,
        defaultModelHandlers: defaultContentModelHandlers,
        onNodeCreated: undefined,
    };
    it('no param', () => {
        const context = createModelToDomContext();

        expect(context).toEqual(defaultResult);
    });

    it('with content model context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
        };

        const context = createModelToDomContext(editorContext);

        expect(context).toEqual({
            ...defaultResult,
            ...editorContext,
        });
    });

    it('with overrides', () => {
        const mockedBoldApplier = 'bold' as any;
        const mockedBlockApplier = 'block' as any;
        const mockedBrHandler = 'br' as any;
        const onNodeCreated = 'OnNodeCreated' as any;
        const context = createModelToDomContext(undefined, {
            formatApplierOverride: {
                bold: mockedBoldApplier,
            },
            additionalFormatAppliers: {
                block: [mockedBlockApplier],
            },
            modelHandlerOverride: {
                br: mockedBrHandler,
            },
            onNodeCreated,
        });

        expect(context.regularSelection).toEqual({
            current: {
                block: null,
                segment: null,
            },
        });
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
        expect(context.implicitFormat).toEqual({});
        expect(context.formatAppliers.block).toEqual([
            ...getFormatAppliers().block,
            mockedBlockApplier,
        ]);
        expect(context.modelHandlers.br).toBe(mockedBrHandler);
        expect(context.defaultModelHandlers).toEqual(defaultContentModelHandlers);
        expect(context.onNodeCreated).toBe(onNodeCreated);
    });
});
