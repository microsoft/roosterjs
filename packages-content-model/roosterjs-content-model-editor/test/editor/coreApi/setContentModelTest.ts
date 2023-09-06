import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { ModelToDomOption } from 'roosterjs-content-model-types';
import { setContentModel } from '../../../lib/editor/coreApi/setContentModel';

const mockedRange = 'RANGE' as any;
const mockedDoc = 'DOCUMENT' as any;
const mockedModel = 'MODEL' as any;
const mockedEditorContext = 'EDITORCONTEXT' as any;
const mockedContext = 'CONTEXT' as any;
const mockedDiv = { ownerDocument: mockedDoc } as any;

describe('setContentModel', () => {
    let core: ContentModelEditorCore;
    let contentModelToDomSpy: jasmine.Spy;
    let createEditorContext: jasmine.Spy;
    let createModelToDomContextSpy: jasmine.Spy;
    let select: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;

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
        select = jasmine.createSpy('select');
        getSelectionRange = jasmine.createSpy('getSelectionRange');

        core = ({
            contentDiv: mockedDiv,
            api: {
                createEditorContext,
                select,
                getSelectionRange,
            },
            lifecycle: {},
        } as any) as ContentModelEditorCore;
    });

    it('no default option, no shadow edit', () => {
        setContentModel(core, mockedModel);

        expect(createModelToDomContextSpy).toHaveBeenCalledWith(
            undefined,
            undefined,
            {},
            [undefined, undefined],
            undefined,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(select).toHaveBeenCalledWith(core, mockedRange);
    });

    it('with default option, no shadow edit', () => {
        setContentModel(core, mockedModel);

        expect(createModelToDomContextSpy).toHaveBeenCalledWith(
            undefined,
            undefined,
            {},
            [undefined, undefined],
            undefined,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(select).toHaveBeenCalledWith(core, mockedRange);
    });

    it('with default option, no shadow edit, with additional option', () => {
        const override = {
            block: 'MOCK' as any,
        };
        const additionalOption: ModelToDomOption = { modelHandlerOverride: override };

        setContentModel(core, mockedModel, additionalOption);

        expect(createModelToDomContextSpy).toHaveBeenCalledWith(
            undefined,
            override,
            {},
            [undefined, undefined],
            undefined,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(select).toHaveBeenCalledWith(core, mockedRange);
    });

    it('no default option, with shadow edit', () => {
        core.lifecycle.shadowEditFragment = {} as any;

        setContentModel(core, mockedModel);

        expect(createModelToDomContextSpy).toHaveBeenCalledWith(
            undefined,
            undefined,
            {},
            [undefined, undefined],
            undefined,
            mockedEditorContext
        );
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(select).not.toHaveBeenCalled();
    });
});
