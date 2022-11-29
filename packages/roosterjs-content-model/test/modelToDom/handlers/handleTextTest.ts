import { ContentModelText } from '../../../lib/publicTypes/segment/ContentModelText';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleText } from '../../../lib/modelToDom/handlers/handleText';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        parent = document.createElement('div');
        context = createModelToDomContext();
    });

    it('Text segment', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span>test</span>');
    });

    it('Text segment with format', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: { textColor: 'red' },
        };

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span style="color: red;">test</span>');
    });

    it('Text segment with link', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: { underline: true },
            link: { format: { href: '/test' }, dataset: {} },
        };

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<a href="/test">test</a>');
    });
});
