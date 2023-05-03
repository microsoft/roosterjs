import * as cloneModel from '../../../lib/modelApi/common/cloneModel';
import * as domToContentModel from '../../../lib/domToModel/domToContentModel';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { createContentModel } from '../../../lib/editor/coreApi/createContentModel';
import { DomToModelOption } from '../../../lib/publicTypes/IContentModelEditor';

const mockedEditorContext = 'EDITORCONTEXT' as any;
const mockedRange = 'RANGE' as any;
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
        getSelectionRangeEx = jasmine.createSpy('getSelectionRangeEx').and.returnValue(mockedRange);

        domToContentModelSpy = spyOn(domToContentModel, 'default').and.returnValue(mockedModel);
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

    it('Not reuse model, no shadow edit', () => {
        const option: DomToModelOption = {};

        const model = createContentModel(core, option);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(getSelectionRangeEx).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, mockedEditorContext, {
            selectionRange: mockedRange,
        });
        expect(model).toBe(mockedModel);
    });

    it('Not reuse model, no shadow edit, with default options', () => {
        const defaultOption = { o: 'OPTION' } as any;
        const option: DomToModelOption = {};

        core.defaultDomToModelOptions = defaultOption;

        const model = createContentModel(core, option);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(getSelectionRangeEx).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, mockedEditorContext, {
            selectionRange: mockedRange,
            ...defaultOption,
        });
        expect(model).toBe(mockedModel);
    });

    it('Not reuse model, no shadow edit, with default options and additional option', () => {
        const defaultOption = { o: 'OPTION' } as any;
        const additionalOption = { o: 'OPTION1', o2: 'OPTION2' } as any;

        core.defaultDomToModelOptions = defaultOption;

        const model = createContentModel(core, additionalOption);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(getSelectionRangeEx).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, mockedEditorContext, {
            selectionRange: mockedRange,
            ...additionalOption,
        });
        expect(model).toBe(mockedModel);
    });

    it('Reuse model, no cache, no shadow edit', () => {
        const option: DomToModelOption = {};

        core.reuseModel = true;
        core.cachedModel = undefined;

        const model = createContentModel(core, option);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(getSelectionRangeEx).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedDiv, mockedEditorContext, {
            selectionRange: mockedRange,
            allowCacheElement: true,
        });
        expect(model).toBe(mockedModel);
    });

    it('Reuse model, no shadow edit', () => {
        const option: DomToModelOption = {};

        core.reuseModel = true;

        const model = createContentModel(core, option);

        expect(createEditorContext).not.toHaveBeenCalled();
        expect(getSelectionRangeEx).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(model).toBe(mockedCachedMode);
    });

    it('Reuse model, with cache, with shadow edit', () => {
        const option: DomToModelOption = {};

        core.reuseModel = true;
        core.lifecycle.shadowEditFragment = {} as any;

        const model = createContentModel(core, option);

        expect(cloneModelSpy).toHaveBeenCalledWith(mockedCachedMode);
        expect(createEditorContext).not.toHaveBeenCalled();
        expect(getSelectionRangeEx).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(model).toBe(mockedClonedModel);
    });
});
