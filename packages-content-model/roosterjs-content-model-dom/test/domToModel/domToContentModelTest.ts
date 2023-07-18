import * as createDomToModelContext from '../../lib/domToModel/context/createDomToModelContext';
import * as normalizeContentModel from '../../lib/modelApi/common/normalizeContentModel';
import { domToContentModel } from '../../lib/domToModel/domToContentModel';
import {
    ContentModelDocument,
    DomToModelContext,
    EditorContext,
} from 'roosterjs-content-model-types';

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
            segmentFormat: {},
        } as any) as DomToModelContext;

        spyOn(createDomToModelContext, 'createDomToModelContext').and.returnValue(mockContext);
        spyOn(normalizeContentModel, 'normalizeContentModel');

        const rootElement = document.createElement('div');
        const options = {};
        const editorContext: EditorContext = {
            defaultFormat: {
                fontSize: '10pt',
            },
        };
        const model = domToContentModel(rootElement, options, editorContext);
        const result: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
            format: {
                fontSize: '10pt',
            },
        };

        expect(model).toEqual(result);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledTimes(1);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledWith(
            editorContext,
            options,
            undefined
        );
        expect(elementProcessor).not.toHaveBeenCalled();
        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(childProcessor).toHaveBeenCalledWith(result, rootElement, mockContext);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(result);
    });
});
