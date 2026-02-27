import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import { ContentModelText, ModelToDomSegmentContext } from 'roosterjs-content-model-types';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleText } from '../../../lib/modelToDom/handlers/handleText';

describe('handleText', () => {
    let parent: HTMLElement;
    let context: ModelToDomSegmentContext;

    beforeEach(() => {
        parent = document.createElement('div');
        context = { ...createModelToDomContext() };
    });

    it('Text segment', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span>test</span>');
    });

    it('Text segment with format', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: { textColor: 'red' },
        };

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span style="color: red;">test</span>');
    });

    it('Text segment with link', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
            link: { format: { href: '/test', underline: true }, dataset: {} },
        };

        handleText(document, parent, text, context, []);

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

        handleText(document, parent, text, context, []);

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

        handleText(document, parent, text, context, []);

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

        handleText(document, parent, text, context, []);

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

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span style="font-size: 12px;"><a href="#">test</a></span>');
    });

    it('Text segment with segmentNodes', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const segmentNodes: Node[] = [];

        handleText(document, parent, text, context, segmentNodes);

        expect(parent.innerHTML).toBe('<span>test</span>');
        expect(segmentNodes.length).toBe(1);
        expect(segmentNodes[0]).toBe(parent.firstChild!.firstChild!);
    });

    it('Handle text with format applier', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const segmentNodes: Node[] = [];
        const applierSpy = jasmine.createSpy('applier');

        context.formatAppliers.text = [applierSpy];

        handleText(document, parent, text, context, segmentNodes);

        expect(parent.innerHTML).toBe('<span>test</span>');
        expect(segmentNodes.length).toBe(1);
        expect(segmentNodes[0]).toBe(parent.firstChild!.firstChild!);
        expect(applierSpy).toHaveBeenCalledTimes(1);
        expect(applierSpy).toHaveBeenCalledWith(text.format, segmentNodes[0], context);
    });

    it('Last segment ending with space is converted to nbsp', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'hello ',
            format: {},
        };

        context.noFollowingTextSegmentOrLast = true;

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span>hello&nbsp;</span>');
    });

    it('Last segment not ending with space is unchanged', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'hello',
            format: {},
        };

        context.noFollowingTextSegmentOrLast = true;

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span>hello</span>');
    });

    it('Non-last segment ending with space is unchanged', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'hello ',
            format: {},
        };

        context.noFollowingTextSegmentOrLast = false;

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span>hello </span>');
    });

    it('Text ending with space without noFollowingTextSegmentOrLast set keeps space', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'hello ',
            format: {},
        };

        handleText(document, parent, text, context, []);

        expect(parent.innerHTML).toBe('<span>hello </span>');
    });
});
