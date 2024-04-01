import { ContentModelListItemFormat, ModelToDomContext } from 'roosterjs-content-model-types';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../../lib/override/listMetadataApplier';
import {
    BulletListType,
    createModelToDomContext,
    NumberingListType,
} from 'roosterjs-content-model-dom';

describe('listItemMetadataApplier', () => {
    let context: ModelToDomContext;
    let format: ContentModelListItemFormat;

    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('No metadata', () => {
        listItemMetadataApplier.applierFunction(null, format, context);

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('Has metadata, single list item', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.LowerRoman,
                unorderedStyleType: BulletListType.Circle,
            },
            format,
            context
        );

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
        expect(format).toEqual({});
    });

    it('Has metadata, already has list style type', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        format.listStyleType = 'test';

        listItemMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.LowerRoman,
                unorderedStyleType: BulletListType.Circle,
            },
            format,
            context
        );

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
        expect(format).toEqual({});
    });

    it('Has metadata, has start number', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.DecimalDoubleParenthesis,
                unorderedStyleType: BulletListType.Circle,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: '"(2) "',
        });
    });

    it('Has metadata, has start number, apply list style from level, no existing style', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemMetadataApplier.applierFunction(
            {
                applyListStyleFromLevel: true,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({});
    });

    it('Has metadata, has start number, apply list style from level, has existing style', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        format.listStyleType = 'test';

        listItemMetadataApplier.applierFunction(
            {
                applyListStyleFromLevel: true,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({});
    });

    it('Has metadata, has start number, do not apply list style from level, has existing style', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        format.listStyleType = 'test';

        listItemMetadataApplier.applierFunction(
            {
                applyListStyleFromLevel: false,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: 'test',
        });
    });

    it('UL has metadata', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
                listType: 'UL',
            },
        ];

        listItemMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.DecimalDoubleParenthesis,
                unorderedStyleType: BulletListType.ShortArrow,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                    listType: 'UL',
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: '"➢ "',
        });
    });

    it('OL has metadata in deeper level', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
                listType: 'UL',
            },
            {
                node: {} as Node,
                listType: 'OL',
            },
        ];
        context.listFormat.threadItemCounts = [2, 3, 4];

        listItemMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.DecimalDoubleParenthesis,
                unorderedStyleType: BulletListType.ShortArrow,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 3, 4],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                    listType: 'UL',
                },
                {
                    node: {} as Node,
                    listType: 'OL',
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: '"(3) "',
        });
    });

    describe('OrderedListStyleValue', () => {
        function runTest(formatNum: number, itemNum: number, result: string) {
            context.listFormat.nodeStack = [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ];
            context.listFormat.threadItemCounts = [itemNum];

            listItemMetadataApplier.applierFunction(
                {
                    orderedStyleType: formatNum,
                },
                format,
                context
            );

            if (result) {
                expect(format).toEqual({
                    listStyleType: result,
                });
            } else {
                expect(format).toEqual({});
            }
        }

        it('Invalid input', () => {
            runTest(-1 as any, 1, '');
        });

        it('Decimal and 1', () => {
            runTest(NumberingListType.Decimal, 1, '');
            runTest(NumberingListType.DecimalDash, 1, '"1- "');
            runTest(NumberingListType.DecimalParenthesis, 1, '"1) "');
            runTest(NumberingListType.DecimalDoubleParenthesis, 1, '"(1) "');
        });

        it('LowerAlpha and 1', () => {
            runTest(NumberingListType.LowerAlpha, 1, '');
            runTest(NumberingListType.LowerAlphaDash, 1, '"a- "');
            runTest(NumberingListType.LowerAlphaParenthesis, 1, '"a) "');
            runTest(NumberingListType.LowerAlphaDoubleParenthesis, 1, '"(a) "');
        });

        it('LowerAlpha and 100', () => {
            runTest(NumberingListType.LowerAlpha, 100, '');
            runTest(NumberingListType.LowerAlphaDash, 100, '"cv- "');
            runTest(NumberingListType.LowerAlphaParenthesis, 100, '"cv) "');
            runTest(NumberingListType.LowerAlphaDoubleParenthesis, 100, '"(cv) "');
        });

        it('UpperAlpha and 1', () => {
            runTest(NumberingListType.UpperAlpha, 1, '');
            runTest(NumberingListType.UpperAlphaDash, 1, '"A- "');
            runTest(NumberingListType.UpperAlphaParenthesis, 1, '"A) "');
            runTest(NumberingListType.UpperAlphaDoubleParenthesis, 1, '"(A) "');
        });

        it('UpperAlpha and 100', () => {
            runTest(NumberingListType.UpperAlpha, 100, '');
            runTest(NumberingListType.UpperAlphaDash, 100, '"CV- "');
            runTest(NumberingListType.UpperAlphaParenthesis, 100, '"CV) "');
            runTest(NumberingListType.UpperAlphaDoubleParenthesis, 100, '"(CV) "');
        });

        it('LowerRoman and 1', () => {
            runTest(NumberingListType.LowerRoman, 1, '');
            runTest(NumberingListType.LowerRomanDash, 1, '"i- "');
            runTest(NumberingListType.LowerRomanParenthesis, 1, '"i) "');
            runTest(NumberingListType.LowerRomanDoubleParenthesis, 1, '"(i) "');
        });

        it('LowerRoman and 100', () => {
            runTest(NumberingListType.UpperRoman, 100, '');
            runTest(NumberingListType.UpperRomanDash, 100, '"C- "');
            runTest(NumberingListType.UpperRomanParenthesis, 100, '"C) "');
            runTest(NumberingListType.UpperRomanDoubleParenthesis, 100, '"(C) "');
        });

        it('UpperRoman and 100', () => {
            runTest(NumberingListType.UpperRoman, 100, '');
            runTest(NumberingListType.UpperRomanDash, 100, '"C- "');
            runTest(NumberingListType.UpperRomanParenthesis, 100, '"C) "');
            runTest(NumberingListType.UpperRomanDoubleParenthesis, 100, '"(C) "');
        });

        it('UpperRoman and 10000', () => {
            runTest(NumberingListType.UpperRoman, 10000, '');
            runTest(NumberingListType.UpperRomanDash, 10000, '"MMMMMMMMMM- "');
            runTest(NumberingListType.UpperRomanParenthesis, 10000, '"MMMMMMMMMM) "');
            runTest(NumberingListType.UpperRomanDoubleParenthesis, 10000, '"(MMMMMMMMMM) "');
        });
    });

    describe('UnorderedListStyleValue', () => {
        function runTest(formatNum: number, result: string) {
            context.listFormat.nodeStack = [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                    listType: 'UL',
                },
            ];

            listItemMetadataApplier.applierFunction(
                {
                    unorderedStyleType: formatNum,
                },
                format,
                context
            );

            if (result) {
                expect(format).toEqual({
                    listStyleType: result,
                });
            } else {
                expect(format).toEqual({});
            }
        }

        it('Invalid input', () => {
            runTest(-1 as any, '');
        });

        it('Valid input', () => {
            runTest(BulletListType.Disc, '');
            runTest(BulletListType.Square, '"∎ "');
            runTest(BulletListType.Circle, '');
            runTest(BulletListType.Dash, '"- "');
            runTest(BulletListType.LongArrow, '"➔ "');
            runTest(BulletListType.DoubleLongArrow, '"➔ "');
            runTest(BulletListType.ShortArrow, '"➢ "');
            runTest(BulletListType.UnfilledArrow, '"➪ "');
            runTest(BulletListType.Hyphen, '"— "');
        });
    });
});

