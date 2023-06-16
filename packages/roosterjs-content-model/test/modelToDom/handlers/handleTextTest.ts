import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import DarkColorHandlerImpl from '../../../../roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
import { ContentModelText } from '../../../lib/publicTypes/segment/ContentModelText';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleText } from '../../../lib/modelToDom/handlers/handleText';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleText', () => {
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
        context.darkColorHandler = new DarkColorHandlerImpl({} as any, s => 'darkMock: ' + s);

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

    it('Text segment with code', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
            code: {
                format: {
                    fontFamily: 'monospace',
                },
            },
        };

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span><code>test</code></span>');
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

    it('With onNodeCreated', () => {
        const parent = document.createElement('div');
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span>test</span>');
        expect(onNodeCreated).toHaveBeenCalledTimes(1);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(text);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('span')!.firstChild);
    });

    it('Link is outside of SPAN', () => {
        const parent = document.createElement('div');
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: { fontSize: '12px' },
            link: {
                format: {
                    href: '#',
                    underline: true,
                },
                dataset: {},
            },
        };

        handleText(document, parent, text, context);

        expect(parent.innerHTML).toBe('<span style="font-size: 12px;"><a href="#">test</a></span>');
    });
});
