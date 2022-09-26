import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as handleBlockGroupChildren from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import * as handleListItem from '../../../lib/modelToDom/handlers/handleListItem';
import * as handleQuote from '../../../lib/modelToDom/handlers/handleQuote';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { handleBlockGroup } from '../../../lib/modelToDom/handlers/handleBlockGroup';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { SegmentFormatHandlers } from '../../../lib/formatHandlers/SegmentFormatHandlers';

describe('handleBlockGroup', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;

    beforeEach(() => {
        context = createModelToDomContext();
        parent = document.createElement('div');
    });

    it('Document', () => {
        const group = createContentModelDocument(document);
        spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent,
            group,
            context
        );
    });

    it('General block', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralBlock(childMock);

        spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');
        spyOn(applyFormat, 'applyFormat');

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
    });

    it('General segment: empty element', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralSegment(childMock);

        spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');
        spyOn(applyFormat, 'applyFormat');

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(context.regularSelection.current.segment).toBe(clonedChild);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(1);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            clonedChild,
            SegmentFormatHandlers,
            group.format,
            context
        );
    });

    it('General segment: element with child', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
            firstChild: true,
        } as any) as HTMLElement;
        const group = createGeneralSegment(childMock);

        spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');
        spyOn(applyFormat, 'applyFormat');

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(context.regularSelection.current.segment).toBeNull();
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(1);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            clonedChild,
            SegmentFormatHandlers,
            group.format,
            context
        );
    });

    it('Quote', () => {
        const group = createQuote();
        spyOn(handleQuote, 'handleQuote');

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleQuote.handleQuote).toHaveBeenCalledTimes(1);
        expect(handleQuote.handleQuote).toHaveBeenCalledWith(document, parent, group, context);
    });

    it('ListItem', () => {
        const group = createListItem();
        spyOn(handleListItem, 'handleListItem');

        handleBlockGroup(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleListItem.handleListItem).toHaveBeenCalledTimes(1);
        expect(handleListItem.handleListItem).toHaveBeenCalledWith(
            document,
            parent,
            group,
            context
        );
    });
});
