import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { setContentModel } from '../../../lib/editor/coreApi/setContentModel';

const mockedRange = 'RANGE' as any;
const mockedDoc = 'DOCUMENT' as any;
const mockedModel = 'MODEL' as any;
const mockedEditorContext = 'EDITORCONTEXT' as any;
const mockedContext = 'CONTEXT' as any;
const mockedDiv = { ownerDocument: mockedDoc } as any;
const mockedConfig = 'CONFIG' as any;

describe('setContentModel', () => {
    let core: ContentModelEditorCore;
    let contentModelToDomSpy: jasmine.Spy;
    let createEditorContext: jasmine.Spy;
    let createModelToDomContextSpy: jasmine.Spy;
    let createModelToDomContextWithConfigSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let normalizeSpy: jasmine.Spy;

    beforeEach(() => {
        contentModelToDomSpy = spyOn(contentModelToDom, 'contentModelToDom').and.returnValue(
            mockedRange
        );
        createEditorContext = jasmine
            .createSpy('createEditorContext')
            .and.returnValue(mockedEditorContext);
        createModelToDomContextSpy = spyOn(
            createModelToDomContext,
            'createModelToDomContext'
        ).and.returnValue(mockedContext);
        createModelToDomContextWithConfigSpy = spyOn(
            createModelToDomContext,
            'createModelToDomContextWithConfig'
        ).and.returnValue(mockedContext);
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        normalizeSpy = jasmine.createSpy('normalize');

        mockedDiv.normalize = normalizeSpy;

        core = ({
            contentDiv: mockedDiv,
            api: {
                createEditorContext,
                setDOMSelection: setDOMSelectionSpy,
                getDOMSelection: getDOMSelectionSpy,
            },
            lifecycle: {},
            defaultModelToDomConfig: mockedConfig,
            cache: {},
        } as any) as ContentModelEditorCore;
    });

    it('no default option, no shadow edit', () => {
        setContentModel(core, mockedModel);

        expect(createModelToDomContextSpy).not.toHaveBeenCalled();
        expect(createModelToDomContextWithConfigSpy).toHaveBeenCalledWith(
            mockedConfig,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, mockedRange);
        expect(normalizeSpy).toHaveBeenCalledTimes(1);
        expect(normalizeSpy).toHaveBeenCalledWith();
        expect(core.cache.cachedSelection).toBe(mockedRange);
        expect(core.cache.cachedModel).toBe(mockedModel);
    });

    it('with default option, no shadow edit', () => {
        setContentModel(core, mockedModel);

        expect(createModelToDomContextWithConfigSpy).toHaveBeenCalledWith(
            mockedConfig,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, mockedRange);
        expect(normalizeSpy).toHaveBeenCalledTimes(1);
        expect(normalizeSpy).toHaveBeenCalledWith();
    });

    it('with default option, no shadow edit, with additional option', () => {
        const defaultOption = { o: 'OPTION' } as any;
        const additionalOption = { o: 'OPTION1', o2: 'OPTION2' } as any;

        core.defaultModelToDomOptions = [defaultOption];
        setContentModel(core, mockedModel, additionalOption);

        expect(createModelToDomContextSpy).toHaveBeenCalledWith(
            mockedEditorContext,
            defaultOption,
            additionalOption
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, mockedRange);
        expect(normalizeSpy).toHaveBeenCalledTimes(1);
        expect(normalizeSpy).toHaveBeenCalledWith();
    });

    it('no default option, with shadow edit', () => {
        core.lifecycle.shadowEditFragment = {} as any;

        setContentModel(core, mockedModel);

        expect(createModelToDomContextWithConfigSpy).toHaveBeenCalledWith(
            mockedConfig,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(normalizeSpy).toHaveBeenCalledTimes(1);
        expect(normalizeSpy).toHaveBeenCalledWith();
    });
});
