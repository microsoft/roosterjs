import { ContentModelHR } from '../../../lib/publicTypes/block/ContentModelHR';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleHR } from '../../../lib/modelToDom/handlers/handleHr';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleHR', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    it('Simple HR', () => {
        const hr: ContentModelHR = {
            blockType: 'HR',
            format: {},
        };

        const parent = document.createElement('div');

        handleHR(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr>');
    });

    it('HR with format', () => {
        const hr: ContentModelHR = {
            blockType: 'HR',
            format: { marginTop: '10px' },
        };

        const parent = document.createElement('div');

        handleHR(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr style="margin-top: 10px;">');
    });
});
