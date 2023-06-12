import contentModelToDom from '../../../../lib/modelToDom/contentModelToDom';
import domToContentModel from '../../../../lib/domToModel/domToContentModel';
import { Browser, moveChildNodes } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../../../lib/publicTypes';
import { createBeforePasteEventMock } from './processPastedContentFromWordDesktopTest';
import { processPastedContentWacComponents } from '../../../../lib/editor/plugins/PastePlugin/WacComponents/processPastedContentWacComponents';

let div: HTMLElement;
let fragment: DocumentFragment;

describe('processPastedContentFromWacTest', () => {
    function runTest(source?: string, expected?: string, expectedModel?: ContentModelDocument) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment);
        processPastedContentWacComponents(event);

        const model = domToContentModel(
            fragment,
            {
                isDarkMode: false,
            },
            {
                ...event.domToModelOption,
                includeRoot: true,
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

    it('Single text node', () => {
        runTest('test', 'test');
    });

    it('Empty DIV', () => {
        runTest('<div></div>', '');
    });

    it('Single DIV', () => {
        runTest('<div>test</div>', '<div>test</div>', {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test', format: {} }],
                    format: {},
                },
            ],
        });
    });

    it('Single DIV with nested elements', () => {
        runTest('<div><span>test</span></div>', '<div>test</div>', {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test', format: {} }],
                    format: {},
                },
            ],
        });
    });

    it('Single DIV with child LI', () => {
        runTest(
            '<div class="ListContainerWrapper"><ul><li>1</li><li>2</li></ul></div>',
            '<ul><li>1</li><li>2</li></ul>'
        );
    });

    it('Single DIV with deeper child LI', () => {
        runTest(
            '<div><div class="ListContainerWrapper"><ul><li>1</li></ul><ul><li>2</li></ul></div></div>',
            '<ul><li>1</li><li>2</li></ul>'
        );
    });

    it('Single DIV with text and LI', () => {
        runTest(
            '<div class="ListContainerWrapper">test<ul><li>1</li></ul></div>',
            'test<ul><li>1</li></ul>'
        );
    });

    it('Single LI', () => {
        runTest('<ul><li>1</li></ul>', '<ul><li>1</li></ul>');
    });

    it('Single LI and text', () => {
        runTest('<ul><li>1</li></ul>test', '<ul><li>1</li></ul>test');
    });

    it('Multiple LI', () => {
        runTest('<ul><li>1</li><li>2</li></ul>', '<ul><li>1</li><li>2</li></ul>');
    });
});

