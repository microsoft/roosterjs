import * as stackFormat from '../../../lib/domToModel/utils/stackFormat';
import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { childProcessor as originalChildProcessor } from '../../../lib/domToModel/processors/childProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../../lib/publicTypes/context/ElementProcessor';
import { listProcessor } from '../../../lib/domToModel/processors/listProcessor';

describe('listProcessor', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                ul: listProcessor,
                ol: listProcessor,
                child: childProcessor,
            },
        });
    });

    it('Single UL element', () => {
        const group = createContentModelDocument();
        const ul = document.createElement('ul');

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{ listType: 'UL' }]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Single OL element', () => {
        const group = createContentModelDocument();
        const ol = document.createElement('ol');

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{ listType: 'OL' }]);
            expect(context.listFormat.threadItemCounts).toEqual([0]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([0]);
        expect(context.segmentFormat).toEqual({});
    });

    it('OL element with segment format', () => {
        const group = createContentModelDocument();
        const ol = document.createElement('ol');

        ol.style.color = 'red';
        ol.style.fontFamily = 'a';
        ol.style.fontSize = '10px';

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{ listType: 'OL' }]);
            expect(context.listFormat.threadItemCounts).toEqual([0]);
            expect(context.segmentFormat).toEqual({
                textColor: 'red',
                fontFamily: 'a',
                fontSize: '10px',
            });
        });

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([0]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Nested UL elements', () => {
        const group = createContentModelDocument();
        const ul = document.createElement('ul');
        const innerUl = document.createElement('ul');

        ul.appendChild(innerUl);

        childProcessor.and.callFake(originalChildProcessor);
        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(childProcessor).toHaveBeenCalledTimes(2);
        expect(childProcessor).toHaveBeenCalledWith(group, ul, context);
        expect(childProcessor).toHaveBeenCalledWith(group, innerUl, context);
    });

    it('Nested UL elements, check context', () => {
        const group = createContentModelDocument();
        const ul = document.createElement('ul');
        const innerUl = document.createElement('ul');

        const pushSpy = jasmine.createSpy('push');
        const popSpy = jasmine.createSpy('pop');

        context.listFormat.levels = {
            push: pushSpy,
            pop: popSpy,
        } as any;

        ul.appendChild(innerUl);

        spyOn(stackFormat, 'stackFormat').and.callFake((context, options, callback) => {
            callback();
        });

        childProcessor.and.callFake(originalChildProcessor);

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(pushSpy).toHaveBeenCalledTimes(2);
        expect(popSpy).toHaveBeenCalledTimes(2);

        expect(pushSpy).toHaveBeenCalledWith({ listType: 'UL' });
    });

    it('list has margin, padding, and style position', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');
        const group = createContentModelDocument();

        ol.appendChild(li);

        childProcessor.and.callFake(originalChildProcessor);

        ol.style.margin = '1px';
        ol.style.padding = '2px';
        ol.style.listStylePosition = 'inside';

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'OL',
                            marginTop: '1px',
                            marginRight: '1px',
                            marginBottom: '1px',
                            marginLeft: '1px',
                            paddingTop: '2px',
                            paddingRight: '2px',
                            paddingBottom: '2px',
                            paddingLeft: '2px',
                            listStylePosition: 'inside',
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    format: {},
                },
            ],
        });
    });

    it('list clear margin from context', () => {
        const group = createContentModelDocument();
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        ol.style.margin = '0';
        context.blockFormat.marginLeft = '40px';
        childProcessor.and.callFake(originalChildProcessor);

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'OL',
                            marginTop: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                            marginRight: '0px',
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    format: {},
                },
            ],
        });
    });
});

