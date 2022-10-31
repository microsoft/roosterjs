import { ContentModelBr } from '../../../lib/publicTypes/segment/ContentModelBr';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleBr } from '../../../lib/modelToDom/handlers/handleBr';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        parent = document.createElement('div');
        context = createModelToDomContext();
    });

    it('Br segment', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: {},
        };

        handleBr(document, parent, br, context);

        expect(parent.innerHTML).toBe('<span><br></span>');
    });

    it('Br segment with format', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: { textColor: 'red' },
        };

        handleBr(document, parent, br, context);

        expect(parent.innerHTML).toBe('<span style="color: red;"><br></span>');
    });
});
