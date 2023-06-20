import { commitEntity } from 'roosterjs-editor-dom';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
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
        handleBlock = jasmine.createSpy('handleBlock').and.callFake(originalHandleBlock);
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

        expect(parent.outerHTML).toBe('<div><div></div></div>');
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

        expect(parent.outerHTML).toBe('<div><div></div></div>');
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

        handleBlock.and.callFake((doc, parent, child, context, refNode) => {
            expect(context.listFormat.nodeStack).toEqual([]);
            return refNode;
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

        handleBlock.and.callFake((doc, parent, child, context, refNode) => {
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

            return refNode;
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
        const quote = document.createElement('blockquote');
        const div2 = document.createElement('div');

        quote.id = 'div1';
        div2.id = 'div2';
        quote.textContent = 'test1';
        div2.textContent = 'test2';

        parent.appendChild(quote);
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
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [],
                    cachedElement: quote,
                },
            ],
        };

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe(
            '<div><div id="div2">test2</div><blockquote id="div1"></blockquote></div>'
        );
        expect(parent.firstChild).toBe(div2);
        expect(parent.firstChild?.nextSibling).toBe(quote);
    });

    it('handle document with cache 5', () => {
        const quote = document.createElement('blockquote');

        quote.id = 'div1';
        quote.textContent = 'test1';

        parent.appendChild(quote);

        const group: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
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
                    cachedElement: quote,
                },
            ],
        };

        handleBlock.and.callFake(originalHandleBlock);

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.outerHTML).toBe(
            '<div><blockquote id="div1"><div><br></div></blockquote></div>'
        );
        expect(parent.firstChild).toBe(quote);
    });

    it('Inline entity is next to a cached paragraph', () => {
        // It is possible the refNode is changed during processing child segments
        // e.g. When this paragraph is an implicit paragraph and it contains an inline entity segment
        // The segment will be appended to container as child then the container will be removed
        // since this paragraph it is implicit.
        // This test case will verify the entity can still be correctly written back after handling the
        // implicit paragraph (https://github.com/microsoft/roosterjs/issues/1847)
        const div = document.createElement('div');
        div.innerHTML = '<br>';

        const span = document.createElement('span');
        commitEntity(span, 'MyEntity', false);

        parent.appendChild(div);
        parent.appendChild(span);

        const group: ContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    cachedElement: div,
                },
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: {},
                    segments: [
                        {
                            segmentType: 'Entity',
                            blockType: 'Entity',
                            wrapper: span,
                            isReadonly: false,
                            type: 'MyEntity',
                            format: {},
                        },
                    ],
                },
            ],
        };

        handleBlockGroupChildren(document, parent, group, context);

        expect(parent.innerHTML).toBe(
            '<div><br></div><span class="_Entity _EType_MyEntity _EReadonly_0"></span>'
        );
    });
});
