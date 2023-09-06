import * as cloneModel from '../../../lib/modelApi/common/cloneModel';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { createContentModel } from '../../../lib/editor/coreApi/createContentModel';
import { createDomToModelContext } from 'roosterjs-content-model-dom';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

const mockedEditorContext = 'EDITORCONTEXT' as any;
const mockedModel = 'MODEL' as any;
const mockedDiv = 'DIV' as any;
const mockedCachedMode = 'CACHEDMODEL' as any;
const mockedClonedModel = 'CLONEDMODEL' as any;

describe('createContentModel', () => {
    let core: ContentModelEditorCore;
    let createEditorContext: jasmine.Spy;
    let getSelectionRangeEx: jasmine.Spy;
    let domToContentModelSpy: jasmine.Spy;
    let cloneModelSpy: jasmine.Spy;

    beforeEach(() => {
        createEditorContext = jasmine
            .createSpy('createEditorContext')
            .and.returnValue(mockedEditorContext);
        getSelectionRangeEx = jasmine.createSpy('getSelectionRangeEx').and.returnValue(null);

        domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            mockedModel
        );
        cloneModelSpy = spyOn(cloneModel, 'cloneModel').and.returnValue(mockedClonedModel);

        core = ({
            contentDiv: mockedDiv,
            api: {
                createEditorContext,
                getSelectionRangeEx,
            },
            cachedModel: mockedCachedMode,
            lifecycle: {},
        } as any) as ContentModelEditorCore;
    });

    it('Reuse model, no cache, no shadow edit', () => {
        core.cachedModel = undefined;

        const model = createContentModel(core);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(getSelectionRangeEx).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            mockedDiv,
            createDomToModelContext(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                mockedEditorContext
            )
        );
        expect(model).toBe(mockedModel);
    });

    it('Reuse model, no shadow edit', () => {
        const model = createContentModel(core);

        expect(createEditorContext).not.toHaveBeenCalled();
        expect(getSelectionRangeEx).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(model).toBe(mockedCachedMode);
    });

    it('Reuse model, with cache, with shadow edit', () => {
        core.lifecycle.shadowEditFragment = {} as any;

        const model = createContentModel(core);

        expect(cloneModelSpy).toHaveBeenCalledWith(mockedCachedMode, {
            includeCachedElement: true,
        });
        expect(createEditorContext).not.toHaveBeenCalled();
        expect(getSelectionRangeEx).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(model).toBe(mockedClonedModel);
    });
});

describe('createContentModel with selection', () => {
    let getSelectionRangeExSpy: jasmine.Spy;
    let domToContentModelSpy: jasmine.Spy;
    let createEditorContextSpy: jasmine.Spy;
    let core: any;
    const MockedDiv = 'CONTENT_DIV' as any;

    beforeEach(() => {
        getSelectionRangeExSpy = jasmine.createSpy('getSelectionRangeEx');
        domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel');
        createEditorContextSpy = jasmine.createSpy('createEditorContext');

        core = {
            contentDiv: MockedDiv,
            api: {
                getSelectionRangeEx: getSelectionRangeExSpy,
                createEditorContext: createEditorContextSpy,
            },
        };
    });

    it('Regular selection', () => {
        const MockedContainer = 'MockedContainer';
        const MockedRange = {
            name: 'MockedRange',
            commonAncestorContainer: MockedContainer,
        } as any;

        getSelectionRangeExSpy.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [MockedRange],
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            MockedDiv,
            createDomToModelContext(undefined, undefined, undefined, undefined, {
                type: SelectionRangeTypes.Normal,
                ranges: [MockedRange],
            } as any)
        );
    });

    it('Table selection', () => {
        const MockedContainer = 'MockedContainer';
        const MockedFirstCell = { name: 'FirstCell' };
        const MockedLastCell = { name: 'LastCell' };

        getSelectionRangeExSpy.and.returnValue({
            type: SelectionRangeTypes.TableSelection,
            table: MockedContainer,
            coordinates: {
                firstCell: MockedFirstCell,
                lastCell: MockedLastCell,
            },
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            MockedDiv,
            createDomToModelContext(undefined, undefined, undefined, undefined, {
                type: SelectionRangeTypes.TableSelection,
                table: MockedContainer,
                coordinates: {
                    firstCell: MockedFirstCell,
                    lastCell: MockedLastCell,
                },
            } as any)
        );
    });

    it('Image selection', () => {
        const MockedContainer = 'MockedContainer';

        getSelectionRangeExSpy.and.returnValue({
            type: SelectionRangeTypes.ImageSelection,
            image: MockedContainer,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            MockedDiv,
            createDomToModelContext(undefined, undefined, undefined, undefined, {
                type: SelectionRangeTypes.ImageSelection,
                image: MockedContainer,
            } as any)
        );
    });

    it('Incorrect regular selection', () => {
        getSelectionRangeExSpy.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [],
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            MockedDiv,
            createDomToModelContext(undefined, undefined, undefined, undefined, {
                type: SelectionRangeTypes.Normal,
                ranges: [],
            } as any)
        );
    });

    it('Incorrect table selection', () => {
        getSelectionRangeExSpy.and.returnValue({
            type: SelectionRangeTypes.TableSelection,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            MockedDiv,
            createDomToModelContext(undefined, undefined, undefined, undefined, {
                type: SelectionRangeTypes.TableSelection,
            } as any)
        );
    });
});
