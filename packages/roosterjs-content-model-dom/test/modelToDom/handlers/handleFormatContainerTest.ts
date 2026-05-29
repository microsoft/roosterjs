import { createFormatContainer } from '../../../lib/modelApi/creators/createFormatContainer';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { handleBlockGroupChildren as originalHandleBlockGroupChildren } from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import { handleFormatContainer } from '../../../lib/modelToDom/handlers/handleFormatContainer';
import {
    ContentModelBlockGroup,
    ContentModelHandler,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('handleFormatContainer', () => {
    let context: ModelToDomContext;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        context = createModelToDomContext(
            {
                allowCacheElement: true,
            },
            {
                modelHandlerOverride: {
                    blockGroupChildren: handleBlockGroupChildren,
                },
            }
        );
    });

    it('Empty quote', () => {
        const parent = document.createElement('div');
        const quote = createFormatContainer('blockquote');

        handleFormatContainer(document, parent, quote, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(quote.cachedElement).toBeUndefined();
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('Quote with child', () => {
        const parent = document.createElement('div');
        const quote = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('test');
        quote.blocks.push(paragraph);
        paragraph.segments.push(text);

        handleBlockGroupChildren.and.callFake(originalHandleBlockGroupChildren);

        handleFormatContainer(document, parent, quote, context, null);

        expect(parent.outerHTML).toBe(
            '<div><blockquote style="margin: 0px;"><div>test</div></blockquote></div>'
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            quote,
            context
        );
        expect(quote.cachedElement).toBe(parent.firstChild as HTMLQuoteElement);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [
                parent.firstChild as HTMLElement,
                parent.firstChild!.firstChild as HTMLElement,
            ],
            removedBlockElements: [],
        });
    });

    it('Quote with child and refNode', () => {
        const parent = document.createElement('div');
        const br = document.createElement('br');
        const quote = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('test');
        quote.blocks.push(paragraph);
        paragraph.segments.push(text);

        parent.appendChild(br);

        handleBlockGroupChildren.and.callFake(originalHandleBlockGroupChildren);

        const result = handleFormatContainer(document, parent, quote, context, br);

        expect(parent.outerHTML).toBe(
            '<div><blockquote style="margin: 0px;"><div>test</div></blockquote><br></div>'
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            quote,
            context
        );
        expect(quote.cachedElement).toBe(parent.firstChild as HTMLQuoteElement);
        expect(result).toBe(br);
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [
                parent.firstChild as HTMLElement,
                parent.firstChild!.firstChild as HTMLElement,
            ],
            removedBlockElements: [],
        });
    });

    it('RTL container propagates direction into implicitFormat for children', () => {
        const parent = document.createElement('div');
        const container = createFormatContainer('div', { direction: 'rtl' });
        const paragraph = createParagraph();
        container.blocks.push(paragraph);

        let capturedDirection: string | undefined;
        handleBlockGroupChildren.and.callFake((_doc, _node, _group, ctx) => {
            capturedDirection = ctx.implicitFormat.direction;
        });

        handleFormatContainer(document, parent, container, context, null);

        expect(capturedDirection).toBe('rtl');
        // implicitFormat must be restored after stackFormat
        expect(context.implicitFormat.direction).toBeUndefined();
    });

    it('Container without direction does not change implicitFormat for children', () => {
        const parent = document.createElement('div');
        const container = createFormatContainer('div');
        const paragraph = createParagraph();
        container.blocks.push(paragraph);

        let capturedDirection: string | undefined;
        context.implicitFormat.direction = 'rtl';
        handleBlockGroupChildren.and.callFake((_doc, _node, _group, ctx) => {
            capturedDirection = ctx.implicitFormat.direction;
        });

        handleFormatContainer(document, parent, container, context, null);

        expect(capturedDirection).toBe('rtl');
    });

    it('Pre container with RTL direction propagates both pre format and direction', () => {
        const parent = document.createElement('div');
        const container = createFormatContainer('pre', { direction: 'rtl' });
        const paragraph = createParagraph();
        paragraph.segments.push(createText('test'));
        container.blocks.push(paragraph);

        let capturedDirection: string | undefined;
        let capturedWhiteSpace: string | undefined;
        handleBlockGroupChildren.and.callFake((_doc, _node, _group, ctx) => {
            capturedDirection = ctx.implicitFormat.direction;
            capturedWhiteSpace = ctx.implicitFormat.whiteSpace;
        });

        handleFormatContainer(document, parent, container, context, null);

        expect(capturedDirection).toBe('rtl');
        expect(capturedWhiteSpace).toBe('pre');
        expect(context.implicitFormat.direction).toBeUndefined();
        expect(context.implicitFormat.whiteSpace).toBeUndefined();
    });

    it('With onNodeCreated', () => {
        const parent = document.createElement('div');
        const quote = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('test');
        quote.blocks.push(paragraph);
        paragraph.segments.push(text);

        handleBlockGroupChildren.and.callFake(originalHandleBlockGroupChildren);

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleFormatContainer(document, parent, quote, context, null);

        expect(parent.innerHTML).toBe(
            '<blockquote style="margin: 0px;"><div>test</div></blockquote>'
        );
        expect(onNodeCreated).toHaveBeenCalledTimes(3);
        expect(onNodeCreated.calls.argsFor(2)[0]).toBe(quote);
        expect(onNodeCreated.calls.argsFor(2)[1]).toBe(parent.querySelector('blockquote'));
        expect(context.rewriteFromModel).toEqual({
            addedBlockElements: [
                parent.firstChild as HTMLElement,
                parent.firstChild!.firstChild as HTMLElement,
            ],
            removedBlockElements: [],
        });
    });
});
