import * as delimiterProcessorFile from '../../../lib/domToModel/processors/childProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { delimiterProcessor } from '../../../lib/domToModel/processors/delimiterProcessor';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';

describe('delimiterProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Delimiter', () => {
        const doc = createContentModelDocument();
        const br = document.createElement('span');
        br.append(document.createTextNode(''));
        spyOn(delimiterProcessorFile, 'handleRegularSelection');

        delimiterProcessor(doc, br, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(delimiterProcessorFile.handleRegularSelection).toHaveBeenCalledTimes(2);
    });
});
