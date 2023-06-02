import * as contentModelToDom from '../../../lib/modelToDom/contentModelToDom';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { setContentModel } from '../../../lib/editor/coreApi/setContentModel';

const mockedRange = 'RANGE' as any;
const mockedDoc = 'DOCUMENT' as any;
const mockedModel = 'MODEL' as any;
const mockedContext = 'CONTEXT' as any;
const mockedDiv = { ownerDocument: mockedDoc } as any;

describe('setContentModel', () => {
    let core: ContentModelEditorCore;
    let contentModelToDomSpy: jasmine.Spy;
    let createEditorContext: jasmine.Spy;
    let select: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;

    beforeEach(() => {
        contentModelToDomSpy = spyOn(contentModelToDom, 'default').and.returnValue(mockedRange);
        createEditorContext = jasmine
            .createSpy('createEditorContext')
            .and.returnValue(mockedContext);
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

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            {}
        );
        expect(select).toHaveBeenCalledWith(core, mockedRange);
    });

    it('with default option, no shadow edit', () => {
        const defaultOption = { o: 'OPTION' } as any;
        core.defaultModelToDomOptions = defaultOption;
        setContentModel(core, mockedModel);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            defaultOption
        );
        expect(select).toHaveBeenCalledWith(core, mockedRange);
    });

    it('with default option, no shadow edit, with additional option', () => {
        const defaultOption = { o: 'OPTION' } as any;
        const additionalOption = { o: 'OPTION1', o2: 'OPTION2' } as any;

        core.defaultModelToDomOptions = defaultOption;
        setContentModel(core, mockedModel, additionalOption);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            additionalOption
        );
        expect(select).toHaveBeenCalledWith(core, mockedRange);
    });

    it('no default option, with shadow edit', () => {
        core.lifecycle.shadowEditFragment = {} as any;

        setContentModel(core, mockedModel);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext,
            {}
        );
        expect(select).not.toHaveBeenCalled();
    });
});
