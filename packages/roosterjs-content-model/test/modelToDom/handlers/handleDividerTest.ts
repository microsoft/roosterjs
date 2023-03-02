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

        handleDivider(document, parent, hr, context, null);

        expect(parent.innerHTML).toBe('<hr>');
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
    });

    it('HR with format', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: { marginTop: '10px' },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context, null);

        expect(parent.innerHTML).toBe('<hr style="margin-top: 10px;">');
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
    });

    it('DIV with format', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'div',
            format: { marginTop: '10px' },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context, null);

        expect(parent.innerHTML).toBe('<div style="margin-top: 10px;"></div>');
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
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

        handleDivider(document, parent, hr, context, null);

        expect(parent.innerHTML).toBe('<hr style="display: inline-block; width: 98%;">');
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
    });

    it('HR with border and padding', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {
                borderTop: 'solid 1px black',
                paddingBottom: '30px',
            },
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context, null);

        expect(parent.innerHTML).toBe(
            '<hr style="padding-bottom: 30px; border-top: 1px solid black;">'
        );
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
    });

    it('HR with refNode', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        };

        const parent = document.createElement('div');
        const br = document.createElement('br');

        parent.appendChild(br);

        handleDivider(document, parent, hr, context, br);

        expect(parent.innerHTML).toBe('<hr><br>');
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
    });
});
