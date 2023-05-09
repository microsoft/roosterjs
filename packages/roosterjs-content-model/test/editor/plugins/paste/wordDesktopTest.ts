import ContentModelBeforePasteEvent from '../../../../lib/publicTypes/event/ContentModelBeforePasteEvent';
import contentModelToDom from '../../../../lib/modelToDom/contentModelToDom';
import domToContentModel from '../../../../lib/domToModel/domToContentModel';
import { ClipboardData, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../../lib/publicTypes/group/ContentModelDocument';
import { handleWordDesktop } from '../../../../lib/editor/plugins/PastePlugin/WordDesktop/handleWordDesktopPaste';
import { moveChildNodes } from 'roosterjs-editor-dom';

describe('convertPastedContentFromWord', () => {
    let div: HTMLElement;
    let fragment: DocumentFragment;

    function runTest(source?: string, expected?: string, expectedModel?: ContentModelDocument) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment);
        handleWordDesktop(event);

        const model = domToContentModel(
            fragment,
            {
                isDarkMode: false,
            },
            {
                ...event.domToModelOption,
                includeRoot: true,
                allowCacheElement: false,
            }
        );
        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }

        contentModelToDom(
            document,
            div,
            model,
            {
                isDarkMode: false,
            },
            {}
        );

        //Assert
        if (expected) {
            expect(div.innerHTML).toBe(expected);
        }
        div.parentElement?.removeChild(div);
    }

    it('Remove Comment | mso-element:comment-list', () => {
        let source =
            '<div style="mso-element:comment-list"><div style="mso-element:comment">Test</div></div>';
        runTest(source, '', {
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Remove Comment | #_msocom_', () => {
        let source =
            '<p class="MsoNormal"><a name="_msoanchor_11" href="#_msocom_11" id="_anchor_11" class="msocomanchor">[BV11]</a></p>';
        runTest(source, '', {
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Remove Comment | mso-comment-reference', () => {
        let source =
            '<p class="MsoNormal"><a style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;mso-comment-parent:1">Test</a><a style="mso-comment-reference:BV_3;mso-comment-date:20220420T1711;mso-comment-parent:1">Test</a></p>';

        runTest(source, '<p>TestTest</p>', {
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
                            text: 'TestTest',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove Comment | mso-comment-continuation, remove style 1', () => {
        let source = '<span>Test<span style="mso-comment-continuation:3">Test</span></span>';
        runTest(source, 'TestTest', {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'TestTest',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove Comment | mso-comment-done, remove style', () => {
        let source = '<span style="mso-comment-done:yes">Test</span>';
        runTest(source, 'Test');
    });

    it('Remove Comment | mso-special-character:comment', () => {
        let source = '<span><span style="mso-special-character:comment">Test</span></span>';
        runTest(source, '');
    });

    it('Remove Line height less than default', () => {
        let source = '<p style="line-height:102%">Test</p>';
        runTest(source, '<p>Test</p>');
    });

    it(' Line height, not percentage do not remove', () => {
        let source = '<p style="line-height:1">Test</p>';
        runTest(source, undefined /* expected html */, {
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
        runTest(source, undefined, {
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

    it('Remove Line height, percentage greater than default', () => {
        let source = '<p style="line-height:122%">Test</p>';
        runTest(source, undefined, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    decorator: {
                        format: {},
                        tagName: 'p',
                    },
                    format: { marginTop: '1em', marginBottom: '1em', lineHeight: '122%' },
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

    describe('List Convertion Tests | ', () => {
        it('List with Headings', () => {
            const html =
                createListElementFromWord('p', 'test1') + createListElementFromWord('h1', 'test2');
            runTest(html, undefined /* expected html */, {
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
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
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
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginBottom: undefined,
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

        it('List with Headings in sub level 1', () => {
            const html =
                createListElementFromWord('p', 'test1') +
                createListElementFromWord('h1', 'test2', 'l0 level2 lfo1');
            runTest(html, undefined, {
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
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
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
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginBottom: undefined,
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

        it('List with Headings in sub level 2', () => {
            const html =
                createListElementFromWord('p', 'test1') +
                createListElementFromWord('h1', 'test2', 'l0 level3 lfo1');
            runTest(html, undefined, {
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
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
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
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginBottom: undefined,
                            },
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginBottom: undefined,
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

        it('List with Headings in sub level 3', () => {
            const html =
                createListElementFromWord('p', 'test1') +
                createListElementFromWord('h1', 'test2', 'l1 level3 lfo2');
            runTest(html, undefined, {
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
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
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
                                        text: 'test2',
                                        format: { fontSize: '2em', fontWeight: 'bold' },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginTop: '1em',
                                marginBottom: undefined,
                            },
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginBottom: undefined,
                            },
                            {
                                listType: 'UL',
                                startNumberOverride: undefined,
                                marginBottom: undefined,
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

        it('Complex list inside a Table cell', () => {
            const html =
                '<table id="t1" data-editing-info="{}"><td id="td1">' +
                createListElementFromWord('p', 'test1', 'l1 level4 lfo2') +
                createListElementFromWord('p', 'test2', 'l1 level3 lfo2') +
                createListElementFromWord('p', 'test2', 'l1 level2 lfo2') +
                createListElementFromWord('p', 'test2', 'l1 level5 lfo2') +
                '</td></table>';

            fragment = document.createDocumentFragment();
            div.innerHTML = html;
            moveChildNodes(fragment, div);

            runTest(undefined, undefined, {
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
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                format: {
                                                    marginTop: '1em',
                                                    marginBottom: '1em',
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
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                format: {
                                                    marginTop: '1em',
                                                    marginBottom: '1em',
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
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                format: {
                                                    marginTop: '1em',
                                                    marginBottom: '1em',
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
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                    {
                                                        listType: 'UL',
                                                        startNumberOverride: undefined,
                                                        marginTop: '1em',
                                                        marginBottom: undefined,
                                                    },
                                                ],
                                                formatHolder: {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                format: {
                                                    marginTop: '1em',
                                                    marginBottom: '1em',
                                                },
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
                        dataset: {
                            editingInfo: '{}',
                        },
                        format: {
                            id: 't1',
                        },
                        widths: [],
                    },
                ],
            });
        });
    });
});

function createBeforePasteEventMock(fragment: DocumentFragment) {
    return ({
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: fragment,
        sanitizingOption: {
            elementCallbacks: {},
            attributeCallbacks: {},
            cssStyleCallbacks: {},
            additionalTagReplacements: {},
            additionalAllowedAttributes: [],
            additionalAllowedCssClasses: [],
            additionalDefaultStyleValues: {},
            additionalGlobalStyleNodes: [],
            additionalPredefinedCssForElement: {},
            preserveHtmlComments: false,
            unknownTagReplacement: null,
        },
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        domToModelOption: {},
    } as any) as ContentModelBeforePasteEvent;
}

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
