import * as cloneModel from 'roosterjs-content-model-dom/lib/modelApi/editing/cloneModel';
import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as updateCache from '../../../lib/corePlugin/cache/updateCache';
import { createContentModel } from '../../../lib/coreApi/createContentModel/createContentModel';
import {
    ContentModelDocument,
    DomToModelContext,
    DomToModelOptionForCreateModel,
    EditorCore,
    TextMutationObserver,
} from 'roosterjs-content-model-types';

const mockedEditorContext = 'EDITORCONTEXT' as any;
const originalContext = { context: 'Context' } as any;
const mockedModel = 'MODEL' as any;
const mockedDiv = 'DIV' as any;
const mockedCachedMode = 'CACHEDMODEL' as any;
const mockedClonedModel = 'CLONEDMODEL' as any;

describe('createContentModel', () => {
    let mockedContext: DomToModelContext;
    let core: EditorCore;
    let createEditorContext: jasmine.Spy;
    let getDOMSelection: jasmine.Spy;
    let domToContentModelSpy: jasmine.Spy;
    let cloneModelSpy: jasmine.Spy;

    beforeEach(() => {
        mockedContext = { ...originalContext } as any;

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
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, mockedContext);
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

    it('Do not reuse model, with cache, no shadow edit, has option', () => {
        const currentContext = 'CURRENTCONTEXT' as any;

        spyOn(createDomToModelContext, 'createDomToModelContext').and.returnValue(currentContext);

        const model = createContentModel(core, { tryGetFromCache: false });

        expect(cloneModelSpy).not.toHaveBeenCalled();
        expect(createEditorContext).toHaveBeenCalledWith(core, false);
        expect(getDOMSelection).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, currentContext);
        expect(model).toBe(mockedModel);
    });
});

describe('createContentModel with selection', () => {
    let mockedContext: DomToModelContext;
    let getDOMSelectionSpy: jasmine.Spy;
    let domToContentModelSpy: jasmine.Spy;
    let createEditorContextSpy: jasmine.Spy;
    let core: any;
    const MockedDiv = 'CONTENT_DIV' as any;

    beforeEach(() => {
        mockedContext = { ...originalContext } as any;
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
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
        expect(mockedContext).toEqual({
            ...originalContext,
            selection: {
                type: 'range',
                range: MockedRange,
            } as any,
        });
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
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
        expect(mockedContext).toEqual({
            ...originalContext,
            selection: {
                type: 'table',
                table: MockedContainer,
                coordinates: {
                    firstCell: MockedFirstCell,
                    lastCell: MockedLastCell,
                },
            } as any,
        });
    });

    it('Image selection', () => {
        const MockedContainer = 'MockedContainer';

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: MockedContainer,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
        expect(mockedContext).toEqual({
            ...originalContext,
            selection: {
                type: 'image',
                image: MockedContainer,
            } as any,
        });
    });

    it('Incorrect regular selection', () => {
        const mockedRange = {
            startContainer: null!,
        } as any;
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: mockedRange,
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
        expect(mockedContext).toEqual({
            ...originalContext,
            selection: {
                type: 'range',
                range: mockedRange,
            } as any,
        });
    });

    it('Incorrect table selection', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });

        createContentModel(core);

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
        expect(mockedContext).toEqual({
            ...originalContext,
            selection: {
                type: 'table',
            } as any,
        });
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
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
        expect(mockedContext).toEqual({
            ...originalContext,
            selection: {
                type: 'range',
                range: MockedRange,
            } as any,
        });
    });

    it('With selection override, selection=none', () => {
        createContentModel(core, undefined, 'none');

        expect(domToContentModelSpy).toHaveBeenCalledTimes(1);
        expect(domToContentModelSpy).toHaveBeenCalledWith(MockedDiv, mockedContext);
    });
});

