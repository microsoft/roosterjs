import * as cloneModel from '../../../lib/publicApi/model/cloneModel';
import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import { createContentModel } from '../../../lib/coreApi/createContentModel/createContentModel';
import { EditorCore } from 'roosterjs-content-model-types';

const mockedEditorContext = 'EDITORCONTEXT' as any;
const mockedContext = 'CONTEXT' as any;
const mockedModel = 'MODEL' as any;
const mockedDiv = 'DIV' as any;
const mockedCachedMode = 'CACHEDMODEL' as any;
const mockedClonedModel = 'CLONEDMODEL' as any;

describe('createContentModel', () => {
    let core: EditorCore;
    let createEditorContext: jasmine.Spy;
    let getDOMSelection: jasmine.Spy;
    let domToContentModelSpy: jasmine.Spy;
    let cloneModelSpy: jasmine.Spy;

    beforeEach(() => {
        createEditorContext = jasmine
            .createSpy('createEditorContext')
            .and.returnValue(mockedEditorContext);
        getDOMSelection = jasmine.createSpy('getDOMSelection').and.returnValue(null);

        domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            mockedModel
        );
        cloneModelSpy = spyOn(cloneModel, 'cloneModel').and.returnValue(mockedClonedModel);

        spyOn(createDomToModelContext, 'createDomToModelContextWithConfig').and.returnValue(
            mockedContext
        );

        core = ({
            physicalRoot: mockedDiv,
            logicalRoot: mockedDiv,
            api: {
                createEditorContext,
                getDOMSelection,
            },
            cache: {
                cachedModel: mockedCachedMode,
            },
            lifecycle: {},
            environment: {
                domToModelSettings: {},
            },
        } as any) as EditorCore;
    });

    it('Reuse model, no cache, no shadow edit', () => {
        core.cache.cachedModel = undefined;

        const model = createContentModel(core);

        expect(createEditorContext).toHaveBeenCalledWith(core, true);
        expect(getDOMSelection).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, mockedContext, undefined);
        expect(model).toBe(mockedModel);
    });

    it('Reuse model, no shadow edit', () => {
        const model = createContentModel(core);

        expect(createEditorContext).not.toHaveBeenCalled();
        expect(getDOMSelection).not.toHaveBeenCalled();
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
        expect(getDOMSelection).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(model).toBe(mockedClonedModel);
    });
});

describe('createContentModel with selection', () => {
    let getDOMSelectionSpy: jasmine.Spy;
    let domToContentModelSpy: jasmine.Spy;
    let createEditorContextSpy: jasmine.Spy;
    let core: any;
    const MockedDiv = 'CONTENT_DIV' as any;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel');
        createEditorContextSpy = jasmine.createSpy('createEditorContext');

        spyOn(createDomToModelContext, 'createDomToModelContextWithConfig').and.returnValue(
            mockedContext
        );

        core = {
            physicalRoot: MockedDiv,
            logicalRoot: MockedDiv,
            api: {
                getDOMSelection: getDOMSelectionSpy,
                createEditorContext: createEditorContextSpy,
            },
            cache: {},
            environment: {
                domToModelSettings: {},
            },
        };
    });

    it('Regular selection', () => {
        const MockedContainer = 'MockedContainer';
        const MockedRange = {
            name: 'MockedRange',
            commonAncestorContainer: MockedContainer,
        } as any;

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: MockedRange,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, {
            type: 'range',
            range: MockedRange,
        } as any);
    });

    it('Table selection', () => {
        const MockedContainer = 'MockedContainer';
        const MockedFirstCell = { name: 'FirstCell' };
        const MockedLastCell = { name: 'LastCell' };

        getDOMSelectionSpy.and.returnValue({
            type: 'table',
            table: MockedContainer,
            coordinates: {
                firstCell: MockedFirstCell,
                lastCell: MockedLastCell,
            },
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, {
            type: 'table',
            table: MockedContainer,
            coordinates: {
                firstCell: MockedFirstCell,
                lastCell: MockedLastCell,
            },
        } as any);
    });

    it('Image selection', () => {
        const MockedContainer = 'MockedContainer';

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: MockedContainer,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, {
            type: 'image',
            image: MockedContainer,
        } as any);
    });

    it('Incorrect regular selection', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: null!,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, {
            type: 'range',
            range: null!,
        } as any);
    });

    it('Incorrect table selection', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, {
            type: 'table',
        } as any);
    });

    it('Flush mutation before create model', () => {
        const cachedModel = 'MODEL1' as any;
        const updatedModel = 'MODEL2' as any;
        const flushMutationsSpy = jasmine.createSpy('flushMutations').and.callFake(() => {
            core.cache.cachedModel = updatedModel;
        });

        core.cache.cachedModel = cachedModel;
        core.lifecycle = {};

        core.cache.textMutationObserver = {
            flushMutations: flushMutationsSpy,
        } as any;

        const model = createContentModel(core);

        expect(model).toBe(updatedModel);
        expect(flushMutationsSpy).toHaveBeenCalledTimes(1);
    });

    it('With selection override', () => {
        const MockedContainer = 'MockedContainer';
        const MockedRange = {
            name: 'MockedRange',
            commonAncestorContainer: MockedContainer,
        } as any;
        const mockedSelection = {
            type: 'range',
            range: MockedRange,
        } as any;

        createContentModel(core, undefined, mockedSelection);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, {
            type: 'range',
            range: MockedRange,
        } as any);
    });

    it('With selection override, selection=none', () => {
        createContentModel(core, undefined, 'none');

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext, undefined);
    });
});
