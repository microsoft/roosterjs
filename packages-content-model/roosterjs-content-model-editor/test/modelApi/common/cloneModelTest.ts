import { cloneModel } from '../../../lib/modelApi/common/cloneModel';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { createEntity } from 'roosterjs-content-model-dom';

describe('cloneModel', () => {
    function compareObjects(o1: any, o2: any, allowCache: boolean, path: string = '/') {
        expect(typeof o2).toBe(typeof o1);

        if (typeof o1 == 'boolean' || typeof o1 == 'number' || typeof o1 == 'string') {
            expect(o2).toBe(o1);
        } else if (typeof o1 == 'undefined') {
            expect(o2).toBeUndefined();
        } else if (typeof o1 == 'object') {
            if (Array.isArray(o1)) {
                expect(Array.isArray(o2)).toBeTrue();
                expect(o2).not.toBe(o1, path);
                expect(o2.length).toBe(o1.length, path);

                for (let i = 0; i < o1.length; i++) {
                    compareObjects(o1[i], o2[i], allowCache, path + `[${i}]/`);
                }
            } else if (o1 instanceof Node) {
                expect(o2).toBe(o1, path);
            } else if (o1 === null) {
                expect(o2).toBeNull(path);
            } else {
                expect(o2).not.toBe(o1, path);

                const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

                keys.forEach(key => {
                    if (allowCache) {
                        compareObjects(o1[key], o2[key], allowCache, path + key + '/');
                    } else {
                        switch (key) {
                            case 'cachedElement':
                                expect(o2[key]).toBeUndefined(path);
                                break;

                            case 'wrapper':
                            case 'element':
                                expect(o2[key]).not.toBe(o1[key], path);
                                expect(o2[key]).toEqual(o1[key], path);
                                break;

                            default:
                                compareObjects(o1[key], o2[key], allowCache, path + key + '/');
                                break;
                        }
                    }
                });
            }
        } else {
            throw new Error('Unexpected type of object: ' + typeof o2);
        }
    }

    function runTest(model: ContentModelDocument) {
        const cloneWithCache = cloneModel(model, { includeCachedElement: true });
        const cloneWithoutCache = cloneModel(model);

        compareObjects(model, cloneWithCache, true);
        compareObjects(model, cloneWithoutCache, false);
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
                            dataset: {},
                            format: {
                                textAlign: 'center',
                            },
                        },
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {
                                direction: 'rtl',
                            },
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

    describe('Clone with callback', () => {
        it('Paragraph without cache', () => {
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((node: Node, type: string) => {
                    return undefined;
                });
            const cloneWithCallback = cloneModel(
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segmentFormat: { fontSize: '20px' },
                            segments: [],
                        },
                    ],
                },
                { includeCachedElement: callback }
            );

            expect(cloneWithCallback).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segmentFormat: { fontSize: '20px' },
                        segments: [],
                        cachedElement: undefined,
                        isImplicit: undefined,
                    },
                ],
            });
            expect(callback).not.toHaveBeenCalled();
        });

        it('Paragraph with cache, return undefined', () => {
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((node: Node, type: string) => {
                    return undefined;
                });
            const div = document.createElement('div');
            const cloneWithCallback = cloneModel(
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segmentFormat: { fontSize: '20px' },
                            segments: [],
                            cachedElement: div,
                        },
                    ],
                },
                { includeCachedElement: callback }
            );

            expect(cloneWithCallback).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segmentFormat: { fontSize: '20px' },
                        segments: [],
                        cachedElement: undefined,
                        isImplicit: undefined,
                    },
                ],
            });
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(div, 'cache');
        });

        it('Paragraph with cache, return span', () => {
            const div = document.createElement('div');
            const span = document.createElement('span');
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((node: Node, type: string) => {
                    return span;
                });
            const cloneWithCallback = cloneModel(
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segmentFormat: { fontSize: '20px' },
                            segments: [],
                            cachedElement: div,
                        },
                    ],
                },
                { includeCachedElement: callback }
            );

            expect(cloneWithCallback).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segmentFormat: { fontSize: '20px' },
                        segments: [],
                        cachedElement: span,
                        isImplicit: undefined,
                    },
                ],
            });
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(div, 'cache');
        });

        it('Entity, return undefined', () => {
            const div = document.createElement('div');
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((node: Node, type: string) => {
                    return undefined;
                });
            expect(() =>
                cloneModel(
                    {
                        blockGroupType: 'Document',
                        blocks: [createEntity(div, true)],
                    },
                    { includeCachedElement: callback }
                )
            ).toThrow();

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(div, 'entity');
        });
    });

    it('Entity, return span', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const callback = jasmine.createSpy('callback').and.callFake((node: Node, type: string) => {
            return span;
        });
        const cloneWithCallback = cloneModel(
            {
                blockGroupType: 'Document',
                blocks: [createEntity(div, true)],
            },
            { includeCachedElement: callback }
        );

        expect(cloneWithCallback).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Entity',
                    format: {},
                    wrapper: span,
                    isReadonly: true,
                    type: undefined,
                    id: undefined,
                    segmentType: 'Entity',
                    isSelected: undefined,
                },
            ],
        });
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(div, 'entity');
    });

    it('Inline entity, return span', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.id = 'div1';
        div2.id = 'div2';

        const span = document.createElement('span');
        const callback = jasmine.createSpy('callback').and.callFake((node: Node, type: string) => {
            return node == div1 ? span : node;
        });
        const cloneWithCallback = cloneModel(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [createEntity(div1, true)],
                        cachedElement: div2,
                    },
                ],
            },
            { includeCachedElement: callback }
        );

        expect(cloneWithCallback).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            blockType: 'Entity',
                            format: {},
                            wrapper: span,
                            isReadonly: true,
                            type: undefined,
                            id: undefined,
                            segmentType: 'Entity',
                            isSelected: undefined,
                        },
                    ],
                    cachedElement: div2,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
            ],
        });
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith(div1, 'entity');
        expect(callback).toHaveBeenCalledWith(div2, 'cache');
    });
});
