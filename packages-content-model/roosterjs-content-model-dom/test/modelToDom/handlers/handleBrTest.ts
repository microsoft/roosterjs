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

        handleBr(document, parent, br, context, null!);

        expect(parent.innerHTML).toBe('<span><br></span>');
    });

    it('Br segment with format', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: { textColor: 'red' },
        };

        handleBr(document, parent, br, context, null!);

        expect(parent.innerHTML).toBe('<span style="color: red;"><br></span>');
    });

    it('With newNodes', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: { textColor: 'red' },
        };
        const newNodes: Node[] = [];

        handleBr(document, parent, br, context, null!, newNodes);

        expect(parent.innerHTML).toBe('<span style="color: red;"><br></span>');
        expect(newNodes.length).toBe(1);
        expect(newNodes[0]).toBe(parent.querySelector('br')!);
    });
});
