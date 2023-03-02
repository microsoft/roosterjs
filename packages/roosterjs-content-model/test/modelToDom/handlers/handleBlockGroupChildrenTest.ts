import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { handleBlock as originalHandleBlock } from '../../../lib/modelToDom/handlers/handleBlock';
import { handleBlockGroupChildren } from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleBlockGroupChildren', () => {
    let context: ModelToDomContext;
    let handleBlock: jasmine.Spy<ContentModelBlockHandler<ContentModelBlock>>;
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
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph, context, null);
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
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph1, context, null);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph2, context, null);
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
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph, context, null);
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
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph1, context, null);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, paragraph2, context, null);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, list, context, null);
    });

    it('handle document with cache 1', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.textContent = 'test1';
        div2.textContent = 'test2';

        parent.appendChild(div1);
        parent.appendChild(div2);

        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div1,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div2,
                },
            ],
        };

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><div>test1</div><div>test2</div></div>');
        expect(parent.firstChild).toBe(div1);
        expect(parent.lastChild).toBe(div2);
    });

    it('handle document with cache 2', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.textContent = 'test1';
        div2.textContent = 'test2';

        parent.appendChild(div1);
        parent.appendChild(div2);

        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div2,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div1,
                },
            ],
        };

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><div>test2</div><div>test1</div></div>');
        expect(parent.firstChild).toBe(div2);
        expect(parent.firstChild?.nextSibling).toBe(div1);
    });

    it('handle document with cache 3', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.textContent = 'test1';
        div2.textContent = 'test2';

        parent.appendChild(div1);
        parent.appendChild(document.createTextNode('test0'));
        parent.appendChild(div2);

        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div2,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div1,
                },
            ],
        };

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><div>test2</div><div>test1</div></div>');
        expect(parent.firstChild).toBe(div2);
        expect(parent.firstChild?.nextSibling).toBe(div1);
    });

    it('handle document with cache 4', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.textContent = 'test1';
        div2.textContent = 'test2';

        parent.appendChild(div1);
        parent.appendChild(div2);

        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Entity',
                    format: {},
                    wrapper: div2,
                    isReadonly: false,
                    segmentType: 'Entity',
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    format: {},
                    quoteSegmentFormat: {},
                    blocks: [],
                    cachedElement: div1,
                },
            ],
        };

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><div>test2</div><div>test1</div></div>');
        expect(parent.firstChild).toBe(div2);
        expect(parent.firstChild?.nextSibling).toBe(div1);
    });

    it('handle document with cache 5', () => {
        const div1 = document.createElement('div');

        div1.id = 'div1';
        div1.textContent = 'test1';

        parent.appendChild(div1);

        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    format: {},
                    quoteSegmentFormat: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                        },
                    ],
                    cachedElement: div1,
                },
            ],
        };

        handleBlock.and.callFake(originalHandleBlock);

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe(
            '<div><div id="div1"><div><span><br></span></div></div></div>'
        );
        expect(parent.firstChild).toBe(div1);
    });
});
