import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
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
            format: {},
            link: { format: { href: '/test', underline: true }, dataset: {} },
        };

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span><a href="/test">test</a></span>');
    });

    it('call stackFormat', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
            link: { format: { href: '/test', underline: true }, dataset: {} },
        };

        spyOn(stackFormat, 'stackFormat').and.callThrough();

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span><a href="/test">test</a></span>');
        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('a');
    });
});
