import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import { EditorCore } from 'roosterjs-editor-types';
import { setContentModel } from '../../lib/coreApi/setContentModel';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

const mockedRange = {
    type: 'image',
} as any;
const mockedDoc = 'DOCUMENT' as any;
const mockedModel = 'MODEL' as any;
const mockedEditorContext = 'EDITORCONTEXT' as any;
const mockedContext = 'CONTEXT' as any;
const mockedDiv = { ownerDocument: mockedDoc } as any;
const mockedConfig = 'CONFIG' as any;

describe('setContentModel', () => {
    let core: StandaloneEditorCore & EditorCore;
    let contentModelToDomSpy: jasmine.Spy;
    let createEditorContext: jasmine.Spy;
    let createModelToDomContextSpy: jasmine.Spy;
    let createModelToDomContextWithConfigSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;

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
        } as any) as StandaloneEditorCore & EditorCore;
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
    });

    it('option ignore selection ', () => {
        core.selection = {
            selection: null,
            selectionStyleNode: null,
        };
        setContentModel(core, mockedModel, {
            ignoreSelection: true,
        });

        expect(createModelToDomContextSpy).toHaveBeenCalledWith(mockedEditorContext, {
            ignoreSelection: true,
        });
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(core.selection.selection).toBe(mockedRange);
    });
});