describe('listProcessor without format handlers', () => {
    let childProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;
    let context: DomToModelContext;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                ul: listProcessor,
                ol: listProcessor,
                child: childProcessor,
            },
            formatParserOverride: {
                listType: null,
                listLevelThread: null,
                listLevelMetadata: null,
            },
        });
    });

    it('Single UL element', () => {
        const group = createContentModelDocument();
        const ul = document.createElement('ul');

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{}]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Single OL element', () => {
        const group = createContentModelDocument();
        const ol = document.createElement('ol');

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{}]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('OL element with segment format', () => {
        const group = createContentModelDocument();
        const ol = document.createElement('ol');

        ol.style.color = 'red';
        ol.style.fontFamily = 'a';
        ol.style.fontSize = '10px';

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{}]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({
                textColor: 'red',
                fontFamily: 'a',
                fontSize: '10px',
            });
        });

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Nested UL elements', () => {
        const group = createContentModelDocument();
        const ul = document.createElement('ul');
        const innerUl = document.createElement('ul');

        ul.appendChild(innerUl);

        childProcessor.and.callFake(originalChildProcessor);
        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(childProcessor).toHaveBeenCalledTimes(2);
        expect(childProcessor).toHaveBeenCalledWith(group, ul, context);
        expect(childProcessor).toHaveBeenCalledWith(group, innerUl, context);
    });

    it('Nested UL elements, check context', () => {
        const group = createContentModelDocument();
        const ul = document.createElement('ul');
        const innerUl = document.createElement('ul');

        const pushSpy = jasmine.createSpy('push');
        const popSpy = jasmine.createSpy('pop');

        context.listFormat.levels = {
            push: pushSpy,
            pop: popSpy,
        } as any;

        ul.appendChild(innerUl);

        spyOn(stackFormat, 'stackFormat').and.callFake((context, options, callback) => {
            callback();
        });

        childProcessor.and.callFake(originalChildProcessor);

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(pushSpy).toHaveBeenCalledTimes(2);
        expect(popSpy).toHaveBeenCalledTimes(2);

        expect(pushSpy).toHaveBeenCalledWith({});
    });
});

describe('listProcessor process metadata', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: childProcessor,
            },
        });
    });

    it('OL without list style type and metadata', () => {
        const ol = document.createElement('ol');
        const group = createContentModelDocument();

        childProcessor.and.callFake((group, element, context) => {
            expect(context.listFormat.levels).toEqual([
                {
                    listType: 'OL',
                },
            ]);
        });

        listProcessor(group, ol, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('OL with valid metadata', () => {
        const ol = document.createElement('ol');
        const group = createContentModelDocument();

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: 1,
            unorderedStyleType: 2,
        });

        childProcessor.and.callFake((group, element, context) => {
            expect(context.listFormat.levels).toEqual([
                {
                    listType: 'OL',
                    orderedStyleType: 1,
                    unorderedStyleType: 2,
                },
            ]);
        });

        listProcessor(group, ol, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('OL with invalid metadata', () => {
        const ol = document.createElement('ol');
        const group = createContentModelDocument();

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: true,
            unorderedStyleType: 100,
        });

        childProcessor.and.callFake((group, element, context) => {
            expect(context.listFormat.levels).toEqual([
                {
                    listType: 'OL',
                },
            ]);
        });

        listProcessor(group, ol, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('OL with metadata that has value at the edge of range', () => {
        const ol = document.createElement('ol');
        const group = createContentModelDocument();

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: NumberingListType.Max,
            unorderedStyleType: BulletListType.Max,
        });

        childProcessor.and.callFake((group, element, context) => {
            expect(context.listFormat.levels).toEqual([
                {
                    listType: 'OL',
                    orderedStyleType: NumberingListType.Max,
                    unorderedStyleType: BulletListType.Max,
                },
            ]);
        });

        listProcessor(group, ol, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('OL with metadata that has value at the out of range', () => {
        const ol = document.createElement('ol');
        const group = createContentModelDocument();

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: NumberingListType.Max + 1,
            unorderedStyleType: BulletListType.Max + 1,
        });

        childProcessor.and.callFake((group, element, context) => {
            expect(context.listFormat.levels).toEqual([
                {
                    listType: 'OL',
                },
            ]);
        });

        listProcessor(group, ol, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('OL with conflict metadata and list type', () => {
        const ol = document.createElement('ol');
        const group = createContentModelDocument();

        ol.style.listStyleType = 'decimal';
        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: NumberingListType.Max,
        });

        childProcessor.and.callFake((group, element, context) => {
            expect(context.listFormat.levels).toEqual([
                {
                    listType: 'OL',
                    orderedStyleType: NumberingListType.Max,
                },
            ]);
        });

        listProcessor(group, ol, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Context has block formats', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');
        const group = createContentModelDocument();

        ol.appendChild(li);

        context.blockFormat.direction = 'rtl';

        childProcessor.and.callFake(originalChildProcessor);

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'OL',
                            direction: 'rtl',
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    format: {},
                },
            ],
        });
    });
});
