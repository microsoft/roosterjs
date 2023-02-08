import * as createDomToModelContext from '../../lib/domToModel/context/createDomToModelContext';
import * as normalizeContentModel from '../../lib/modelApi/common/normalizeContentModel';
import domToContentModel from '../../lib/domToModel/domToContentModel';
import { ContentModelDocument } from '../../lib/publicTypes/group/ContentModelDocument';
import { DomToModelContext } from '../../lib/publicTypes/context/DomToModelContext';

describe('domToContentModel', () => {
    it('Not include root', () => {
        const elementProcessor = jasmine.createSpy('elementProcessor');
        const childProcessor = jasmine.createSpy('childProcessor');
        const mockContext = ({
            elementProcessors: {
                element: elementProcessor,
                child: childProcessor,
            },
            defaultStyles: {},
            zoomScaleFormat: {},
            segmentFormat: {},
        } as any) as DomToModelContext;

        spyOn(createDomToModelContext, 'createDomToModelContext').and.returnValue(mockContext);
        spyOn(normalizeContentModel, 'normalizeContentModel');

        const rootElement = document.createElement('div');
        const options = {
            includeRoot: false,
        };
        const editorContext = { isDarkMode: false };
        const model = domToContentModel(rootElement, editorContext, options);
        const result: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };

        expect(model).toEqual(result);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledTimes(1);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledWith(
            editorContext,
            options
        );
        expect(elementProcessor).not.toHaveBeenCalled();
        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(childProcessor).toHaveBeenCalledWith(result, rootElement, mockContext);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(result);
    });

    it('Include root', () => {
        const elementProcessor = jasmine.createSpy('elementProcessor');
        const childProcessor = jasmine.createSpy('childProcessor');
        const mockContext = ({
            elementProcessors: {
                element: elementProcessor,
                child: childProcessor,
            },
            defaultStyles: {},
            zoomScaleFormat: {},
            segmentFormat: {},
        } as any) as DomToModelContext;

        spyOn(createDomToModelContext, 'createDomToModelContext').and.returnValue(mockContext);
        spyOn(normalizeContentModel, 'normalizeContentModel');

        const rootElement = document.createElement('div');
        const options = {
            includeRoot: true,
        };
        const editorContext = { isDarkMode: false };
        const model = domToContentModel(rootElement, editorContext, options);
        const result: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };

        expect(model).toEqual(result);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledTimes(1);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledWith(
            editorContext,
            options
        );
        expect(childProcessor).not.toHaveBeenCalled();
        expect(elementProcessor).toHaveBeenCalledTimes(1);
        expect(elementProcessor).toHaveBeenCalledWith(result, rootElement, mockContext);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(result);
    });
});
