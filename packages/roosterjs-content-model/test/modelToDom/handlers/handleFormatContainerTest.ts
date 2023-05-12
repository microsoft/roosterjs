import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createText } from '../../../lib/modelApi/creators/createText';
import { handleBlockGroupChildren as originalHandleBlockGroupChildren } from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import { handleFormatContainer } from '../../../lib/modelToDom/handlers/handleFormatContainer';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleFormatContainer', () => {
    let context: ModelToDomContext;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
            },
        });
    });

    it('Empty quote', () => {
        const parent = document.createElement('div');
        const quote = createQuote();

        handleFormatContainer(document, parent, quote, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(quote.cachedElement).toBeUndefined();
    });

    it('Quote with child', () => {
        const parent = document.createElement('div');
        const quote = createQuote();
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
    });

    it('Quote with child and refNode', () => {
        const parent = document.createElement('div');
        const br = document.createElement('br');
        const quote = createQuote();
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
    });

    it('With onNodeCreated', () => {
        const parent = document.createElement('div');
        const quote = createQuote();
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
    });
});
