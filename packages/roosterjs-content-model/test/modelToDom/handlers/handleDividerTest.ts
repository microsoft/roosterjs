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

    it('HR with width, size and display', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {
                display: 'inline-block',
                width: '98%',
            },
            size: '2',
        };

        const parent = document.createElement('div');

        handleDivider(document, parent, hr, context, null);

        expect(
            [
                '<hr size="2" style="display: inline-block; width: 98%;">',
                '<hr style="display: inline-block; width: 98%;" size="2">',
            ].indexOf(parent.innerHTML) >= 0
        ).toBeTrue();
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

        const result = handleDivider(document, parent, hr, context, br);

        expect(parent.innerHTML).toBe('<hr><br>');
        expect(hr.cachedElement).toBe(parent.firstChild as HTMLElement);
        expect(result).toBe(br);
    });

    it('HR with refNode, already in target node', () => {
        const hrNode = document.createElement('hr');
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
            cachedElement: hrNode,
        };

        const parent = document.createElement('div');
        const br = document.createElement('br');

        parent.appendChild(hrNode);
        parent.appendChild(br);

        const result = handleDivider(document, parent, hr, context, hrNode);

        expect(parent.innerHTML).toBe('<hr><br>');
        expect(hr.cachedElement).toBe(hrNode);
        expect(parent.firstChild).toBe(hrNode);
        expect(result).toBe(br);
    });

    it('With onNodeCreated', () => {
        const hr: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        };
        const onNodeCreated = jasmine.createSpy('onNodeCreated');
        const parent = document.createElement('div');

        context.onNodeCreated = onNodeCreated;

        handleDivider(document, parent, hr, context, null);

        expect(parent.innerHTML).toBe('<hr>');
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(hr);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('hr'));
    });
});
