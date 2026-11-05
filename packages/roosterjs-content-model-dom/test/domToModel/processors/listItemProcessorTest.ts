import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { ContentModelListItem, DomToModelContext } from 'roosterjs-content-model-types';
import { listItemProcessor } from '../../../lib/domToModel/processors/listItemProcessor';

describe('listItemProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext(undefined, {
            processorOverride: {
                li: listItemProcessor,
            },
        });
    });

    [undefined, '12px', '0px'].forEach(marginBottom => {
        it(`Stores WordLikeStyles defaults in the model while preserving marginBottom ${marginBottom}`, () => {
            const group = createContentModelDocument();
            const li = document.createElement('li');

            context.experimentalFeatures = ['WordLikeStyles'];
            li.innerHTML = 'foo<b>bar</b>baz';

            if (marginBottom) {
                li.style.marginBottom = marginBottom;
            }

            listItemProcessor(group, li, context);

            const listItem = group.blocks[0] as ContentModelListItem;

            expect(listItem.format.marginBottom).toBe(marginBottom ?? '2px');
            expect(listItem.blocks[0]).toEqual(
                jasmine.objectContaining({
                    blockType: 'Paragraph',
                    isImplicit: false,
                    format: { marginLeft: '8px' },
                })
            );
            expect(li.style.marginBottom).toBe(marginBottom ?? '');
            expect(li.querySelector('b')!.style.marginInlineStart).toBe('');
        });
    });

    (['ltr', 'rtl'] as const).forEach(direction => {
        it(`Preserves an authored inline start margin with WordLikeStyles in ${direction}`, () => {
            const group = createContentModelDocument();
            const li = document.createElement('li');

            context.experimentalFeatures = ['WordLikeStyles'];
            li.style.direction = direction;
            li.innerHTML = '<div style="margin-inline-start: 16px;">test</div>';

            listItemProcessor(group, li, context);

            const listItem = group.blocks[0] as ContentModelListItem;
            const marginKey = direction == 'rtl' ? 'marginRight' : 'marginLeft';

            expect(listItem.blocks[0].format[marginKey]).toBe('16px');
            expect(context.blockFormat.direction).toBeUndefined();
        });
    });

    it('LI without valid context', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    format: {},
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                },
            ],
        });
    });

    it('LI with display:block', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.style.display = 'block';

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        { listType: 'UL', format: { displayForDummyItem: 'block' }, dataset: {} },
                    ],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: false, format: {} },
                    format: {},
                },
            ],
        });
    });

    it('LI with valid condition', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('LI with segment format', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.style.fontSize = '10px';

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            fontSize: '10px',
                        },
                    },
                    format: {},
                },
            ],
        });
    });

    it('LI with child elements', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');
        li.appendChild(document.createTextNode('test'));

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            isImplicit: true,
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('Move up format from only implicit paragraph to list item', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');
        li.appendChild(document.createTextNode('test'));

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];
        context.blockFormat.lineHeight = '2';

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            isImplicit: true,
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        lineHeight: '2',
                    },
                },
            ],
        });
    });

    it('Do not move up format from non-implicit paragraph to list item', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');
        const div = document.createElement('div');

        div.appendChild(document.createTextNode('test'));
        li.appendChild(div);

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];
        context.blockFormat.lineHeight = '2';

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: { lineHeight: '2' },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: { lineHeight: '2' },
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('Parse format on LI element', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.appendChild(document.createTextNode('test'));
        li.style.lineHeight = '2';

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            isImplicit: true,
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: { lineHeight: '2' },
                },
            ],
        });
    });
});

describe('listItemProcessor without format handlers', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext(undefined, {
            processorOverride: {
                li: listItemProcessor,
            },
            formatParserOverride: {
                listItemThread: null,
            },
        });
    });

    it('LI without valid context', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    format: {},
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                },
            ],
        });
    });

    it('LI with display:block', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.style.display = 'block';

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [{ listType: 'UL', format: {}, dataset: {} }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: false, format: {} },
                    format: {},
                },
            ],
        });
    });

    it('LI with valid condition', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('LI with segment format', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.style.fontSize = '10px';

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            fontSize: '10px',
                        },
                    },
                    format: {},
                },
            ],
        });
    });

    it('LI with child elements', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');
        li.appendChild(document.createTextNode('test'));

        context.listFormat.levels = [{ listType: 'UL', format: {}, dataset: {} }];
        context.listFormat.listParent = group;
        context.listFormat.threadItemCounts = [0];

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            isImplicit: true,
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });
});
