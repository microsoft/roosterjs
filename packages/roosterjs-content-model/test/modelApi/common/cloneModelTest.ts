import { cloneModel } from '../../../lib/modelApi/common/cloneModel';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';

describe('cloneModel', () => {
    function compareObjects(o1: any, o2: any) {
        expect(typeof o2).toBe(typeof o1);

        if (typeof o1 == 'boolean' || typeof o1 == 'number' || typeof o1 == 'string') {
            expect(o2).toBe(o1);
        } else if (typeof o1 == 'undefined') {
            expect(o2).toBeUndefined();
        } else if (typeof o1 == 'object') {
            if (Array.isArray(o1)) {
                expect(Array.isArray(o2)).toBeTrue();
                expect(o2).not.toBe(o1);
                expect(o2.length).toBe(o1.length);

                for (let i = 0; i < o1.length; i++) {
                    compareObjects(o1[i], o2[i]);
                }
            } else if (o1 instanceof Node) {
                expect(o2).toBe(o1);
            } else if (o1 === null) {
                expect(o2).toBeNull();
            } else {
                expect(o2).not.toBe(o1);

                const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

                keys.forEach(key => {
                    compareObjects(o1[key], o2[key]);
                });
            }
        } else {
            throw new Error('Unexpected type of object: ' + typeof o2);
        }
    }

    function runTest(model: ContentModelDocument) {
        const clone = cloneModel(model);

        compareObjects(model, clone);
    }

    it('Empty model', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Model with paragraph', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        lineHeight: '10',
                    },
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            link: {
                                dataset: { a: 'b' },
                                format: { href: 'cc' },
                            },
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '20' },
                            text: 'test',
                            code: {
                                format: {
                                    fontFamily: 'a',
                                },
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Entity',
                            blockType: 'Entity',
                            format: {},
                            id: 'e1',
                            wrapper: document.createElement('span'),
                            isReadonly: true,
                        },
                        {
                            segmentType: 'General',
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            format: {},
                            element: document.createElement('div'),
                            blocks: [],
                        },
                    ],
                },
            ],
        });
    });

    it('Model with simple block', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    format: {},
                    isSelected: true,
                    cachedElement: document.createElement('div'),
                    tagName: 'hr',
                },
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: { underline: true },
                    id: 'e2',
                    wrapper: document.createElement('span'),
                    isReadonly: true,
                },
            ],
        });
    });

    it('Model with table', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    cachedElement: document.createElement('table'),
                    dataset: { a: 'b' },
                    format: { backgroundColor: 'red' },
                    widths: [],
                    rows: [
                        {
                            format: {},
                            height: 10,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    cachedElement: document.createElement('td'),
                                    dataset: { c: 'd', e: 'f' },
                                    format: { direction: 'ltr' },
                                    isHeader: false,
                                    isSelected: false,
                                    spanAbove: true,
                                    spanLeft: false,
                                    blocks: [
                                        {
                                            blockType: 'Divider',
                                            tagName: 'div',
                                            format: {},
                                        },
                                    ],
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    cachedElement: document.createElement('th'),
                                    dataset: { g: 'h', i: 'j' },
                                    format: { direction: 'rtl' },
                                    isHeader: true,
                                    isSelected: true,
                                    spanAbove: false,
                                    spanLeft: true,
                                    blocks: [
                                        {
                                            blockType: 'Divider',
                                            tagName: 'hr',
                                            format: {},
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('Model with list item', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: { direction: 'ltr' },
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: { fontSize: '20' },
                        isSelected: true,
                    },
                    levels: [
                        {
                            listType: 'OL',
                            textAlign: 'center',
                        },
                        {
                            listType: 'UL',
                            direction: 'rtl',
                        },
                    ],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [],
                        },
                    ],
                },
            ],
        });
    });

    it('Model with other block groups', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    cachedElement: document.createElement('div'),
                    format: { underline: false },
                    tagName: 'blockquote',
                    blocks: [],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    format: { backgroundColor: 'red' },
                    element: document.createElement('button'),
                    blocks: [],
                },
            ],
        });
    });

    it('Model with segment format on block', () => {
        runTest({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segmentFormat: { fontSize: '20px' },
                    segments: [],
                },
            ],
        });
    });
});
