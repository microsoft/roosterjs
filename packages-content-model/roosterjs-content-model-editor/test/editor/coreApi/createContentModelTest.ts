import * as cloneModel from '../../../lib/modelApi/common/cloneModel';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { createContentModel } from '../../../lib/editor/coreApi/createContentModel';
import { DomToModelOption } from 'roosterjs-content-model-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import { tablePreProcessor } from '../../../lib/domToModel/processors/tablePreProcessor';

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
        const option: DomToModelOption = {};

        core.cachedModel = undefined;

        const model = createContentModel(core, option);

        expect(createEditorContext).toHaveBeenCalledWith(core);
        expect(getSelectionRangeEx).toHaveBeenCalledWith(core);
        expect(domToContentModelSpy).toHaveBeenCalledWith(
            mockedDiv,
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            mockedEditorContext,
            null
        );
        expect(model).toBe(mockedModel);
    });

    it('Reuse model, no shadow edit', () => {
        const option: DomToModelOption = {};
        const model = createContentModel(core, option);

        expect(createEditorContext).not.toHaveBeenCalled();
        expect(getSelectionRangeEx).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(model).toBe(mockedCachedMode);
    });

    it('Reuse model, with cache, with shadow edit', () => {
        const option: DomToModelOption = {};

        core.lifecycle.shadowEditFragment = {} as any;

        const model = createContentModel(core, option);

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
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            undefined,
            {
                type: SelectionRangeTypes.Normal,
                ranges: [MockedRange],
            }
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
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            undefined,
            {
                type: SelectionRangeTypes.TableSelection,
                table: MockedContainer,
                coordinates: {
                    firstCell: MockedFirstCell,
                    lastCell: MockedLastCell,
                },
            }
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
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            undefined,
            {
                type: SelectionRangeTypes.ImageSelection,
                image: MockedContainer,
            }
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
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            undefined,
            {
                type: SelectionRangeTypes.Normal,
                ranges: [],
            }
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
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            undefined,
            {
                type: SelectionRangeTypes.TableSelection,
            }
        );
    });
});
