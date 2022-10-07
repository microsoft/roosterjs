import * as containerProcessor from '../../../lib/domToModel/processors/containerProcessor';
import * as stackFormat from '../../../lib/domToModel/utils/stackFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { listProcessor } from '../../../lib/domToModel/processors/listProcessor';

describe('listProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext(undefined, {
            processorOverride: {
                UL: listProcessor,
                OL: listProcessor,
            },
        });
    });

    it('Single UL element', () => {
        const group = createContentModelDocument(document);
        const ul = document.createElement('ul');

        spyOn(containerProcessor, 'containerProcessor').and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{ listType: 'UL' }]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Single OL element', () => {
        const group = createContentModelDocument(document);
        const ol = document.createElement('ol');

        spyOn(containerProcessor, 'containerProcessor').and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{ listType: 'OL' }]);
            expect(context.listFormat.threadItemCounts).toEqual([0]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([0]);
        expect(context.segmentFormat).toEqual({});
    });

    it('OL element with segment format', () => {
        const group = createContentModelDocument(document);
        const ol = document.createElement('ol');

        ol.style.color = 'red';
        ol.style.fontFamily = 'a';
        ol.style.fontSize = '10px';

        spyOn(containerProcessor, 'containerProcessor').and.callFake((group, parent, context) => {
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
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([0]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Nested UL elements', () => {
        const group = createContentModelDocument(document);
        const ul = document.createElement('ul');
        const innerUl = document.createElement('ul');

        ul.appendChild(innerUl);

        spyOn(containerProcessor, 'containerProcessor').and.callThrough();
        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(2);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(group, ul, context);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(group, innerUl, context);
    });

    it('Nested UL elements, check context', () => {
        const group = createContentModelDocument(document);
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

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(pushSpy).toHaveBeenCalledTimes(2);
        expect(popSpy).toHaveBeenCalledTimes(2);

        expect(pushSpy).toHaveBeenCalledWith({ listType: 'UL' });
    });
});

describe('listProcessor without format handlers', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext(undefined, {
            processorOverride: {
                UL: listProcessor,
                OL: listProcessor,
            },
            formatParserOverride: {
                listType: null,
                listLevelThread: null,
                listLevelMetadata: null,
            },
        });
    });

    it('Single UL element', () => {
        const group = createContentModelDocument(document);
        const ul = document.createElement('ul');

        spyOn(containerProcessor, 'containerProcessor').and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{}]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Single OL element', () => {
        const group = createContentModelDocument(document);
        const ol = document.createElement('ol');

        spyOn(containerProcessor, 'containerProcessor').and.callFake((group, parent, context) => {
            expect(context.listFormat.listParent).toBe(group);
            expect(context.listFormat.levels).toEqual([{}]);
            expect(context.listFormat.threadItemCounts).toEqual([]);
            expect(context.segmentFormat).toEqual({});
        });

        listProcessor(group, ol, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('OL element with segment format', () => {
        const group = createContentModelDocument(document);
        const ol = document.createElement('ol');

        ol.style.color = 'red';
        ol.style.fontFamily = 'a';
        ol.style.fontSize = '10px';

        spyOn(containerProcessor, 'containerProcessor').and.callFake((group, parent, context) => {
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
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});
    });

    it('Nested UL elements', () => {
        const group = createContentModelDocument(document);
        const ul = document.createElement('ul');
        const innerUl = document.createElement('ul');

        ul.appendChild(innerUl);

        spyOn(containerProcessor, 'containerProcessor').and.callThrough();
        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });

        expect(context.listFormat.listParent).toBeUndefined();
        expect(context.listFormat.levels).toEqual([]);
        expect(context.listFormat.threadItemCounts).toEqual([]);
        expect(context.segmentFormat).toEqual({});

        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(2);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(group, ul, context);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(group, innerUl, context);
    });

    it('Nested UL elements, check context', () => {
        const group = createContentModelDocument(document);
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

        listProcessor(group, ul, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
