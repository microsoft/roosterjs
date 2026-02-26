import * as getStyleMetadata from '../../../lib/paste/WordDesktop/getStyleMetadata';
import { createBeforePasteEventMock } from '../createBeforePasteEventMock';
import { expectEqual } from '../e2e/testUtils';
import { processPastedContentFromWordDesktop } from '../../../lib/paste/WordDesktop/processPastedContentFromWordDesktop';
import { WordMetadata } from '../../../lib/paste/WordDesktop/WordMetadata';
import {
    createDomToModelContext,
    domToContentModel,
    moveChildNodes,
} from 'roosterjs-content-model-dom';

describe('processPastedContentFromWordDesktopTest', () => {
    let div: HTMLElement;
    let fragment: DocumentFragment;

    function runTest(
        source?: string,
        expectedModel?: any,
        removeUndefinedValues?: boolean,
        htmlBefore?: string
    ) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment, htmlBefore);
        processPastedContentFromWordDesktop(event.domToModelOption, htmlBefore || source || '');

        const model = domToContentModel(
            fragment,
            createDomToModelContext(undefined, event.domToModelOption)
        );

        if (expectedModel) {
            if (removeUndefinedValues) {
                expectEqual(model, expectedModel);
            } else {
                expect(model).toEqual(expectedModel);
            }
        }
    }

    it('Remove Comment | mso-element:comment-list', () => {
        let source =
            '<div style="mso-element:comment-list"><div style="mso-element:comment">Test</div></div>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Remove Comment | #_msocom_', () => {
        let source =
            '<p class="MsoNormal"><a name="_msoanchor_11" href="#_msocom_11" id="_anchor_11" class="msocomanchor">[BV11]</a></p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Remove Comment | mso-comment-reference', () => {
        let source =
            '<p class="MsoNormal"><a style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;mso-comment-parent:1">Test</a><a style="mso-comment-reference:BV_3;mso-comment-date:20220420T1711;mso-comment-parent:1">Test</a></p>';

        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove Comment | mso-comment-continuation, remove style 1', () => {
        let source = '<span>Test<span style="mso-comment-continuation:3">Test</span></span>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove Comment | mso-comment-done, remove style', () => {
        let source = '<span style="mso-comment-done:yes">Test</span>';
        runTest(
            source,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        isImplicit: true,
                        segments: [{ text: 'Test', segmentType: 'Text', format: {} }],
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Remove Comment | mso-special-character:comment', () => {
        let source = '<span><span style="mso-special-character:comment">Test</span></span>';
        runTest(source, { blockGroupType: 'Document', blocks: [] }, true);
    });

    it('adjust Line height less than default', () => {
        let source = '<p style="line-height:102%">Test</p>';
        runTest(
            source,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        segments: [{ text: 'Test', segmentType: 'Text', format: {} }],
                        blockType: 'Paragraph',
                        format: { marginTop: '1em', marginBottom: '1em', lineHeight: '1.224' },
                        decorator: { tagName: 'p', format: {} },
                    },
                ],
            },
            true
        );
    });

    it(' Line height, not percentage do not remove', () => {
        let source = '<p style="line-height:1">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: '1' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove Line height, not percentage 2', () => {
        let source = '<p style="line-height:initial">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: 'initial' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Set line height to 120% when line-height is normal', () => {
        let source = '<p style="line-height:normal">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: '120%' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Set line height to 120% when line-height is NORMAL (uppercase) - case insensitive', () => {
        let source = '<p style="line-height:NORMAL">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: '120%' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Line height with percentage should adjust percentage calculation', () => {
        let source = '<p style="line-height:50%">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: '0.6' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Line height with invalid percentage should not be modified', () => {
        let source = '<p style="line-height:abc%">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Adjust Line height, percentage greater than default 2', () => {
        let source = '<p style="line-height:122%">Test</p>';
        runTest(source, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: '1.464' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove Negative Left margin from table', () => {
        runTest(
            '<div><table style="margin-left: -5px;"><tbody><tr><td>Test</td></tr><tbody></table></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'Test',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
            }
        );
    });

    it('Preserve the htmlAlign from Format container', () => {
        runTest(
            '<div align="center"><table style="margin-left: -5px;"><tbody><tr><td>Test</td></tr><tbody></table></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: jasmine.any(Array),
                        format: { htmlAlign: 'center' },
                    },
                ],
            }
        );
    });

    describe('List Convertion Tests | ', () => {
        it('List with Headings', () => {
            const html =
                createListElementFromWord('p', 'test1') + createListElementFromWord('h1', 'test2');

            const dta = {
                'mso-level-number-format': 'bullet',
            };
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>().set('l0:level1', dta)
            );

            runTest(html, {
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
                                        text: 'test1',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Symbol',
                            },
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                                segmentFormat: { fontSize: '2em' },
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                                fontFamily: 'Symbol',
                            },
                        },
                        format: {},
                    },
                ],
            });
        });

        it('List with Headings in sub level 1', () => {
            const html =
                createListElementFromWord('p', 'test1') +
                createListElementFromWord('h1', 'test2', 'l0 level2 lfo1');

            const dta = {
                'mso-level-number-format': 'bullet',
            };
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>().set('l0:level1', dta).set('l0:level2', dta)
            );

            runTest(html, {
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
                                        text: 'test1',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: { fontFamily: 'Symbol' },
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                                segmentFormat: { fontSize: '2em' },
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                                fontFamily: 'Symbol',
                            },
                        },
                        format: {},
                    },
                ],
            });
        });

        it('List with Headings in sub level 2', () => {
            const html =
                createListElementFromWord('p', 'test1') +
                createListElementFromWord('h1', 'test2', 'l0 level3 lfo1');

            const dta = {
                'mso-level-number-format': 'bullet',
            };
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>().set('l0:level1', dta).set('l0:level3', dta)
            );

            runTest(html, {
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
                                        text: 'test1',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: { fontFamily: 'Symbol' },
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                                segmentFormat: { fontSize: '2em' },
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                                fontFamily: 'Symbol',
                            },
                        },
                        format: {},
                    },
                ],
            });
        });

        it('List with Headings in sub level 3', () => {
            const html =
                createListElementFromWord('p', 'test1') +
                createListElementFromWord('h1', 'test2', 'l1 level3 lfo2');

            const dta = {
                'mso-level-number-format': 'bullet',
            };
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>().set('l0:level1', dta).set('l1:level3', dta)
            );
            runTest(html, {
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
                                        text: 'test1',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: { fontFamily: 'Symbol' },
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                                segmentFormat: { fontSize: '2em' },
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginTop: '1em',
                                    marginBottom: undefined,
                                    wordList: 'l0',
                                },
                            },
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginBottom: undefined,
                                    wordList: 'l1',
                                },
                            },
                            {
                                listType: 'UL',
                                dataset: {},
                                format: {
                                    marginBottom: undefined,
                                    wordList: 'l1',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: { fontSize: '2em', fontWeight: 'bold', fontFamily: 'Symbol' },
                        },
                        format: {},
                    },
                ],
            });
        });

        it('Complex list inside a Table cell', () => {
            const html =
                '<table id="t1"><td id="td1">' +
                createListElementFromWord('p', 'test1', 'l1 level4 lfo2') +
                createListElementFromWord('p', 'test2', 'l1 level3 lfo2') +
                createListElementFromWord('p', 'test2', 'l1 level2 lfo2') +
                createListElementFromWord('p', 'test2', 'l1 level5 lfo2') +
                '</td></table>';

            const dta = {
                'mso-level-number-format': 'bullet',
            };
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>()
                    .set('l1:level2', dta)
                    .set('l1:level3', dta)
                    .set('l1:level5', dta)
                    .set('l1:level4', dta)
            );
            div = document.createElement('div');
            fragment = document.createDocumentFragment();
            div.innerHTML = html;
            moveChildNodes(fragment, div);
            runTest(undefined, {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                format: {},
                                height: 0,
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
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
                                                                text: 'test1',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {},
                                                        isImplicit: true,
                                                    },
                                                ],
                                                levels: [
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: false,
                                                    format: { fontFamily: 'Symbol' },
                                                },
                                                format: {},
                                            },
                                            {
                                                blockType: 'BlockGroup',
                                                blockGroupType: 'ListItem',
                                                blocks: [
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [
                                                            {
                                                                segmentType: 'Text',
                                                                text: 'test2',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {},
                                                        isImplicit: true,
                                                    },
                                                ],
                                                levels: [
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: false,
                                                    format: { fontFamily: 'Symbol' },
                                                },
                                                format: {},
                                            },
                                            {
                                                blockType: 'BlockGroup',
                                                blockGroupType: 'ListItem',
                                                blocks: [
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [
                                                            {
                                                                segmentType: 'Text',
                                                                text: 'test2',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {},
                                                        isImplicit: true,
                                                    },
                                                ],
                                                levels: [
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: false,
                                                    format: { fontFamily: 'Symbol' },
                                                },
                                                format: {},
                                            },
                                            {
                                                blockType: 'BlockGroup',
                                                blockGroupType: 'ListItem',
                                                blocks: [
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [
                                                            {
                                                                segmentType: 'Text',
                                                                text: 'test2',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {},
                                                        isImplicit: true,
                                                    },
                                                ],
                                                levels: [
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        dataset: {},
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: undefined,
                                                            wordList: 'l1',
                                                        },
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: false,
                                                    format: { fontFamily: 'Symbol' },
                                                },
                                                format: {},
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        dataset: {},
                        format: { id: 't1' },
                        widths: [],
                    },
                ],
            });
        });

        /**
         *  Input
         *  1. li
         *      2. li
         *          3. (p with msolist)
         *              4. li
         *
         *  Result
         *
         *  1. li
         *      2. li
         *          3. li
         *              4. li
         */
        it('Both List and Divs with mso-list metdata', () => {
            runTest(
                '<ol type="1" start="1" style="margin-top:0in">' +
                    '<li style="margin-left:0in;mso-list:l0 level1 lfo1" class="MsoListParagraph">123123</li>' +
                    '<ol type="a" start="1" style="margin-top:0in">' +
                    '<li style="margin-left:0in;mso-list:l0 level2 lfo1" class="MsoListParagraph">123123</li>' +
                    '</ol>' +
                    '</ol>' +
                    '<p style="margin-left:1.5in;text-indent:-1.5in;' +
                    'mso-text-indent-alt:-9.0pt;mso-list:l0 level3 lfo1" class="MsoListParagraph">123123</p>' +
                    '<ol type="1" start="1" style="margin-top:0in">' +
                    '<ol type="a" start="1" style="margin-top:0in">' +
                    '<ol type="i" start="1" style="margin-top:0in">' +
                    '<ol type="1" start="1" style="margin-top:0in">' +
                    '<li style="margin-left:0in;mso-list:l0 level4 lfo1" class="MsoListParagraph">123123123</li>' +
                    '</ol>' +
                    '</ol>' +
                    '</ol>' +
                    '</ol>',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            formatHolder: {
                                isSelected: false,
                                segmentType: 'SelectionMarker',
                                format: {},
                            },
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            blockType: 'BlockGroup',
                            format: {
                                marginLeft: '0in',
                            },
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    isImplicit: true,
                                    segments: [
                                        {
                                            text: '123123',
                                            segmentType: 'Text',
                                            format: {},
                                        },
                                    ],
                                    blockType: 'Paragraph',
                                    format: {},
                                },
                            ],
                        },
                        {
                            formatHolder: {
                                isSelected: false,
                                segmentType: 'SelectionMarker',
                                format: {},
                            },
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            blockType: 'BlockGroup',
                            format: {
                                marginLeft: '0in',
                            },
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    isImplicit: true,
                                    segments: [
                                        {
                                            text: '123123',
                                            segmentType: 'Text',
                                            format: {},
                                        },
                                    ],
                                    blockType: 'Paragraph',
                                    format: {},
                                },
                            ],
                        },
                        {
                            formatHolder: {
                                isSelected: false,
                                segmentType: 'SelectionMarker',
                                format: {},
                            },
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            blockType: 'BlockGroup',
                            format: {
                                marginLeft: '104px',
                            },
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    isImplicit: true,
                                    segments: [
                                        {
                                            text: '123123',
                                            segmentType: 'Text',
                                            format: {},
                                        },
                                    ],
                                    blockType: 'Paragraph',
                                    format: {},
                                },
                            ],
                        },
                        {
                            formatHolder: {
                                isSelected: false,
                                segmentType: 'SelectionMarker',
                                format: {},
                            },
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            blockType: 'BlockGroup',
                            format: {
                                marginLeft: '0in',
                            },
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    isImplicit: true,
                                    segments: [
                                        {
                                            text: '123123123',
                                            segmentType: 'Text',
                                            format: {},
                                        },
                                    ],
                                    blockType: 'Paragraph',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
                true
            );
        });

        it('Lists with margins', () => {
            const source =
                '<p style="margin:0in;font-size:12pt;font-family:Calibri, sans-serif">Test</p><p style="margin:0in;font-size:12pt;font-family:Calibri, sans-serif">Test</p><p style="margin:0in 0in 0in 0.5in;font-size:12pt;font-family:Calibri, sans-serif;text-indent:-.25in;mso-list:l0 level1 lfo1"><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>TEST</p>';
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>().set('l0:level1', {
                    'mso-level-number-format': 'bullet',
                    'mso-level-start-at': '1',
                })
            );

            runTest(
                source,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Test',
                                    format: { fontFamily: 'Calibri, sans-serif', fontSize: '12pt' },
                                },
                            ],
                            format: {
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '0in',
                            },
                            segmentFormat: { fontFamily: 'Calibri, sans-serif', fontSize: '12pt' },
                            decorator: { tagName: 'p', format: {} },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Test',
                                    format: { fontFamily: 'Calibri, sans-serif', fontSize: '12pt' },
                                },
                            ],
                            format: {
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '0in',
                            },
                            segmentFormat: { fontFamily: 'Calibri, sans-serif', fontSize: '12pt' },
                            decorator: { tagName: 'p', format: {} },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'TEST',
                                            format: {
                                                fontFamily: 'Calibri, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Calibri, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Symbol', fontSize: '12pt' },
                            },
                            format: {
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '0.5in',
                            },
                        },
                    ],
                },
                true /* removeUndefinedValues */
            );
        });

        it('adjustWordListMarginParser subtracts default list padding from MsoListParagraph margin', () => {
            // margin-left: 1in = 96px; parser subtracts 40px (default list paddingInlineStart) → 56px
            const source =
                '<p style="margin:0in 0in 0in 1in;font-size:12pt;font-family:Calibri, sans-serif;text-indent:-.25in;mso-list:l0 level1 lfo1" class="MsoListParagraph"><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>TEST</p>';
            spyOn(getStyleMetadata, 'getStyleMetadata').and.returnValue(
                new Map<string, WordMetadata>().set('l0:level1', {
                    'mso-level-number-format': 'bullet',
                    'mso-level-start-at': '1',
                })
            );

            runTest(
                source,
                {
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
                                            text: 'TEST',
                                            format: {
                                                fontFamily: 'Calibri, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Calibri, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Symbol', fontSize: '12pt' },
                            },
                            format: {
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '56px',
                            },
                        },
                    ],
                },
                true /* removeUndefinedValues */
            );
        });

        /**
         *  Test
         *  1. Test
         *  2. Test
         */
        it('Word doc created online but edited and copied from Desktop', () => {
            runTest(
                '<p class="MsoNormal"><span style="font-family:Arial,sans-serif">it went:<o:p></o:p></span></p><p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><![if !supportLists]><span style="font-family:Arial,sans-serif;mso-fareast-font-family:Arial"><span style="mso-list:Ignore">1.<span style="font:7pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span><![endif]><span style="font-family:Arial,sans-serif">Test<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><![if !supportLists]><span style="font-family:Arial,sans-serif;mso-fareast-font-family:Arial"><span style="mso-list:Ignore">2.<span style="font:7pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span><![endif]><span style="font-family:Arial,sans-serif">Test2<o:p></o:p></span></p>',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'it went:',
                                    format: { fontFamily: 'Arial, sans-serif' },
                                },
                            ],
                            format: { marginTop: '1em', marginBottom: '1em' },
                            decorator: { tagName: 'p', format: {} },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'Test',
                                            format: { fontFamily: 'Arial, sans-serif' },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: { fontFamily: 'Arial, sans-serif' },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                    format: {
                                        marginTop: '1em',
                                        marginBottom: undefined,
                                        wordList: 'l0',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Arial, sans-serif' },
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'Test2',
                                            format: { fontFamily: 'Arial, sans-serif' },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: { fontFamily: 'Arial, sans-serif' },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                    format: {
                                        marginTop: '1em',
                                        marginBottom: undefined,
                                        wordList: 'l0',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Arial, sans-serif' },
                            },
                            format: {},
                        },
                    ],
                }
            );
        });

        /**
         * I)
         * II)
         * III)
         * Text
         * zz)
         * aaa)
         *
         * a)
         * b)
         *
         * LXV)
         * LXVI)
         *
         * 15)
         * 16)
         *
         * I.
         * II,
         *
         * a.
         * b.
         *
         * 1.
         * 2.
         *
         * i.
         * ii.
         *
         * A.
         * B.
         */
        it('multiple OL lists with different bullet types', () => {
            const htmlBefore =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n<!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>JA</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>AR-SA</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n   <w:UseFELayout/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]--><!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n<!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:"MS Mincho";\r\n\tpanose-1:2 2 6 9 4 2 5 8 3 4;\r\n\tmso-font-alt:"ＭＳ 明朝";\r\n\tmso-font-charset:128;\r\n\tmso-generic-font-family:modern;\r\n\tmso-font-pitch:fixed;\r\n\tmso-font-signature:-536870145 1791491579 134217746 0 131231 0;}\r\n@font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Aptos;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:536871559 3 0 0 415 0;}\r\n@font-face\r\n\t{font-family:"\\@MS Mincho";\r\n\tpanose-1:2 2 6 9 4 2 5 8 3 4;\r\n\tmso-font-charset:128;\r\n\tmso-generic-font-family:modern;\r\n\tmso-font-pitch:fixed;\r\n\tmso-font-signature:-536870145 1791491579 134217746 0 131231 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:0in;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-font-kerning:0pt;\r\n\tmso-ligatures:none;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:116%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:252012944;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:406119180 67698707 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l0:level1\r\n\t{mso-level-number-format:roman-upper;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-.25in;}\r\n@list l0:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1\r\n\t{mso-list-id:546989783;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1271981870 -875820260 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l1:level1\r\n\t{mso-level-start-at:52;\r\n\tmso-level-number-format:alpha-lower;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2\r\n\t{mso-list-id:733356772;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:2036399302 67698709 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l2:level1\r\n\t{mso-level-number-format:alpha-upper;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l3\r\n\t{mso-list-id:801920949;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-427416434 67698715 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l3:level1\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-.25in;}\r\n@list l3:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l3:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l3:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l4\r\n\t{mso-list-id:1149177320;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1481422450 564148754 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l4:level1\r\n\t{mso-level-start-at:15;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l4:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l4:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l4:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l4:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l4:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l4:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l4:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l4:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l5\r\n\t{mso-list-id:1153643359;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:133990276 544500572 -1 -1 -1 -1 -1 -1 -1 -1;}\r\n@list l5:level1\r\n\t{mso-level-number-format:roman-upper;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-.25in;}\r\n@list l5:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l5:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l5:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l5:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l5:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l5:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l5:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l5:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l6\r\n\t{mso-list-id:1301963151;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-836976338 987768178 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l6:level1\r\n\t{mso-level-start-at:65;\r\n\tmso-level-number-format:roman-upper;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-.25in;}\r\n@list l6:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l6:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l6:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l6:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l6:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l6:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l6:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l6:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l7\r\n\t{mso-list-id:1702977219;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1073409310 67698713 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l7:level1\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l7:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l7:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l7:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l7:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l7:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l7:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l7:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l7:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l8\r\n\t{mso-list-id:1799369340;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1255171692 67698711 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l8:level1\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l8:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l8:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l8:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l8:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l8:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l8:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l8:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l8:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l9\r\n\t{mso-list-id:1934194097;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-1247008556 67698703 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l9:level1\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l9:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l9:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l9:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l9:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l9:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l9:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l9:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l9:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n<!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style="tab-interval:.5in;word-wrap:break-word">\r\n';
            runTest(
                '\n\n<p style="margin-bottom:0in;mso-add-space:auto;\ntext-indent:-.5in;mso-text-indent-alt:-.25in;mso-list:l5 level1 lfo1" class="MsoListParagraphCxSpFirst"><a name="OLE_LINK3">\x3C!--[if !supportLists]--><span style="mso-ascii-font-family:Aptos;\nmso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>I)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><u><span style="mso-ascii-font-family:Aptos;\nmso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886">123123</span></u></a></p>\n\n<p style="margin-bottom:0in;mso-add-space:\nauto;text-indent:-.5in;mso-text-indent-alt:-.25in;mso-list:l5 level1 lfo1" class="MsoListParagraphCxSpMiddle"><span style="mso-bookmark:OLE_LINK3">\x3C!--[if !supportLists]--><span style="mso-ascii-font-family:\nAptos;mso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>II)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><u><span style="mso-ascii-font-family:Aptos;\nmso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886">123123</span></u></span></p>\n\n<p style="margin-bottom:0in;mso-add-space:auto;\ntext-indent:-.5in;mso-text-indent-alt:-.25in;mso-list:l5 level1 lfo1" class="MsoListParagraphCxSpLast"><span style="mso-bookmark:OLE_LINK3">\x3C!--[if !supportLists]--><span style="mso-ascii-font-family:\nAptos;mso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;\n</span>III)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><u><span style="mso-ascii-font-family:Aptos;\nmso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886">123123</span></u></span></p>\n\n<p style="margin-bottom:0in" class="MsoNormal"><span style="mso-bookmark:OLE_LINK3"><u><span style="mso-ascii-font-family:Aptos;mso-fareast-font-family:Aptos;mso-hansi-font-family:\nAptos;mso-bidi-font-family:Aptos;color:#467886">123123123<a name="OLE_LINK2"></a></span></u></span></p>\n\n<p style="margin-bottom:0in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l1 level1 lfo2" class="MsoListParagraphCxSpFirst"><span style="mso-bookmark:OLE_LINK3"><span style="mso-bookmark:OLE_LINK2">\x3C!--[if !supportLists]--><span style="mso-ascii-font-family:\nAptos;mso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886"><span style="mso-list:Ignore">zz)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><u><span style="mso-ascii-font-family:Aptos;\nmso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886">123123</span></u></span></span></p>\n\n<p style="margin-bottom:0in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l1 level1 lfo2" class="MsoListParagraphCxSpLast"><span style="mso-bookmark:OLE_LINK3"><span style="mso-bookmark:OLE_LINK2">\x3C!--[if !supportLists]--><span style="mso-ascii-font-family:\nAptos;mso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886"><span style="mso-list:Ignore">aaa)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><u><span style="mso-ascii-font-family:Aptos;\nmso-fareast-font-family:Aptos;mso-hansi-font-family:Aptos;mso-bidi-font-family:\nAptos;color:#467886">12123</span></u></span></span></p>\n\n<span style="mso-bookmark:OLE_LINK2"></span><span style="mso-bookmark:OLE_LINK3"></span>\n\n<p style="margin-bottom:0in" class="MsoNormal"><span style="font-size:11.0pt;\nline-height:116%;mso-ascii-font-family:Aptos;mso-fareast-font-family:Aptos;\nmso-hansi-font-family:Aptos;mso-bidi-font-family:Aptos">&nbsp;</span></p>\n\n<p class="MsoNormal"><span style="mso-spacerun:yes">&nbsp;</span></p>\n\n<p style="text-indent:-.25in;mso-list:l8 level1 lfo3" class="MsoListParagraphCxSpFirst">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">a)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->123</p>\n\n<p style="text-indent:-.25in;mso-list:l8 level1 lfo3" class="MsoListParagraphCxSpMiddle">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">b)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p style="text-indent:-.5in;mso-text-indent-alt:\n-.25in;mso-list:l6 level1 lfo10" class="MsoListParagraphCxSpMiddle">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:\nAptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:\nminor-latin"><span style="mso-list:Ignore">LXV)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->123</p>\n\n<p style="text-indent:-.5in;mso-text-indent-alt:\n-.25in;mso-list:l6 level1 lfo10" class="MsoListParagraphCxSpLast">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:\nAptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:\nminor-latin"><span style="mso-list:Ignore">LXVI)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p class="MsoNormal">&nbsp;</p>\n\n<p style="text-indent:-.25in;mso-list:l4 level1 lfo9" class="MsoListParagraphCxSpFirst">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">15)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp; </span></span></span>\x3C!--[endif]-->123</p>\n\n<p style="text-indent:-.25in;mso-list:l4 level1 lfo9" class="MsoListParagraphCxSpLast">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">16)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp; </span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p class="MsoNormal">&nbsp;</p>\n\n<p style="text-indent:-.5in;mso-text-indent-alt:\n-.25in;mso-list:l0 level1 lfo4" class="MsoListParagraphCxSpFirst">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:\nAptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:\nminor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>I.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->123</p>\n\n<p style="text-indent:-.5in;mso-text-indent-alt:\n-.25in;mso-list:l0 level1 lfo4" class="MsoListParagraphCxSpLast">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:\nAptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:\nminor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>II.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p class="MsoNormal">&nbsp;</p>\n\n<p style="text-indent:-.25in;mso-list:l7 level1 lfo5" class="MsoListParagraphCxSpFirst">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">a.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->123</p>\n\n<p style="text-indent:-.25in;mso-list:l7 level1 lfo5" class="MsoListParagraphCxSpLast">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">b.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p class="MsoNormal">&nbsp;</p>\n\n<p style="text-indent:-.25in;mso-list:l9 level1 lfo6" class="MsoListParagraphCxSpFirst">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->123</p>\n\n<p style="text-indent:-.25in;mso-list:l9 level1 lfo6" class="MsoListParagraphCxSpLast">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p class="MsoNormal">&nbsp;</p>\n\n<p style="text-indent:-.5in;mso-text-indent-alt:\n-.25in;mso-list:l3 level1 lfo7" class="MsoListParagraphCxSpFirst">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:\nAptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:\nminor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>i.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->Asd</p>\n\n<p style="text-indent:-.5in;mso-text-indent-alt:\n-.25in;mso-list:l3 level1 lfo7" class="MsoListParagraphCxSpLast">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:\nAptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:\nminor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>ii.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->&nbsp;</p>\n\n<p class="MsoNormal">&nbsp;</p>\n\n<p style="text-indent:-.25in;mso-list:l2 level1 lfo8" class="MsoListParagraph">\x3C!--[if !supportLists]--><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;\nmso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">A.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->Asd</p>\n\n',
                {
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
                                            text: '123123',
                                            format: {
                                                underline: true,
                                                textColor: 'rgb(70, 120, 134)',
                                            },
                                            link: {
                                                format: {
                                                    name: 'OLE_LINK3',
                                                },
                                                dataset: {},
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l5',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":18}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginBottom: '0in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123123',
                                            format: {
                                                underline: true,
                                                textColor: 'rgb(70, 120, 134)',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l5',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":18}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginBottom: '0in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123123',
                                            format: {
                                                underline: true,
                                                textColor: 'rgb(70, 120, 134)',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l5',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":18}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginBottom: '0in',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '123123123',
                                    format: {
                                        underline: true,
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                },
                                {
                                    segmentType: 'Text',
                                    text: '',
                                    format: {
                                        underline: true,
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                    link: {
                                        format: {
                                            name: 'OLE_LINK2',
                                        },
                                        dataset: {},
                                    },
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '0in',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123123',
                                            format: {
                                                underline: true,
                                                textColor: 'rgb(70, 120, 134)',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l1',
                                        startNumberOverride: 52,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":6}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginBottom: '0in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '12123',
                                            format: {
                                                underline: true,
                                                textColor: 'rgb(70, 120, 134)',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        textColor: 'rgb(70, 120, 134)',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l1',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":6}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginBottom: '0in',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {
                                        fontSize: '11pt',
                                        lineHeight: '116%',
                                    },
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '0in',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l8',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":6}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l8',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":6}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l6',
                                        startNumberOverride: 65,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":18}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l6',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":18}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l4',
                                        startNumberOverride: 15,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":3}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l4',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":3}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":17}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":17}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l7',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":5}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l7',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":5}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l9',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l9',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'Asd',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l3',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":13}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l3',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":13}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'Asd',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
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
                },
                true,
                htmlBefore
            );
        });

        /**
         * 100.
         *      a.
         *           i.
         *                 1.
         *                       1)
         *                              i.
         *                                    i.
         *                                          ff.
         *                                                  vi.
         */
        it('9 Depth list', () => {
            const htmlBefore =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>JA</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>AR-SA</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n   <w:UseFELayout/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n\x3C!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:"MS Mincho";\r\n\tpanose-1:2 2 6 9 4 2 5 8 3 4;\r\n\tmso-font-alt:"ＭＳ 明朝";\r\n\tmso-font-charset:128;\r\n\tmso-generic-font-family:modern;\r\n\tmso-font-pitch:fixed;\r\n\tmso-font-signature:-536870145 1791491579 134217746 0 131231 0;}\r\n@font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Aptos;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:536871559 3 0 0 415 0;}\r\n@font-face\r\n\t{font-family:"\\@MS Mincho";\r\n\tpanose-1:2 2 6 9 4 2 5 8 3 4;\r\n\tmso-font-charset:128;\r\n\tmso-generic-font-family:modern;\r\n\tmso-font-pitch:fixed;\r\n\tmso-font-signature:-536870145 1791491579 134217746 0 131231 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:0in;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:"MS Mincho";\r\n\tmso-fareast-theme-font:minor-fareast;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Arial;\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-font-kerning:0pt;\r\n\tmso-ligatures:none;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:116%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:107435209;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-484679614 1165763570 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l0:level1\r\n\t{mso-level-start-at:100;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1\r\n\t{mso-list-id:395323450;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-719275888 -897965886 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l1:level1\r\n\t{mso-level-start-at:27;\r\n\tmso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2\r\n\t{mso-list-id:1073619521;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-1726740634 -29329624 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l2:level1\r\n\t{mso-level-start-at:50;\r\n\tmso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\tmargin-left:27.0pt;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l3\r\n\t{mso-list-id:1255287511;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:2021978248 -1493536908 67698713 67698715 67698703 67698705 67698715 67698715 1254649336 1341816520;}\r\n@list l3:level1\r\n\t{mso-level-start-at:501;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l3:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level5\r\n\t{mso-level-text:"%5\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l3:level7\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-.25in;}\r\n@list l3:level8\r\n\t{mso-level-start-at:500;\r\n\tmso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l3:level9\r\n\t{mso-level-start-at:6;\r\n\tmso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n\x3C!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:116%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:12.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style="tab-interval:.5in;word-wrap:break-word">\r\n';
            runTest(
                '<p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;text-indent:-.25in;mso-list:l0 level1 lfo3"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">100.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;mso-list:l1 level2 lfo4"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">a.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:1.5in;mso-add-space:auto;text-indent:-1.5in;mso-text-indent-alt:-9.0pt;mso-list:l2 level3 lfo1"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>i.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:2.0in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level4 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:2.5in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level5 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">1)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>213</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:3.0in;mso-add-space:auto;text-indent:-3.0in;mso-text-indent-alt:-9.0pt;mso-list:l3 level6 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>i.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:3.5in;mso-add-space:auto;text-indent:-3.5in;mso-text-indent-alt:-.25in;mso-list:l3 level7 lfo2"><a><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>i.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</a></p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:4.0in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level8 lfo2"><span style="mso-bookmark:OLE_LINK4"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">ffffffffffffffffffff.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>213</span></p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:4.5in;mso-add-space:auto;text-indent:-4.5in;mso-text-indent-alt:-9.0pt;mso-list:l3 level9 lfo2"><span style="mso-bookmark:OLE_LINK4"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>vi.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>213</span></p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:4.0in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level8 lfo2"><span style="mso-bookmark:OLE_LINK4"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">gggggggggggggggggggg.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>123</span></p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:3.5in;mso-add-space:auto;text-indent:-3.5in;mso-text-indent-alt:-.25in;mso-list:l3 level7 lfo2"><span style="mso-bookmark:OLE_LINK4"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>ii.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</span></p><span style="mso-bookmark:OLE_LINK4"></span><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:3.0in;mso-add-space:auto;text-indent:-3.0in;mso-text-indent-alt:-9.0pt;mso-list:l3 level6 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>ii.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:2.5in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level5 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">2)<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:2.0in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level4 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:1.5in;mso-add-space:auto;text-indent:-1.5in;mso-text-indent-alt:-9.0pt;mso-list:l3 level3 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span>ii.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 0in 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;mso-list:l3 level2 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">b.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p><p style="margin:0in 0in 8pt 0.5in;line-height:116%;font-size:12pt;font-family:Aptos, sans-serif;text-indent:-.25in;mso-list:l3 level1 lfo2"><span style="mso-fareast-font-family:Aptos;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">502.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>123</p>',
                {
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
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                        startNumberOverride: 100,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '0.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                        startNumberOverride: 1,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                        startNumberOverride: 1,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '1.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                        startNumberOverride: 1,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '2in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '213',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                        startNumberOverride: 1,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '2.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                        startNumberOverride: 1,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '3in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                        startNumberOverride: 1,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '3.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '213',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                        startNumberOverride: 500,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '4in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '213',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                        startNumberOverride: 6,
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '4.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '4in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '3.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '3in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":3}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '2.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '2in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":13}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '1.5in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l0',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":5}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '0in',
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: '123',
                                            format: {
                                                fontFamily: 'Aptos, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                    segmentFormat: {
                                        fontFamily: 'Aptos, sans-serif',
                                        fontSize: '12pt',
                                    },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        wordList: 'l3',
                                    },
                                    dataset: { editingInfo: '{"orderedStyleType":1}' },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: { fontFamily: 'Aptos, sans-serif', fontSize: '12pt' },
                            },
                            format: {
                                lineHeight: '116%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '0.5in',
                            },
                        },
                    ],
                },
                true,
                htmlBefore
            );
        });

        /**
         * mso-list: 10
         * 1. text
         *    * text
         * ....
         *
         * Text
         *
         * mso-list: l0 (Should reset back to marker 1)
         * 1. text
         */
        it('Multiple lists with the same mso-list', () => {
            const htmlBefore =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>JA</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n\x3C!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1040178053 9 0 511 0;}\r\n@font-face\r\n\t{font-family:"Yu Gothic Light";\r\n\tpanose-1:2 11 3 0 0 0 0 0 0 0;\r\n\tmso-font-alt:"游ゴシック Light";\r\n\tmso-font-charset:128;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536870145 717749759 22 0 131231 0;}\r\n@font-face\r\n\t{font-family:"Aptos Display";\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:536871559 3 0 0 415 0;}\r\n@font-face\r\n\t{font-family:Aptos;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:536871559 3 0 0 415 0;}\r\n@font-face\r\n\t{font-family:"\\@Yu Gothic Light";\r\n\tmso-font-charset:128;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536870145 717749759 22 0 131231 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\nh2\r\n\t{mso-style-noshow:yes;\r\n\tmso-style-priority:9;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-link:"Heading 2 Char";\r\n\tmso-style-next:Normal;\r\n\tmargin-top:8.0pt;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:4.0pt;\r\n\tmargin-left:0in;\r\n\tmso-pagination:widow-orphan lines-together;\r\n\tpage-break-after:avoid;\r\n\tmso-outline-level:2;\r\n\tfont-size:16.0pt;\r\n\tfont-family:"Aptos Display",sans-serif;\r\n\tmso-ascii-font-family:"Aptos Display";\r\n\tmso-ascii-theme-font:major-latin;\r\n\tmso-fareast-font-family:"Yu Gothic Light";\r\n\tmso-fareast-theme-font:major-fareast;\r\n\tmso-hansi-font-family:"Aptos Display";\r\n\tmso-hansi-theme-font:major-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:major-bidi;\r\n\tcolor:#0F4761;\r\n\tmso-themecolor:accent1;\r\n\tmso-themeshade:191;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;\r\n\tfont-weight:normal;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\nspan.Heading2Char\r\n\t{mso-style-name:"Heading 2 Char";\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:9;\r\n\tmso-style-unhide:no;\r\n\tmso-style-locked:yes;\r\n\tmso-style-link:"Heading 2";\r\n\tmso-ansi-font-size:16.0pt;\r\n\tmso-bidi-font-size:16.0pt;\r\n\tfont-family:"Aptos Display",sans-serif;\r\n\tmso-ascii-font-family:"Aptos Display";\r\n\tmso-ascii-theme-font:major-latin;\r\n\tmso-fareast-font-family:"Yu Gothic Light";\r\n\tmso-fareast-theme-font:major-fareast;\r\n\tmso-hansi-font-family:"Aptos Display";\r\n\tmso-hansi-theme-font:major-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:major-bidi;\r\n\tcolor:#0F4761;\r\n\tmso-themecolor:accent1;\r\n\tmso-themeshade:191;\r\n\tmso-ligatures:standardcontextual;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-size:11.0pt;\r\n\tmso-ansi-font-size:11.0pt;\r\n\tmso-bidi-font-size:11.0pt;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-font-kerning:0pt;\r\n\tmso-ligatures:none;\r\n\tmso-fareast-language:EN-US;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:107%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:549808783;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1093052914 -1 -1 -1 -1 -1 -1 -1 -1 -1;}\r\n@list l0:level1\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level2\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1\r\n\t{mso-list-id:1013996735;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-278866806 -1 -1 67698691 -1 -1 -1 -1 -1 -1;}\r\n@list l1:level1\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level2\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l1:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:117.0pt;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l1:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l1:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2\r\n\t{mso-list-id:1164933178;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1093052914 249174394 67698691 317858228 -2144320658 1223965924 1127282332 1569479866 -583509990 843376116;}\r\n@list l2:level1\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level2\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l2:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l2:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n\x3C!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-fareast-language:EN-US;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style="tab-interval:.5in;word-wrap:break-word">\r\n';
            runTest(
                '\r\n\r\n<h2>Text<b><o:p></o:p></b></h2>\r\n\r\n<p class=MsoListParagraphCxSpFirst style="margin-bottom:8.0pt;mso-add-space:\r\nauto;text-indent:-.25in;line-height:107%;mso-list:l2 level1 lfo1"><a\r\nname="_Hlk155259411"><![if !supportLists]><span style="mso-fareast-font-family:\r\nAptos;mso-bidi-font-family:Aptos"><span style="mso-list:Ignore">1.<span\r\nstyle="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]>text</a>.<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-bottom:8.0pt;mso-add-space:\r\nauto;text-indent:-.25in;line-height:107%;mso-list:l2 level1 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">2.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-top:0in;margin-right:0in;\r\nmargin-bottom:8.0pt;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;\r\nline-height:107%;mso-list:l2 level2 lfo1"><![if !supportLists]><span\r\nstyle="font-family:"Courier New";mso-fareast-font-family:"Courier New""><span\r\nstyle="mso-list:Ignore">o<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;\r\n</span></span></span><![endif]>text <o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-bottom:8.0pt;mso-add-space:\r\nauto;text-indent:-.25in;line-height:107%;mso-list:l2 level1 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">3.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-top:0in;margin-right:0in;\r\nmargin-bottom:8.0pt;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;\r\nline-height:107%;mso-list:l2 level2 lfo1"><![if !supportLists]><span\r\nstyle="font-family:"Courier New";mso-fareast-font-family:"Courier New""><span\r\nstyle="mso-list:Ignore">o<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-top:0in;margin-right:0in;\r\nmargin-bottom:8.0pt;margin-left:117.0pt;mso-add-space:auto;text-indent:-.25in;\r\nline-height:107%;mso-list:l1 level3 lfo2"><![if !supportLists]><span\r\nstyle="font-family:"Courier New";mso-fareast-font-family:"Courier New""><span\r\nstyle="mso-list:Ignore">o<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;\r\n</span></span></span><![endif]>text <o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-bottom:8.0pt;mso-add-space:\r\nauto;text-indent:-.25in;line-height:107%;mso-list:l2 level1 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">4.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpLast style="margin-top:0in;margin-right:0in;\r\nmargin-bottom:8.0pt;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;\r\nline-height:107%;mso-list:l2 level2 lfo1"><![if !supportLists]><span\r\nstyle="font-family:"Courier New";mso-fareast-font-family:"Courier New""><span\r\nstyle="mso-list:Ignore">o<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<o:p></o:p></p>\r\n\r\n<p class=MsoNormal><span style="font-size:16.0pt;font-family:"Aptos Display",sans-serif;\r\nmso-ascii-theme-font:major-latin;mso-fareast-font-family:"Yu Gothic Light";\r\nmso-fareast-theme-font:major-fareast;mso-hansi-theme-font:major-latin;\r\nmso-bidi-font-family:"Times New Roman";mso-bidi-theme-font:major-bidi;\r\ncolor:#0F4761;mso-themecolor:accent1;mso-themeshade:191">Text<o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal>text<o:p></o:p></p>\r\n\r\n<p class=MsoNormal>text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpFirst style="margin-bottom:8.0pt;mso-add-space:\r\nauto;text-indent:-.25in;line-height:107%;mso-list:l0 level1 lfo3"><![if !supportLists]><span\r\nstyle="font-family:"Calibri",sans-serif;mso-fareast-font-family:Calibri"><span\r\nstyle="mso-list:Ignore">1.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<span style="font-family:"Calibri",sans-serif;\r\nmso-fareast-font-family:Calibri"><o:p></o:p></span></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-top:0in;margin-right:0in;\r\nmargin-bottom:8.0pt;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;\r\nline-height:105%;mso-list:l0 level2 lfo3"><![if !supportLists]><span\r\nstyle="font-family:"Courier New";mso-fareast-font-family:"Courier New""><span\r\nstyle="mso-list:Ignore">o<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<span style="font-family:"Calibri",sans-serif;\r\nmso-fareast-font-family:Calibri"><o:p></o:p></span></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-bottom:8.0pt;mso-add-space:\r\nauto;text-indent:-.25in;line-height:105%;mso-list:l0 level1 lfo3"><![if !supportLists]><span\r\nstyle="font-family:"Calibri",sans-serif;mso-fareast-font-family:Calibri"><span\r\nstyle="mso-list:Ignore">2.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<span style="font-family:"Calibri",sans-serif;\r\nmso-fareast-font-family:Calibri"><o:p></o:p></span></p>\r\n\r\n<p class=MsoListParagraphCxSpLast style="margin-top:0in;margin-right:0in;\r\nmargin-bottom:8.0pt;margin-left:1.0in;mso-add-space:auto;text-indent:-.25in;\r\nline-height:105%;mso-list:l0 level2 lfo3"><![if !supportLists]><span\r\nstyle="font-family:"Courier New";mso-fareast-font-family:"Courier New""><span\r\nstyle="mso-list:Ignore">o<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;\r\n</span></span></span><![endif]>text<span style="mso-spacerun:yes">  </span><o:p></o:p></p>\r\n\r\n',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Text',
                                    format: {},
                                },
                            ],
                            format: {},
                            decorator: {
                                tagName: 'h2',
                                format: {
                                    fontSize: '1.5em',
                                    fontWeight: 'bold',
                                },
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                            link: {
                                                format: {
                                                    name: '_Hlk155259411',
                                                },
                                                dataset: {},
                                            },
                                        },
                                        {
                                            segmentType: 'Text',
                                            text: '.',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginBottom: '8pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginBottom: '8pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginBottom: '8pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: {},
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l1',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '117pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginBottom: '8pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l2',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l2',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Text',
                                    format: {
                                        fontSize: '16pt',
                                    },
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '107%',
                                marginBottom: '8pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '105%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '105%',
                                marginBottom: '8pt',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'text',
                                            format: {},
                                        },
                                        {
                                            segmentType: 'Text',
                                            text: ' ',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'UL',
                                    format: {
                                        marginTop: '0in',
                                        marginRight: '0in',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                    },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                lineHeight: '105%',
                                marginTop: '0in',
                                marginRight: '0in',
                                marginBottom: '8pt',
                                marginLeft: '1in',
                            },
                        },
                    ],
                },
                true,
                htmlBefore
            );
        });

        /**
         *  1. Text
         *     Dummy List Item
         *          2. List
         *             Dummy List Item
         */
        it('List with dummy list from Word Desktop', () => {
            const htmlBefore =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>JA</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n\x3C!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1040178053 9 0 511 0;}\r\n@font-face\r\n\t{font-family:Aptos;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:536871559 3 0 0 415 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-bidi-font-family:Calibri;\r\n\tmso-ligatures:standardcontextual;\r\n\tmso-fareast-language:EN-US;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-size:11.0pt;\r\n\tmso-ansi-font-size:11.0pt;\r\n\tmso-bidi-font-size:11.0pt;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Aptos;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-font-kerning:0pt;\r\n\tmso-ligatures:none;\r\n\tmso-fareast-language:EN-US;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:107%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:1929538116;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-796745460 1452455558 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\r\n@list l0:level1\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\n@list l0:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l0:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\ttext-indent:-9.0pt;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n\x3C!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Aptos",sans-serif;\r\n\tmso-ascii-font-family:Aptos;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Aptos;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-fareast-language:EN-US;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style="tab-interval:.5in;word-wrap:break-word">\r\n';
            runTest(
                '\r\n\r\n<p class=MsoListParagraphCxSpFirst style="text-indent:-.25in;mso-list:l0 level1 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">1.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List 1<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="text-indent:-.25in;mso-list:l0 level1 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">2.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List 2<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpLast>List without bullet<o:p></o:p></p>\r\n\r\n<p class=MsoNormal><o:p>&nbsp;</o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpFirst style="text-indent:-.25in;mso-list:l0 level1 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">3.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle>Text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-left:1.0in;mso-add-space:\r\nauto;text-indent:-.25in;mso-list:l0 level2 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore">a.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-left:1.0in;mso-add-space:\r\nauto">Text<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpMiddle style="margin-left:1.5in;mso-add-space:\r\nauto;text-indent:-1.5in;mso-text-indent-alt:-9.0pt;mso-list:l0 level3 lfo1"><![if !supportLists]><span\r\nstyle="mso-fareast-font-family:Aptos;mso-bidi-font-family:Aptos"><span\r\nstyle="mso-list:Ignore"><span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span>i.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]>List<o:p></o:p></p>\r\n\r\n<p class=MsoListParagraphCxSpLast style="margin-left:1.5in;mso-add-space:auto">Text<o:p></o:p></p>\r\n\r\n',
                {
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
                                            text: 'List 1',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'List 2',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'List without bullet',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'List',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Text',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'List',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":5}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginLeft: '1in',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Text',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                                marginLeft: '1in',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'List',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":1}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":5}',
                                    },
                                },
                                {
                                    listType: 'OL',
                                    format: {
                                        marginTop: '1em',
                                        paddingLeft: '0px',
                                        wordList: 'l0',
                                        startNumberOverride: 1,
                                    },
                                    dataset: {
                                        editingInfo: '{"orderedStyleType":13}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {
                                marginLeft: '1.5in',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Text',
                                    format: {},
                                },
                            ],
                            format: {
                                marginTop: '1em',
                                marginBottom: '1em',
                                marginLeft: '1.5in',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                    ],
                },
                true,
                htmlBefore
            );
        });
    });
});

function createListElementFromWord(
    tag: string,
    content: string,
    msoList: string = 'l0 level1 lfo1'
) {
    return (
        `<${tag} style="text-indent:-.25in;mso-list: ${msoList}" class="MsoListParagraph"><!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:` +
        'Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        `</span></span></span><!--[endif]-->${content}</${tag}>`
    );
}