describe('wordOnlineHandler', () => {
    function runTest(source?: string, expected?: string, expectedModel?: ContentModelDocument) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment);
        processPastedContentWacComponents(event);

        const model = domToContentModel(
            fragment,
            {
                isDarkMode: false,
            },
            {
                ...event.domToModelOption,
                includeRoot: true,
                disableCacheElement: true,
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
    describe('HTML with fragment from Word Online', () => {
        describe('fragments only contain list items', () => {
            it('has all list items on the same level', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="2">C</li></ul></div>',
                    '<ul><li>A</li><li>B</li><ul><li style="list-style-type: circle;">C</li></ul></ul>',
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
                                                text: 'A',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'B',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'C',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
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
                    }
                );
            });

            // e.g.
            // .a
            //    .b
            //       .c
            it('List items on different level but only going on direction in terms of depth', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle1 BCX0 SCXW200751125"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>',
                    '<ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ul><li style="list-style-type: square;">C</li></ul></ul></ul>',
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
                                                text: 'A',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'B',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'C',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
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
                    }
                );
            });

            //
            // e.g.
            // .a
            //   .b
            //     .c
            //   .d
            //     .e
            it('List items on different level but have different branch in each level', () => {
                runTest(
                    '<div class="ListContainerWrapper SCXW81557186 BCX0"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul></div>',
                    '<ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ul><li style="margin: 0px 0px 0px 120px; list-style-type: square;">C</li></ul><li style="list-style-type: circle;">D</li><ul><li style="margin: 0px 0px 0px 120px; list-style-type: square;">E</li></ul></ul></ul>',
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
                                                text: 'A',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'B',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'C',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                format: {
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '120px',
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
                                                text: 'D',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'E',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                format: {
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '120px',
                                },
                            },
                        ],
                    }
                );
            });

            // List items on different level with different branch with a combination of
            // order and unordered list items
            // e.g.
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            it('List items on different level with different branch with a combination of order and unordered list items', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW221836524"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW221836524"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> D </li></ul></div>',
                    '<ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ol start="1"><li style="margin: 0px 0px 0px 120px; list-style-type: lower-roman;">C1</li><li style="margin: 0px 0px 0px 120px; list-style-type: lower-roman;">C2</li></ol><li style="list-style-type: circle;">D</li></ul></ul>',
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
                                                text: 'A',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'B',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
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
                                                text: 'C1',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'OL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                format: {
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '120px',
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
                                                text: 'C2',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'OL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                format: {
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '120px',
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
                                                text: 'D',
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
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
                                    },
                                    {
                                        listType: 'UL',
                                        paddingLeft: undefined,
                                        marginLeft: undefined,
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
                    }
                );
            });
        });

        describe('fragments contains both list and text', () => {
            // e.g.
            //text text
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            //text text
            it('only has text and list', () => {
                runTest(
                    '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div>',
                    '<p>asdfasdf</p><ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ol start="1"><li style="margin: 0px 0px 0px 120px; list-style-type: lower-roman;">C1</li><li style="margin: 0px 0px 0px 120px; list-style-type: lower-roman;">C2</li></ol><li style="list-style-type: circle;">D</li></ul></ul><p>asdfasdf</p>'
                );
            });

            // e.g.
            //text text
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            //text text
            // --------------
            //| text text    |
            // --------------
            //| .a           |
            //| .b           |
            //| .c           |
            //| .d           |
            // --------------
            it('fragments contains text, list and table that consist of list 2', () => {
                runTest(
                    '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><div class="TableContainer SCXW244795937 BCX0"><table><tbody><tr><td><div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></div></td></tr><tr><td><div><div class="ListContainerWrapper SCXW244795937 BCX0"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> A </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> B </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> C </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> D </li></ul></div></div></td></tr></tbody></table></div></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><p><span><span></span></span><span></span></p></div>',
                    '<p>asdfasdf</p><ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ol start="1"><li style="margin: 0px 0px 0px 120px; list-style-type: lower-roman;">C1</li><li style="margin: 0px 0px 0px 120px; list-style-type: lower-roman;">C2</li></ol><li style="list-style-type: circle;">D</li></ul></ul><p>asdfasdf</p><table><tbody><tr><td><p>asdfasdf</p></td></tr><tr><td><ul><li>A</li><li>B</li><li>C</li><li>D</li></ul></td></tr></tbody></table>'
                );
            });
            // e.g.
            // -------------- --------------
            //| text text    | text text    |
            // -------------- --------------
            //| .a           | .a           |
            // -------------- --------------
            it('fragments contains text, list and table that consist of list', () => {
                runTest(
                    '<div class="OutlineElement"><div class="TableContainer"><table><tbody><tr><td><div><div class="OutlineElement"><p>asdfasdf</p></div></div></td><td><div><div class="OutlineElement"><p>asdfasdf222</p></div></div></td></tr><tr><td><div><div class="ListContainerWrapper"><ul><li role="listitem" data-aria-level="1" class="OutlineElement">A</li></ul></div></div></td><td><div><div class="ListContainerWrapper"><ul><li role="listitem" data-aria-level="1" class="OutlineElement">A</li></ul></div></div></td></tr></tbody></table></div></div>',
                    '<table><tbody><tr><td><p>asdfasdf</p></td><td><p>asdfasdf222</p></td></tr><tr><td><ul><li>A</li></ul></td><td><ul><li>A</li></ul></td></tr></tbody></table>'
                );
            });
        });

        it('does not have list container', () => {
            runTest(
                '<ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul>',
                '<ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ul><li style="margin: 0px 0px 0px 120px; list-style-type: square;">C</li></ul><li style="list-style-type: circle;">D</li><ul><li style="margin: 0px 0px 0px 120px; list-style-type: square;">E</li></ul></ul></ul>'
            );
        });

        it('does not have BulletListStyle or NumberListStyle but has ListContainerWrapper', () => {
            runTest(
                '<div class="ListContainerWrapper BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>',
                '<ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ul><li style="list-style-type: square;">C</li></ul></ul></ul>'
            );
        });

        it('does not have BulletListStyle or NumberListStyle but has no ListContainerWrapper', () => {
            runTest(
                '<div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>',
                undefined,
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
                                            text: 'A',
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
                                    marginLeft: undefined,
                                    paddingLeft: undefined,
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
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
                                            text: 'B',
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
                                    marginLeft: undefined,
                                    paddingLeft: undefined,
                                },
                                {
                                    listType: 'UL',
                                    marginLeft: undefined,
                                    paddingLeft: undefined,
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
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
                                            text: 'C',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                {
                                    marginLeft: undefined,
                                    listType: 'UL',
                                    paddingLeft: undefined,
                                },
                                {
                                    marginLeft: undefined,
                                    listType: 'UL',
                                    paddingLeft: undefined,
                                },
                                {
                                    marginLeft: undefined,
                                    listType: 'UL',
                                    paddingLeft: undefined,
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
                }
            );
        });

        describe('When html is not strictly formatted as word online, but can be identified as word online only contains one type of list', () => {
            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            //     <ul><li>text</li></ul>
            // <div>
            // result:
            // .a
            // .b
            // .c
            it('should process html properly, if ListContainerWrapper contains two UL', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ul></div>',
                    '<ul><li>A</li><li>B</li><li>C</li></ul>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul></ul>
            //     <li>text</li>
            //     <li>text</li>
            //     <li>text</li>
            // <div>
            // result:
            // .test
            // .test
            // .test
            it('shuold process html properly, when list items are not in side ul tag', () => {
                runTest(
                    '<div class="ListContainerWrapper"><ul class="BulletListStyle1" role="list"></ul><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li></div>',
                    '<li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1">
            //        <li>text</li>
            //        <li>text</li>
            //        <ul>
            //            <li>text</li>
            //            <li>text</li>
            //        </ul>
            //     </ul>
            // <div>
            // result:
            //  .text
            //      .text
            //          .text
            //      .text
            //          .text
            it('should process html properly, if ListContainerWrapper contains list that is already well formatted', () => {
                runTest(
                    '<div class="ListContainerWrapper SCXW81557186 BCX0"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0">C</li></ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186">E</li></ul></ul></ul></div>',
                    '<ul><li>A</li><ul><li style="list-style-type: circle;">B</li><ul><li style="list-style-type: square;">C</li></ul><li style="list-style-type: circle;">D</li><ul><li style="list-style-type: square;">E</li></ul></ul></ul>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberedListStyle1">
            //        <li>text</li>
            //        <li>text</li>
            //     </ol>
            // <div>
            // result:
            // 1. text
            // 2. text
            // 3. text
            it('should process html properly, if there are multiple list item in ol (word online has one list item in each ol for ordered list)', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>',
                    '<ol start="1"><li>A</li><li>B</li><li>C</li></ol>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberedListStyle1"></ol>
            //     <li>text</li>
            //     <li>text</li>
            // <div>
            // result:
            // 1. text
            // 2. text
            it('shuold process html properly, if list item in a ListContainerWrapper are not inside ol ', () => {
                runTest(
                    '<div class="ListContainerWrapper"><ol class="NumberListStyle1" role="list"></ol><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li></div>',
                    '<li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li>'
                );
            });
        });

        describe('When html is not strictly formatted as word online, but can be identified as word online only contains both types of list', () => {
            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            //     <ol><li>text</li></ol>
            // <div>
            // result:
            // . text
            // 1. text
            it('should process html properly, if ListContainerWrapper contains well formated UL and non formated ol', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol></div>',
                    '<ul><li>A</li></ul><ol start="1"><li>B</li></ol>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            // <div>
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            //     <ol><li>text</li></ol>
            // <div>
            // result:
            // . text
            // 1. text
            // 2. text
            it('should process html properly, if ListContainerWrapper contains two OL', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol><ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>',
                    '<ul><li>A</li></ul><ol start="1"><li>B</li><li>C</li></ol>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            //     <ol><li>text</li></ol>
            //     <ol><li>text</li></ol>
            // <div>
            // result:
            // . text
            // . text
            // . text
            it('should process html properly, if ListContainerWrapper contains two OL and one UL', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>',
                    '<ul><li>A</li></ul><ol start="1"><li>B</li></ol><ol start="1"><li>C</li></ol>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            // <div>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // result:
            // 1. text
            // . text
            it('should process html properly, if there are list not in the ListContainerWrapper', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class=OutlineElement role="listitem" data-aria-level="1">C</li></ol></div><ul class="NumberListStyle1"><li class=OutlineElement role="listitem" data-aria-level="1">A</li></ul>',
                    '<ol start="1"><li>C</li></ol><ul><li>A</li></ul>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            // <div>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // result:
            // 1. text
            // . text
            // . text
            // . text
            it('should process html properly, if ListContainerWrapper contains two UL', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul>',
                    '<ol start="1"><li>C</li></ol><ul><li>A</li><li>A</li><li>A</li></ul>'
                );
            });

            // html
            // <div class="ListContainerWrapper">
            //     <p> paragraph </p>
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            // <div>
            it('should retain all text, if ListContainerWrapper contains Elements before li and ul', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><p>paragraph</p><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>',
                    '<p>paragraph</p><ol start="1"><li>C</li></ol>'
                );
            });

            // html
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            //     <p> paragraph </p>
            // <div>
            it('should retain all text, if ListContainerWrapper contains Elements after li and ul', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol><p>paragraph</p></div>',
                    '<ol start="1"><li>C</li></ol><p>paragraph</p>'
                );
            });
        });

        describe('Contain Word WAC Image', () => {
            it('Contain Single WAC Image', () => {
                runTest(
                    '<span style="padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; cursor: move; left: 0px; top: 2px; text-indent: 0px; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: auto; height: auto; transform: rotate(0deg);" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW139784418 BCX8"><img src="http://www.microsoft.com" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; border: none; white-space: pre !important; vertical-align: baseline; width: 264px; height: 96px;" alt="Graphical user interface, text, application Description automatically generated" class="WACImage SCXW139784418 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important; display: block; position: absolute; transform: rotate(0deg); width: 264px; height: 96px; left: 0px; top: 0px;" class="WACImageBorder SCXW139784418 BCX8"></span></span>',
                    undefined,
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Image',
                                        src: 'http://www.microsoft.com/',
                                        format: {
                                            letterSpacing: 'normal',
                                            fontFamily:
                                                '"Segoe UI", "Segoe UI Web", Arial, Verdana, sans-serif',
                                            fontSize: '12px',
                                            italic: false,
                                            fontWeight: '400',
                                            textColor: 'rgb(0, 0, 0)',
                                            backgroundColor: 'rgb(255, 255, 255)',
                                            width: '264px',
                                            height: '96px',
                                            marginTop: '0px',
                                            marginRight: '0px',
                                            marginBottom: '0px',
                                            marginLeft: '0px',
                                            paddingTop: '0px',
                                            paddingRight: '0px',
                                            paddingBottom: '0px',
                                            paddingLeft: '0px',
                                            borderTop: Browser.isFirefox ? 'medium none' : '',
                                            borderRight: Browser.isFirefox ? 'medium none' : '',
                                            borderBottom: Browser.isFirefox ? 'medium none' : '',
                                            borderLeft: Browser.isFirefox ? 'medium none' : '',
                                        },
                                        dataset: {},
                                        alt:
                                            'Graphical user interface, text, application Description automatically generated',
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                    }
                );
            });
        });
    });

    // * A
    // B
    it('List directly under fragment', () => {
        runTest(
            '<div class="ListContainerWrapper"><ul class="BulletListStyle1"><li data-listid="6" class="OutlineElement"><p class="Paragraph" paraid="1126911352"><span data-contrast="auto" class="TextRun"><span class="NormalTextRun">A</span></span></p></li></ul></div><div class="OutlineElement"><p class="Paragraph" paraid="1628213048"><span data-contrast="none" class="TextRun"><span class="NormalTextRun">B</span></span></p></div>',
            '<ul><li><p>A</p></li></ul><p>B</p>'
        );
    });

    describe('HTML with fragment from OneNote Online', () => {
        // html
        // * A
        // * B
        // * C
        //      1. D
        it('should remove the display and margin styles from the element', () => {
            runTest(
                '<ul class="BulletListStyle3 BCX0 SCXO236767657" role="list"><li class="OutlineElement"><p>A</p></li><li class="OutlineElement"><p>B</p></li><li class="OutlineElement"><p>C</p><ol class="NumberListStyle3 BCX0 SCXO236767657" role="list"><li data-aria-level="2" class="OutlineElement"><p>D</p></li></ol></li></ul>',
                '<ul><li><p>A</p></li><li><p>B</p></li><li><p>C</p></li><ol start="1"><li style="list-style-type: lower-alpha;"><p>D</p></li></ol></ul>'
            );
        });
    });

    it('remove table temp elements', () => {
        runTest(
            '<table aria-rowcount="1" data-tablelook="1184" data-tablestyle="MsoTableGrid" border="1" class="Table TableStaticStyles Ltr TableWordWrap SCXW96211671 BCX8" id="table"><tbody class="SCXW96211671 BCX8"><tr aria-rowindex="1" role="row" class="TableRow SCXW96211671 BCX8"><td data-celllook="69905" role="rowheader" class="FirstRow FirstCol LastRow AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorWhite SimilarityReviewedLightMode SimilarityUnreviewedDarkMode LowContrastShading SCXW96211671 BCX8"><div class="TableHoverRowHandle SCXW96211671 BCX8"></div><div class="TableHoverColumnHandle SCXW96211671 BCX8"></div><div class="TableCellLeftBorderHandle SCXW96211671 BCX8"></div><div class="TableCellTopBorderHandle SCXW96211671 BCX8"></div><div class="TableColumnResizeHandle SCXW96211671 BCX8"></div><div class="TableInsertRowGapBlank SCXW96211671 BCX8"></div>            <div class="TableCellContent SCXW96211671 BCX8">                <div class="OutlineElement Ltr SCXW96211671 BCX8">                    <p class="Paragraph SCXW96211671 BCX8">                        <span class="TextRun EmptyTextRun SCXW96211671 BCX8" lang="EN-US" data-contrast="auto">a</span>                    </p>                    </div>            </td><td data-celllook="69905" role="columnheader" class="FirstRow LastCol LastRow AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorWhite SimilarityReviewedLightMode SimilarityUnreviewedDarkMode LowContrastShading SCXW96211671 BCX8"><div class="TableHoverColumnHandle SCXW96211671 BCX8"></div><div class="TableCellTopBorderHandle SCXW96211671 BCX8"></div><div class="TableColumnResizeHandle SCXW96211671 BCX8"></div><div class="TableInsertRowGapBlank SCXW96211671 BCX8"></div><div class="TableCellContent SCXW96211671 BCX8"><p><span>asd</span></p></div></td></tr></tbody></table>',
            '<table id="table" data-tablelook="1184" data-tablestyle="MsoTableGrid"><tbody><tr><td data-celllook="69905"><p>a</p></td><td data-celllook="69905"><p>asd</p></td></tr></tbody></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'a',
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
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: { celllook: '69905' },
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'asd',
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
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: { celllook: '69905' },
                                    },
                                ],
                                format: {},
                                height: 0,
                            },
                        ],
                        format: { id: 'table' },
                        dataset: { tablelook: '1184', tablestyle: 'MsoTableGrid' },
                        widths: [],
                    },
                ],
            }
        );
    });

    /**
     *  1. List 1
     *  Test
     *  1. List 2
     */
    it('Text between lists', () => {
        runTest(
            '<div class="ListContainerWrapper"><ul><li>List1</li></ul></div><div><p>Text</p></div><div class="ListContainerWrapper"><ul><li>List2</li></ul></div>',
            '<ul><li>List1</li></ul><p>Text</p><ul><li>List2</li></ul>',
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
                                        text: 'List1',
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
                                marginLeft: undefined,
                                paddingLeft: undefined,
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'Text', format: {} }],
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
                                        text: 'List2',
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
                                marginLeft: undefined,
                                paddingLeft: undefined,
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
            }
        );
    });

    /**
     * Text
     * 1. List with inline block temp marker
     * 2. List with inline block temp marker
     *
     * Result
     * Test
     * 1.
     * 2.
     */
    it('Remove temp marker from Word Online', () => {
        runTest(
            '<div class="OutlineElement Ltr BCX8 SCXW152957598"><p class="Paragraph SCXW152957598 BCX8" paraid="1448465497" paraeid="{96fbc754-61d4-42f8-b9cb-d86b35e3a21c}{224}"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW152957598 BCX8">it went:&nbsp;</span><span class="EOP SCXW152957598 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}">&nbsp;</span></p></div><div class="ListContainerWrapper SCXW152957598 BCX8"><ol class="NumberListStyle1 SCXW152957598 BCX8" role="list" start="1"><li data-leveltext="%1." data-font="Arial" data-listid="10" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr BCX8 SCXW152957598"><p class="Paragraph SCXW152957598 BCX8" paraid="1079168982" paraeid="{96fbc754-61d4-42f8-b9cb-d86b35e3a21c}{230}"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW152957598 BCX8"><span class="NormalTextRun SCXW152957598 BCX8">Test</span></span></p><span class="ListMarkerWrappingSpan BCX8 SCXW152957598"><span class="ListMarker BCX8 SCXW152957598"></span></span></li></ol></div><div class="ListContainerWrapper SCXW152957598 BCX8"><ol class="NumberListStyle1 SCXW152957598 BCX8" role="list" start="2"><li data-leveltext="%1." data-font="Arial" data-listid="10" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="1" role="listitem" class="OutlineElement Ltr BCX8 SCXW152957598"><p class="Paragraph SCXW152957598 BCX8" paraid="500697608" paraeid="{96fbc754-61d4-42f8-b9cb-d86b35e3a21c}{239}"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW152957598 BCX8">Test.</span><span class="EOP SCXW152957598 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}">&nbsp;</span></p><span class="ListMarkerWrappingSpan BCX8 SCXW152957598"></span></li><li data-leveltext="%1." data-font="Arial" data-listid="10" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="1" role="listitem" class="OutlineElement Ltr BCX8 SCXW152957598"><div><span class="EOP SCXW152957598 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}"><br></span></div></li></ol></div>',
            '<p>it went:&nbsp;&nbsp;</p><ol start="1"><li><p>Test</p></li><li><p>Test.&nbsp;</p></li><li><div><br></div></li></ol>'
        );
    });
});
