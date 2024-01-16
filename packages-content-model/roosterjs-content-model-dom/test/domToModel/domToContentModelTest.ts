import * as normalizeContentModel from '../../lib/modelApi/common/normalizeContentModel';
import { domToContentModel } from '../../lib/domToModel/domToContentModel';
import { ContentModelDocument, DomToModelContext } from 'roosterjs-content-model-types';

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
            isDarkMode: false,
            defaultFormat: {
                fontSize: '10pt',
            },
        } as any) as DomToModelContext;

        spyOn(normalizeContentModel, 'normalizeContentModel');

        const rootElement = document.createElement('div');
        const model = domToContentModel(rootElement, mockContext);
        const result: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
            format: {
                fontSize: '10pt',
            },
        };

        expect(model).toEqual(result);
        expect(elementProcessor).not.toHaveBeenCalled();
        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(childProcessor).toHaveBeenCalledWith(result, rootElement, mockContext);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(result);
    });
});
