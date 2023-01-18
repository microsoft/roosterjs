import { ContentModelDivider } from '../../../lib/publicTypes/block/ContentModelDivider';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleDivider } from '../../../lib/modelToDom/handlers/handleDivider';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleDivider', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    it('Simple HR', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr>');
    });

    it('HR with format', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: { marginTop: '10px' },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr style="margin-top: 10px;">');
    });

    it('DIV with format', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'div',
            format: { marginTop: '10px' },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<div style="margin-top: 10px;"></div>');
    });

    it('HR with size and display', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {
                display: 'inline-block',
                width: '98%',
            },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context);

        expect(parent.innerHTML).toBe('<hr style="display: inline-block; width: 98%;">');
    });
});
