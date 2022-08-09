import * as containerProcessor from '../../../lib/domToModel/processors/containerProcessor';
import * as createGeneralBlock from '../../../lib/modelApi/creators/createGeneralBlock';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/block/group/ContentModelGeneralBlock';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/domToModel/context/DomToModelContext';
import { generalBlockProcessor } from '../../../lib/domToModel/processors/generalBlockProcessor';

describe('generalBlockProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        spyOn(containerProcessor, 'containerProcessor');
        context = createDomToModelContext();
    });

    it('Process a DIV element', () => {
        const doc = createContentModelDocument(document);
        const div = document.createElement('div');
        const block: ContentModelGeneralBlock = {
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            element: div,
            blocks: [],
        };

        spyOn(createGeneralBlock, 'createGeneralBlock').and.returnValue(block);
        generalBlockProcessor(doc, div, context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [block],
            document: document,
        });
        expect(createGeneralBlock.createGeneralBlock).toHaveBeenCalledTimes(1);
        expect(createGeneralBlock.createGeneralBlock).toHaveBeenCalledWith(div);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(1);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(block, div, context);
    });
});
