import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createText } from '../../../lib/modelApi/creators/createText';
import { handleBlockGroupChildren as originalHandleBlockGroupChildren } from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import { handleQuote } from '../../../lib/modelToDom/handlers/handleQuote';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleQuote', () => {
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

        handleQuote(document, parent, quote, context);

        expect(parent.outerHTML).toBe('<div></div>');
    });

    it('Quote with child', () => {
        const parent = document.createElement('div');
        const quote = createQuote();
        const paragraph = createParagraph();
        const text = createText('test');
        quote.blocks.push(paragraph);
        paragraph.segments.push(text);

        handleBlockGroupChildren.and.callFake(originalHandleBlockGroupChildren);

        handleQuote(document, parent, quote, context);

        expect(parent.outerHTML).toBe(
            '<div><blockquote style="margin-top: 0px; margin-bottom: 0px;"><div><span>test</span></div></blockquote></div>'
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            quote,
            context
        );
    });
});