/*
| Scenarios                         | can use cache | can write cache | comment                                                                                                        |
|-----------------------------------|---------------|-----------------|----------------------------------------------------------------------------------------------------------------|
| getContentModelCopy: connected    | false         | false           | This is now deprecated                                                                                         |
| getContentModelCopy: disconnected | false         | false           | Used by plugins and test code to read current model. We will return a cloned model, and do not impact cache    |
| getContentModelCopy: clean        | false         | false           | Used by export HTML, do not use cache to make sure the model is up to date                                     |
| formatInsertPointWithContentModel | false         | false           | Used by insertEntity (recent change), do not use cache since we need to add shadow insert point                |
| getFormatState                    | true          | false           | We can reuse cache if we have, but when there is no cache, we will create reduced model so do not impact cache |
| other formatContentModel cases    | true          | true            | Normal case, we can reuse cache, and should update cache                                                       |
*/
describe('createContentModel and cache management', () => {
    let core: EditorCore;
    let textMutationObserver: TextMutationObserver;
    let flushMutationsSpy: jasmine.Spy;
    let cloneModelSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let createEditorContextSpy: jasmine.Spy;
    let updateCacheSpy: jasmine.Spy;

    const mockedSelection = 'SELECTION' as any;
    const mockedFragment = 'FRAGMENT' as any;
    const mockedModel = { name: 'MODEL' } as any;
    const mockedNewModel = { name: 'NEWMODEL' } as any;

    function globalRunTest(
        hasCache: boolean,
        option: DomToModelOptionForCreateModel | undefined,
        hasSelection: boolean,
        isInShadowEdit: boolean,
        useCache: boolean,
        allowIndex: boolean,
        clone: boolean
    ) {
        flushMutationsSpy = jasmine.createSpy('flushMutations');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue(mockedSelection);
        createEditorContextSpy = jasmine.createSpy('createEditorContext');
        updateCacheSpy = spyOn(updateCache, 'updateCache');

        textMutationObserver = { flushMutations: flushMutationsSpy } as any;

        core = {
            cache: { textMutationObserver, cachedModel: hasCache ? mockedModel : null },
            lifecycle: {
                shadowEditFragment: isInShadowEdit ? mockedFragment : null,
            },
            api: {
                getDOMSelection: getDOMSelectionSpy,
                createEditorContext: createEditorContextSpy,
            },
            environment: {
                domToModelSettings: {},
            },
        } as any;

        cloneModelSpy = spyOn(cloneModel, 'cloneModel').and.callFake(
            x => x as ContentModelDocument
        );

        spyOn(domToContentModel, 'domToContentModel').and.returnValue(mockedNewModel);

        const result = createContentModel(core, option, hasSelection ? mockedSelection : undefined);

        expect(flushMutationsSpy).toHaveBeenCalled();
        expect(cloneModelSpy).toHaveBeenCalledTimes(clone ? 1 : 0);

        if (!useCache) {
            expect(createEditorContextSpy).toHaveBeenCalledWith(core, allowIndex);
        }

        if (useCache) {
            expect(result).toBe(mockedModel);
        } else {
            expect(result).toBe(mockedNewModel);
        }

        if (allowIndex && !useCache) {
            expect(updateCacheSpy).toHaveBeenCalledWith(
                core.cache,
                mockedNewModel,
                mockedSelection
            );
        } else if (hasCache) {
            expect(core.cache.cachedModel).toBe(mockedModel);
            expect(updateCacheSpy).not.toHaveBeenCalled();
        } else {
            expect(core.cache.cachedModel).toBe(null!);
            expect(updateCacheSpy).not.toHaveBeenCalled();
        }
    }

    describe('Has cache', () => {
        function runTest(
            option: DomToModelOptionForCreateModel | undefined,
            hasSelection: boolean,
            isInShadowEdit: boolean,
            useCache: boolean,
            allowIndex: boolean,
            clone: boolean
        ) {
            globalRunTest(true, option, hasSelection, isInShadowEdit, useCache, allowIndex, clone);
        }

        it('no option, no selectionOverride, no shadow edit', () => {
            runTest(undefined, false, false, true, true, false);
        });

        it('no option, no selectionOverride, has shadow edit', () => {
            runTest(undefined, false, true, true, true, true);
        });

        it('no option, has selectionOverride, no shadow edit', () => {
            runTest(undefined, true, false, false, false, false);
        });

        it('no option, has selectionOverride, has shadow edit', () => {
            runTest(undefined, true, true, false, false, false);
        });

        it('option allow cache, no selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: true }, false, false, true, false, false);
        });

        it('option allow cache, no selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: true }, false, true, true, false, true);
        });

        it('option allow cache, has selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: true }, true, false, false, false, false);
        });

        it('option allow cache, has selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: true }, true, true, false, false, false);
        });

        it('option not allow cache, no selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: false }, false, false, false, false, false);
        });

        it('option not allow cache, no selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: false }, false, true, false, false, false);
        });

        it('option not allow cache, has selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: false }, true, false, false, false, false);
        });

        it('option not allow cache, has selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: false }, true, true, false, false, false);
        });
    });

    describe('No cache', () => {
        function runTest(
            option: DomToModelOptionForCreateModel | undefined,
            hasSelection: boolean,
            isInShadowEdit: boolean,
            useCache: boolean,
            allowIndex: boolean,
            clone: boolean
        ) {
            globalRunTest(false, option, hasSelection, isInShadowEdit, useCache, allowIndex, clone);
        }

        it('no option, no selectionOverride, no shadow edit', () => {
            runTest(undefined, false, false, false, true, false);
        });

        it('no option, no selectionOverride, has shadow edit', () => {
            runTest(undefined, false, true, false, true, false);
        });

        it('no option, has selectionOverride, no shadow edit', () => {
            runTest(undefined, true, false, false, false, false);
        });

        it('no option, has selectionOverride, has shadow edit', () => {
            runTest(undefined, true, true, false, false, false);
        });

        it('option allow cache, no selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: true }, false, false, false, false, false);
        });

        it('option allow cache, no selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: true }, false, true, false, false, false);
        });

        it('option allow cache, has selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: true }, true, false, false, false, false);
        });

        it('option allow cache, has selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: true }, true, true, false, false, false);
        });

        it('option not allow cache, no selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: false }, false, false, false, false, false);
        });

        it('option not allow cache, no selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: false }, false, true, false, false, false);
        });

        it('option not allow cache, has selectionOverride, no shadow edit', () => {
            runTest({ tryGetFromCache: false }, true, false, false, false, false);
        });

        it('option not allow cache, has selectionOverride, has shadow edit', () => {
            runTest({ tryGetFromCache: false }, true, true, false, false, false);
        });
    });
});
