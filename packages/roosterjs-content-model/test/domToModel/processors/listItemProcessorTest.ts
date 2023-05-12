import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
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

    it('LI without valid context', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        listItemProcessor(group, li, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    element: li,
                    blocks: [],
                    format: {},
                },
            ],
        });
    });

    it('LI with display:block', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.style.display = 'block';

        context.listFormat.levels = [{ listType: 'UL' }];
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
                    levels: [{ listType: 'UL', displayForDummyItem: 'block' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
        });
    });

    it('LI with valid condition', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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
                listItemMetadata: null,
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
                    blockGroupType: 'General',
                    element: li,
                    blocks: [],
                    format: {},
                },
            ],
        });
    });

    it('LI with display:block', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        li.style.display = 'block';

        context.listFormat.levels = [{ listType: 'UL' }];
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
                    levels: [{ listType: 'UL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    format: {},
                },
            ],
        });
    });

    it('LI with valid condition', () => {
        const group = createContentModelDocument();
        const li = document.createElement('li');

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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

        context.listFormat.levels = [{ listType: 'UL' }];
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
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });
});