describe('listLevelMetadataApplier', () => {
    let context: ModelToDomContext;
    let format: ContentModelListItemFormat;

    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('No metadata', () => {
        listLevelMetadataApplier.applierFunction(null, format, context);

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('Has metadata, single list item', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listLevelMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.LowerRoman,
                unorderedStyleType: BulletListType.Circle,
            },
            format,
            context
        );

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
        expect(format).toEqual({
            listStyleType: 'lower-roman',
        });
    });

    it('Has metadata, already has list style type', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        format.listStyleType = 'test';

        listLevelMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.LowerRoman,
                unorderedStyleType: BulletListType.Circle,
            },
            format,
            context
        );

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
        expect(format).toEqual({
            listStyleType: 'lower-roman',
        });
    });

    it('Has metadata, has start number', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listLevelMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.DecimalDoubleParenthesis,
                unorderedStyleType: BulletListType.Circle,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({});
    });

    it('Has metadata, has start number, apply list style from level, no existing style', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listLevelMetadataApplier.applierFunction(
            {
                applyListStyleFromLevel: true,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: 'decimal',
        });
    });

    it('Has metadata, has start number, apply list style from level, has existing style', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        format.listStyleType = 'test';

        listLevelMetadataApplier.applierFunction(
            {
                applyListStyleFromLevel: true,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: 'decimal',
        });
    });

    it('Has metadata, has start number, do not apply list style from level, has existing style', () => {
        context.listFormat.threadItemCounts = [2];
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        format.listStyleType = 'test';

        listLevelMetadataApplier.applierFunction(
            {
                applyListStyleFromLevel: false,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
        expect(format).toEqual({
            listStyleType: 'test',
        });
    });

    it('UL has metadata', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
                listType: 'UL',
            },
        ];

        listLevelMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.DecimalDoubleParenthesis,
                unorderedStyleType: BulletListType.ShortArrow,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                    listType: 'UL',
                },
            ],
        });
        expect(format).toEqual({});
    });

    it('OL has metadata in deeper level', () => {
        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
                listType: 'UL',
            },
            {
                node: {} as Node,
                listType: 'OL',
            },
        ];
        context.listFormat.threadItemCounts = [2, 3, 4];

        listLevelMetadataApplier.applierFunction(
            {
                orderedStyleType: NumberingListType.DecimalDoubleParenthesis,
                unorderedStyleType: BulletListType.ShortArrow,
            },
            format,
            context
        );

        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 3, 4],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                    listType: 'UL',
                },
                {
                    node: {} as Node,
                    listType: 'OL',
                },
            ],
        });
        expect(format).toEqual({});
    });

    describe('OrderedListStyleValue', () => {
        function runTest(formatNum: number, itemNum: number, result: string) {
            context.listFormat.nodeStack = [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ];
            context.listFormat.threadItemCounts = [itemNum];

            listLevelMetadataApplier.applierFunction(
                {
                    orderedStyleType: formatNum,
                },
                format,
                context
            );

            if (result) {
                expect(format).toEqual({
                    listStyleType: result,
                });
            } else {
                expect(format).toEqual({});
            }
        }

        it('Invalid input', () => {
            runTest(-1 as any, 1, '');
        });

        it('Decimal and 1', () => {
            runTest(NumberingListType.Decimal, 1, 'decimal');
            runTest(NumberingListType.DecimalDash, 1, '');
            runTest(NumberingListType.DecimalParenthesis, 1, '');
            runTest(NumberingListType.DecimalDoubleParenthesis, 1, '');
        });

        it('LowerAlpha and 1', () => {
            runTest(NumberingListType.LowerAlpha, 1, 'lower-alpha');
            runTest(NumberingListType.LowerAlphaDash, 1, '');
            runTest(NumberingListType.LowerAlphaParenthesis, 1, '');
            runTest(NumberingListType.LowerAlphaDoubleParenthesis, 1, '');
        });

        it('UpperAlpha and 1', () => {
            runTest(NumberingListType.UpperAlpha, 1, 'upper-alpha');
            runTest(NumberingListType.UpperAlphaDash, 1, '');
            runTest(NumberingListType.UpperAlphaParenthesis, 1, '');
            runTest(NumberingListType.UpperAlphaDoubleParenthesis, 1, '');
        });

        it('LowerRoman and 1', () => {
            runTest(NumberingListType.LowerRoman, 1, 'lower-roman');
            runTest(NumberingListType.LowerRomanDash, 1, '');
            runTest(NumberingListType.LowerRomanParenthesis, 1, '');
            runTest(NumberingListType.LowerRomanDoubleParenthesis, 1, '');
        });
    });

    describe('UnorderedListStyleValue', () => {
        function runTest(formatNum: number, result: string) {
            context.listFormat.nodeStack = [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                    listType: 'UL',
                },
            ];

            listLevelMetadataApplier.applierFunction(
                {
                    unorderedStyleType: formatNum,
                },
                format,
                context
            );

            if (result) {
                expect(format).toEqual({
                    listStyleType: result,
                });
            } else {
                expect(format).toEqual({});
            }
        }

        it('Invalid input', () => {
            runTest(-1 as any, '');
        });

        it('Valid input', () => {
            runTest(BulletListType.Disc, 'disc');
            runTest(BulletListType.Square, '');
            runTest(BulletListType.Circle, 'circle');
            runTest(BulletListType.Dash, '');
            runTest(BulletListType.LongArrow, '');
            runTest(BulletListType.DoubleLongArrow, '');
            runTest(BulletListType.ShortArrow, '');
            runTest(BulletListType.UnfilledArrow, '');
            runTest(BulletListType.Hyphen, '');
        });
    });
});
