import DarkColorHandlerImpl from 'roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
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

        expect(parent.innerHTML).toBe('<span style="color: red;"><br></span>');
    });

    it('With onNodeCreated', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: { textColor: 'red' },
        };
        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;
        handleBr(document, parent, br, context);

        expect(parent.innerHTML).toBe('<span style="color: red;"><br></span>');
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(br);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('br'));
    });
});
