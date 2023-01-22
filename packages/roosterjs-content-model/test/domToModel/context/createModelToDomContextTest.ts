import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { defaultContentModelHandlers } from '../../../lib/modelToDom/context/defaultContentModelHandlers';
import { defaultImplicitFormatMap } from '../../../lib/formatHandlers/utils/defaultStyles';
import { EditorContext } from '../../../lib/publicTypes/context/EditorContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import {
    defaultFormatAppliers,
    getFormatAppliers,
} from '../../../lib/formatHandlers/defaultFormatHandlers';

describe('createModelToDomContext', () => {
    const editorContext: EditorContext = {
        isDarkMode: false,
        zoomScale: 1,
        isRightToLeft: false,
    };
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
        defaultImplicitFormatMap: defaultImplicitFormatMap,
        entities: {},
        defaultModelHandlers: defaultContentModelHandlers,
        defaultFormatAppliers: defaultFormatAppliers,
        doNotReuseEntityDom: false,
        newDarkColors: {},
    };
    it('no param', () => {
        const context = createModelToDomContext();

        expect(context).toEqual(defaultResult);
    });

    it('with content model context', () => {
        const editorContext: EditorContext = {
            isDarkMode: true,
            zoomScale: 2,
            isRightToLeft: true,
        };

        const context = createModelToDomContext(editorContext);

        expect(context).toEqual({
            ...defaultResult,
            ...editorContext,
        });
    });

    it('with overrides', () => {
        const mockedMergingCallback = 'mergingCallback' as any;
        const mockedBoldApplier = 'bold' as any;
        const mockedBlockApplier = 'block' as any;
        const mockedBrHandler = 'br' as any;
        const mockedAStyle = 'a' as any;
        const context = createModelToDomContext(undefined, {
            mergingCallback: mockedMergingCallback,
            formatApplierOverride: {
                bold: mockedBoldApplier,
            },
            additionalFormatAppliers: {
                block: [mockedBlockApplier],
            },
            modelHandlerOverride: {
                br: mockedBrHandler,
            },
            defaultImplicitFormatOverride: {
                a: mockedAStyle,
            },
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
        expect(context.defaultImplicitFormatMap.a).toEqual(mockedAStyle);
        expect(context.entities).toEqual({});
        expect(context.defaultModelHandlers).toEqual(defaultContentModelHandlers);
        expect(context.defaultFormatAppliers).toEqual(defaultFormatAppliers);
    });
});
