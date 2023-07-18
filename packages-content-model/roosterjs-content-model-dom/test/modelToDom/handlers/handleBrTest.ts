import DarkColorHandlerImpl from 'roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
import { ContentModelBr, ModelToDomContext } from 'roosterjs-content-model-types';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleBr } from '../../../lib/modelToDom/handlers/handleBr';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        parent = document.createElement('div');
        context = createModelToDomContext();
        context.darkColorHandler = new DarkColorHandlerImpl({} as any, s => 'darkMock: ' + s);
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

        expect(parent.innerHTML).toBe(
            '<span style="color: var(--darkColor_red, red);"><br></span>'
        );
    });

    it('With onNodeCreated', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: { textColor: 'red' },
        };
        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;
        handleBr(document, parent, br, context);

        expect(parent.innerHTML).toBe(
            '<span style="color: var(--darkColor_red, red);"><br></span>'
        );
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(br);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('br'));
    });
});
