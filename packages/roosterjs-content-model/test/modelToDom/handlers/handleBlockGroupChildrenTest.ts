import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { handleBlockGroupChildren } from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleBlockGroupChildren', () => {
    let context: ModelToDomContext;
    let handleBlock: jasmine.Spy<ContentModelHandler<ContentModelBlock>>;
    let parent: HTMLDivElement;

    beforeEach(() => {
        handleBlock = jasmine.createSpy('handleBlock');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                block: handleBlock,
            },
        });
        parent = document.createElement('div');
    });

    it('Empty block group', () => {
        const group = createContentModelDocument();

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlock).not.toHaveBeenCalled();
    });

    it('Single child block group', () => {
        const group = createContentModelDocument();
        const paragraph = createParagraph();

        group.blocks.push(paragraph);

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlock).toHaveBeenCalledTimes(1);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph, context);
    });

    it('Multiple child block group', () => {
        const group = createContentModelDocument();
        const paragraph1 = createParagraph();
        const paragraph2 = createParagraph(true /*isImplicit*/);

        group.blocks.push(paragraph1);
        group.blocks.push(paragraph2);

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlock).toHaveBeenCalledTimes(2);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph1, context);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph2, context);
    });

    it('Multiple child block group with nodeStack and no list', () => {
        const group = createContentModelDocument();
        const paragraph = createParagraph();
        const nodeStack = [{ a: 'b' } as any];

        group.blocks.push(paragraph);
        context.listFormat.nodeStack = nodeStack;

        handleBlock.and.callFake((doc, parent, child, context) => {
            expect(context.listFormat.nodeStack).toEqual([]);
        });

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(nodeStack).toEqual([{ a: 'b' } as any]);
        expect(context.listFormat.nodeStack).toBe(nodeStack);
        expect(handleBlock).toHaveBeenCalledTimes(1);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph, context);
    });

    it('Multiple child block group with nodeStack and no list', () => {
        const group = createContentModelDocument();
        const paragraph1 = createParagraph();
        const paragraph2 = createParagraph();
        const list = createListItem([]);
        const nodeStack = [{ a: 'b' } as any];

        group.blocks.push(paragraph1);
        group.blocks.push(list);
        group.blocks.push(paragraph2);
        context.listFormat.nodeStack = nodeStack;

        handleBlock.and.callFake((doc, parent, child, context) => {
            if (child == paragraph1) {
                expect(context.listFormat.nodeStack).toEqual([]);
                context.listFormat.nodeStack.push({ c: 'd' } as any);
            } else if (child == list) {
                expect(context.listFormat.nodeStack).toEqual([{ c: 'd' } as any]);
            } else if (child == paragraph2) {
                expect(context.listFormat.nodeStack).toEqual([]);
            } else {
                throw new Error('Should never run to here: ' + JSON.stringify(child));
            }
        });

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(nodeStack).toEqual([{ a: 'b' } as any]);
        expect(context.listFormat.nodeStack).toBe(nodeStack);
        expect(handleBlock).toHaveBeenCalledTimes(3);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph1, context);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph2, context);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, list, context);
    });
});
