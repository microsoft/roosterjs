import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ListMetadataFormat } from '../../../lib/publicTypes/format/formatParts/ListMetadataFormat';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import {
    getOrderedListStyleValue,
    listItemMetadataFormatHandler,
} from '../../../lib/formatHandlers/list/listItemMetadataFormatHandler';

describe('listItemMetadataFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: ListMetadataFormat;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
    });

    it('No OP', () => {
        const li = document.createElement('li');

        listItemMetadataFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });
});

describe('listItemMetadataFormatHandler.parse', () => {
    let context: ModelToDomContext;
    let format: ListMetadataFormat;
    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('LI not under OL', () => {
        const li = document.createElement('li');

        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('LI under OL without context', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('LI under OL with context', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under OL with deeper context', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li style="list-style-type: lower-alpha;"></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under OL with context and list style', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        format.orderedStyleType = NumberingListType.LowerRoman;
        format.unorderedStyleType = BulletListType.Circle;

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li style="list-style-type: lower-roman;"></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under OL with context and customized list style', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        format.orderedStyleType = NumberingListType.DecimalDoubleParenthesis;
        format.unorderedStyleType = BulletListType.Circle;

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li style="list-style-type: &quot;(1) &quot;;"></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under UL with context and customized list style', () => {
        const ul = document.createElement('ul');
        const li = document.createElement('li');

        ul.appendChild(li);

        format.orderedStyleType = NumberingListType.DecimalDoubleParenthesis;
        format.unorderedStyleType = BulletListType.ShortArrow;

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li style="list-style-type: &quot;➢ &quot;;"></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });
});

describe('listItemMetadataFormatHandler.getOrderedListStyleValue', () => {
    it('Invalid input and 1', () => {
        expect(getOrderedListStyleValue('test', 1)).toBe('test');
    });

    it('Number and 1', () => {
        expect(getOrderedListStyleValue('${Number}', 1)).toBe('1');
        expect(getOrderedListStyleValue('aa${Number}bb', 1)).toBe('aa1bb');
        expect(getOrderedListStyleValue('(${Number})', 1)).toBe('(1)');
    });

    it('LowerAlpha and 1', () => {
        expect(getOrderedListStyleValue('${LowerAlpha}', 1)).toBe('a');
        expect(getOrderedListStyleValue('aa${LowerAlpha}bb', 1)).toBe('aaabb');
        expect(getOrderedListStyleValue('(${LowerAlpha})', 1)).toBe('(a)');
    });

    it('LowerAlpha and 100', () => {
        expect(getOrderedListStyleValue('${LowerAlpha}', 100)).toBe('cv');
        expect(getOrderedListStyleValue('aa${LowerAlpha}bb', 100)).toBe('aacvbb');
        expect(getOrderedListStyleValue('(${LowerAlpha})', 100)).toBe('(cv)');
    });

    it('UpperAlpha and 1', () => {
        expect(getOrderedListStyleValue('${UpperAlpha}', 1)).toBe('A');
        expect(getOrderedListStyleValue('aa${UpperAlpha}bb', 1)).toBe('aaAbb');
        expect(getOrderedListStyleValue('(${UpperAlpha})', 1)).toBe('(A)');
    });

    it('UpperAlpha and 100', () => {
        expect(getOrderedListStyleValue('${UpperAlpha}', 100)).toBe('CV');
        expect(getOrderedListStyleValue('aa${UpperAlpha}bb', 100)).toBe('aaCVbb');
        expect(getOrderedListStyleValue('(${UpperAlpha})', 100)).toBe('(CV)');
    });

    it('LowerRoman and 1', () => {
        expect(getOrderedListStyleValue('${LowerRoman}', 1)).toBe('i');
        expect(getOrderedListStyleValue('aa${LowerRoman}bb', 1)).toBe('aaibb');
        expect(getOrderedListStyleValue('(${LowerRoman})', 1)).toBe('(i)');
    });

    it('UpperRoman and 100', () => {
        expect(getOrderedListStyleValue('${UpperRoman}', 100)).toBe('C');
        expect(getOrderedListStyleValue('aa${UpperRoman}bb', 100)).toBe('aaCbb');
        expect(getOrderedListStyleValue('(${UpperRoman})', 100)).toBe('(C)');
    });

    it('UpperRoman and 10000', () => {
        expect(getOrderedListStyleValue('${UpperRoman}', 10000)).toBe('MMMMMMMMMM');
        expect(getOrderedListStyleValue('aa${UpperRoman}bb', 10000)).toBe('aaMMMMMMMMMMbb');
        expect(getOrderedListStyleValue('(${UpperRoman})', 10000)).toBe('(MMMMMMMMMM)');
    });
});
