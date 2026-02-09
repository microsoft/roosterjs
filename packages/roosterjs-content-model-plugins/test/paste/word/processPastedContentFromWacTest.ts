import { ContentModelDocument } from 'roosterjs-content-model-types';
import { createBeforePasteEventMock } from '../createBeforePasteEventMock';
import { expectEqual } from '../e2e/testUtils';
import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';
import { pasteDisplayFormatParser } from 'roosterjs-content-model-core/lib/override/pasteDisplayFormatParser';
import { processPastedContentWacComponents } from '../../../lib/paste/WacComponents/processPastedContentWacComponents';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from 'roosterjs-content-model-core/lib/override/listMetadataApplier';

import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
    moveChildNodes,
} from 'roosterjs-content-model-dom';

let div: HTMLElement;
let fragment: DocumentFragment;

describe('processPastedContentFromWacTest', () => {
    function runTest(
        source?: string,
        expected?: string,
        expectedModel?: ContentModelDocument,
        removeUndefined?: boolean
    ) {
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
            createDomToModelContext(undefined, event.domToModelOption)
        );
        if (expectedModel) {
            if (removeUndefined) {
                expectEqual(model, expectedModel);
            } else {
                expect(model).toEqual(expectedModel);
            }
        }

        contentModelToDom(
            document,
            div,
            model,
            createModelToDomContext(
                {
                    isDarkMode: false,
                },
                {
                    metadataAppliers: {
                        listItem: listItemMetadataApplier,
                        listLevel: listLevelMetadataApplier,
                    },
                }
            )
        );

        const innerHTML = div.innerHTML;
        //Assert
        if (expected) {
            expect(innerHTML).toBe(expected);
        }
        div.parentElement?.removeChild(div);

        return [innerHTML, model];
    }

    it('Single text node', () => {
        runTest(
            'test',
            'test',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'test', format: {} }],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            true
        );
    });

    it('Empty DIV', () => {
        runTest('<div></div>', '', { blockGroupType: 'Document', blocks: [] }, true);
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
            '<ul><li>1</li><li>2</li></ul>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                segments: [{ segmentType: 'Text', text: '2', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Single DIV with deeper child LI', () => {
        runTest(
            '<div><div class="ListContainerWrapper"><ul><li>1</li></ul><ul><li>2</li></ul></div></div>',
            '<ul><li>1</li><li>2</li></ul>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                segments: [{ segmentType: 'Text', text: '2', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Single DIV with text and LI', () => {
        runTest(
            '<div class="ListContainerWrapper">test<ul><li>1</li></ul></div>',
            'test<ul><li>1</li></ul>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'test', format: {} }],
                        format: {},
                        isImplicit: true,
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Single LI', () => {
        runTest(
            '<ul><li>1</li></ul>',
            '<ul><li>1</li></ul>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Single LI and text', () => {
        runTest(
            '<ul><li>1</li></ul>test',
            '<ul><li>1</li></ul>test',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'test', format: {} }],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            true
        );
    });

    it('Multiple LI', () => {
        runTest(
            '<ul><li>1</li><li>2</li></ul>',
            '<ul><li>1</li><li>2</li></ul>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                segments: [{ segmentType: 'Text', text: '2', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
        );
    });
});

describe('wordOnlineHandler', () => {
    function runTest(
        source?: string,
        expected?: string,
        expectedModel?: ContentModelDocument,
        removeUndefined?: boolean
    ): [string, ContentModelDocument] {
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
            createDomToModelContext(
                undefined,
                {
                    formatParserOverride: {
                        display: pasteDisplayFormatParser,
                    },
                },
                event.domToModelOption
            )
        );
        if (expectedModel) {
            if (removeUndefined) {
                expectEqual(model, expectedModel);
            } else {
                expect(model).toEqual(expectedModel);
            }
        }

        contentModelToDom(
            document,
            div,
            model,
            createModelToDomContext(
                {
                    isDarkMode: false,
                },
                {
                    metadataAppliers: {
                        listItem: listItemMetadataApplier,
                        listLevel: listLevelMetadataApplier,
                    },
                }
            )
        );

        const innerHTML = div.innerHTML;
        //Assert
        if (expected) {
            expect(innerHTML).toBe(expected);
        }
        div.parentElement?.removeChild(div);

        return [innerHTML, model];
    }
    describe('HTML with fragment from Word Online', () => {
        describe('fragments only contain list items', () => {
            it('has all list items on the same level', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="2">C</li></ul></div>',
                    '<ul><li>A</li><li>B</li><ul><li>C</li></ul></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                    true
                );
            });

            // e.g.
            // .a
            //    .b
            //       .c
            it('List items on different level but only going on direction in terms of depth', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle1 BCX0 SCXW200751125"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>',
                    '<ul><li>A</li><ul><li>B</li><ul><li>C</li></ul></ul></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                    true
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
                    '<ul><li>A</li><ul><li>B</li><ul style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">C</li></ul><li>D</li><ul style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">E</li></ul></ul></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'UL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'E', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'UL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                        ],
                    },
                    true
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
                    '<div class="ListContainerWrapper BCX0 SCXW221836524"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW221836524"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol start="2"><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> D </li></ul></div>',
                    '<ul><li>A</li><ul><li>B</li><ol start="1" style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">C1</li><li style="margin-top: 0px; margin-bottom: 0px;">C2</li></ol><li>D</li></ul></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'C1', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'OL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C2', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'OL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                    true
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
                    '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol start="2"><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div>',
                    '<p>asdfasdf</p><ul><li>A</li><ul><li>B</li><ol start="1" style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">C1</li><li style="margin-top: 0px; margin-bottom: 0px;">C2</li></ol><li>D</li></ul></ul><p>asdfasdf</p>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'asdfasdf', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'C1', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'OL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C2', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'OL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                segments: [{ segmentType: 'Text', text: 'asdfasdf', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                    },
                    true
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
                    '<p>asdfasdf</p><ul><li>A</li><ul><li>B</li><ol start="1" style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">C1</li></ol><ol start="1" style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">C2</li></ol><li>D</li></ul></ul><p>asdfasdf</p><table><tbody><tr><td><p>asdfasdf</p></td></tr><tr><td><ul><li>A</li><li>B</li><li>C</li><li>D</li></ul></td></tr></tbody></table>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'asdfasdf', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'C1', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'OL',
                                        format: { marginTop: '0px', marginBottom: '0px' },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C2', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    {
                                        listType: 'OL',
                                        format: {
                                            marginTop: '0px',
                                            marginBottom: '0px',
                                            startNumberOverride: 1,
                                        },
                                        dataset: {},
                                    },
                                ],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: { marginTop: '0px', marginBottom: '0px' },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                segments: [{ segmentType: 'Text', text: 'asdfasdf', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
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
                                                                text: 'asdfasdf',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: '1em',
                                                        },
                                                        decorator: { tagName: 'p', format: {} },
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
                                    {
                                        height: 0,
                                        format: {},
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
                                                                format: {},
                                                                dataset: {},
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
                                                                format: {},
                                                                dataset: {},
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
                                                                format: {},
                                                                dataset: {},
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
                                                                format: {},
                                                                dataset: {},
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
                    },
                    true
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
                    '<table><tbody><tr><td><p>asdfasdf</p></td><td><p>asdfasdf222</p></td></tr><tr><td><ul><li>A</li></ul></td><td><ul><li>A</li></ul></td></tr></tbody></table>',
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
                                                                text: 'asdfasdf',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: '1em',
                                                        },
                                                        decorator: { tagName: 'p', format: {} },
                                                    },
                                                ],
                                                format: {},
                                                spanLeft: false,
                                                spanAbove: false,
                                                isHeader: false,
                                                dataset: {},
                                            },
                                            {
                                                blockGroupType: 'TableCell',
                                                blocks: [
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [
                                                            {
                                                                segmentType: 'Text',
                                                                text: 'asdfasdf222',
                                                                format: {},
                                                            },
                                                        ],
                                                        format: {
                                                            marginTop: '1em',
                                                            marginBottom: '1em',
                                                        },
                                                        decorator: { tagName: 'p', format: {} },
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
                                    {
                                        height: 0,
                                        format: {},
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
                                                                format: {},
                                                                dataset: {},
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
                                                format: {},
                                                spanLeft: false,
                                                spanAbove: false,
                                                isHeader: false,
                                                dataset: {},
                                            },
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
                                                                format: {},
                                                                dataset: {},
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
                    },
                    true
                );
            });
        });

        it('does not have list container', () => {
            runTest(
                '<ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul>',
                '<ul><li>A</li><ul><li>B</li><ul style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">C</li></ul><li>D</li><ul style="margin-top: 0px; margin-bottom: 0px;"><li style="margin-top: 0px; margin-bottom: 0px;">E</li></ul></ul></ul>',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                    segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
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
                                    segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
                                {
                                    listType: 'UL',
                                    format: { marginTop: '0px', marginBottom: '0px' },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: { marginTop: '0px', marginBottom: '0px' },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
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
                                    segments: [{ segmentType: 'Text', text: 'E', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
                                {
                                    listType: 'UL',
                                    format: { marginTop: '0px', marginBottom: '0px' },
                                    dataset: {},
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: { marginTop: '0px', marginBottom: '0px' },
                        },
                    ],
                },
                true
            );
        });

        it('does not have BulletListStyle or NumberListStyle but has ListContainerWrapper', () => {
            runTest(
                '<div class="ListContainerWrapper BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>',
                '<ul><li>A</li><ul><li>B</li><ul><li>C</li></ul></ul></ul>',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                    segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
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
                                    segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
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
                true
            );
        });

        it('does not have BulletListStyle or NumberListStyle but has no ListContainerWrapper', () => {
            runTest(
                '<div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>',
                '<ul><li>A</li><ul><li>B</li><ul><li>C</li></ul></ul></ul>',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                    segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
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
                                    segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                    format: {},
                                    isImplicit: true,
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'UL', format: {}, dataset: {} },
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
                true
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
                    '<ul><li>A</li><li>B</li><li>C</li></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'General',
                                element: jasmine.anything() as any,
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            { segmentType: 'Text', text: 'test', format: {} },
                                        ],
                                        format: { marginTop: '1em', marginBottom: '1em' },
                                        decorator: { tagName: 'p', format: {} },
                                    },
                                ],
                                format: {},
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'General',
                                element: jasmine.anything() as any,
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            { segmentType: 'Text', text: 'test', format: {} },
                                        ],
                                        format: { marginTop: '1em', marginBottom: '1em' },
                                        decorator: { tagName: 'p', format: {} },
                                    },
                                ],
                                format: {},
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'General',
                                element: jasmine.anything() as any,
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            { segmentType: 'Text', text: 'test', format: {} },
                                        ],
                                        format: { marginTop: '1em', marginBottom: '1em' },
                                        decorator: { tagName: 'p', format: {} },
                                    },
                                ],
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<ul><li>A</li><ul><li>B</li><ul><li>C</li></ul><li>D</li><ul><li>E</li></ul></ul></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                                        segments: [{ segmentType: 'Text', text: 'E', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
                                    { listType: 'UL', format: {}, dataset: {} },
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
                    true
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
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div></body></html>',
                    '<ol start="1"><li>A</li><li>B</li></ol><ol start="1"><li>C</li></ol>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    {
                                        listType: 'OL',
                                        format: { startNumberOverride: 1 },
                                        dataset: {},
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
                    true
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
                    '<li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'General',
                                element: jasmine.anything() as any,
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            { segmentType: 'Text', text: 'test', format: {} },
                                        ],
                                        format: { marginTop: '1em', marginBottom: '1em' },
                                        decorator: { tagName: 'p', format: {} },
                                    },
                                ],
                                format: {},
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'General',
                                element: jasmine.anything() as any,
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            { segmentType: 'Text', text: 'test', format: {} },
                                        ],
                                        format: { marginTop: '1em', marginBottom: '1em' },
                                        decorator: { tagName: 'p', format: {} },
                                    },
                                ],
                                format: {},
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'General',
                                element: jasmine.anything() as any,
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            { segmentType: 'Text', text: 'test', format: {} },
                                        ],
                                        format: { marginTop: '1em', marginBottom: '1em' },
                                        decorator: { tagName: 'p', format: {} },
                                    },
                                ],
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<ul><li>A</li></ul><ol start="1"><li>B</li></ol>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol><ol start="2"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>',
                    '<ul><li>A</li></ul><ol start="1"><li>B</li><li>C</li></ol>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<ul><li>A</li></ul><ol start="1"><li>B</li></ol><ol start="1"><li>C</li></ol>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [
                                    {
                                        listType: 'OL',
                                        format: { startNumberOverride: 1 },
                                        dataset: {},
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
                    true
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
                    '<ol start="1"><li>C</li></ol><ul><li>A</li></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<ol start="1"><li>C</li></ol><ul><li>A</li><li>A</li><li>A</li></ul>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                        segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'UL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<p>paragraph</p><ol start="1"><li>C</li></ol>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'paragraph', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                        ],
                    },
                    true
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
                    '<ol start="1"><li>C</li></ol><p>paragraph</p>',
                    {
                        blockGroupType: 'Document',
                        blocks: [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'ListItem',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                        format: {},
                                        isImplicit: true,
                                    },
                                ],
                                levels: [{ listType: 'OL', format: {}, dataset: {} }],
                                formatHolder: {
                                    segmentType: 'SelectionMarker',
                                    isSelected: false,
                                    format: {},
                                },
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'paragraph', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                    },
                    true
                );
            });
        });

        describe('Contain Word WAC Image', () => {
            itChromeOnly('Contain Single WAC Image', () => {
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
                                        src: 'http://www.microsoft.com',
                                        format: {
                                            fontFamily:
                                                '"Segoe UI", "Segoe UI Web", Arial, Verdana, sans-serif',
                                            fontSize: '12px',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            backgroundColor: 'rgb(255, 255, 255)',
                                            width: '264px',
                                            height: '96px',
                                            marginTop: '0px',
                                            marginRight: '0px',
                                            marginBottom: '0px',
                                            marginLeft: '0px',
                                            borderTop: '',
                                            borderRight: '',
                                            borderBottom: '',
                                            borderLeft: '',
                                            verticalAlign: 'top',
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
            '<ul><li><p role="presentation">A</p></li></ul><p>B</p>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                        format: { marginTop: '1em', marginBottom: '1em' },
                        decorator: { tagName: 'p', format: {} },
                    },
                ],
            },
            true
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
                '<ul><li><p role="presentation">A</p></li><li><p role="presentation">B</p></li><li><p role="presentation">C</p></li><ol start="1"><li><p role="presentation">D</p></li></ol></ul>',
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [{ segmentType: 'Text', text: 'A', format: {} }],
                                    format: { marginTop: '1em', marginBottom: '1em' },
                                    decorator: { tagName: 'p', format: {} },
                                },
                            ],
                            levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                    segments: [{ segmentType: 'Text', text: 'B', format: {} }],
                                    format: { marginTop: '1em', marginBottom: '1em' },
                                    decorator: { tagName: 'p', format: {} },
                                },
                            ],
                            levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                    segments: [{ segmentType: 'Text', text: 'C', format: {} }],
                                    format: { marginTop: '1em', marginBottom: '1em' },
                                    decorator: { tagName: 'p', format: {} },
                                },
                            ],
                            levels: [{ listType: 'UL', format: {}, dataset: {} }],
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
                                    segments: [{ segmentType: 'Text', text: 'D', format: {} }],
                                    format: { marginTop: '1em', marginBottom: '1em' },
                                    decorator: { tagName: 'p', format: {} },
                                },
                            ],
                            levels: [
                                { listType: 'UL', format: {}, dataset: {} },
                                { listType: 'OL', format: {}, dataset: {} },
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
                true
            );
        });
    });

    it('remove table temp elements', () => {
        runTest(
            '<table aria-rowcount="1" data-tablelook="1184" data-tablestyle="MsoTableGrid" class="Table TableStaticStyles Ltr TableWordWrap SCXW96211671 BCX8" id="table"><tbody class="SCXW96211671 BCX8"><tr aria-rowindex="1" role="row" class="TableRow SCXW96211671 BCX8"><td data-celllook="69905" role="rowheader" class="FirstRow FirstCol LastRow AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorWhite SimilarityReviewedLightMode SimilarityUnreviewedDarkMode LowContrastShading SCXW96211671 BCX8"><div class="TableHoverRowHandle SCXW96211671 BCX8"></div><div class="TableHoverColumnHandle SCXW96211671 BCX8"></div><div class="TableCellLeftBorderHandle SCXW96211671 BCX8"></div><div class="TableCellTopBorderHandle SCXW96211671 BCX8"></div><div class="TableColumnResizeHandle SCXW96211671 BCX8"></div><div class="TableInsertRowGapBlank SCXW96211671 BCX8"></div>            <div class="TableCellContent SCXW96211671 BCX8">                <div class="OutlineElement Ltr SCXW96211671 BCX8">                    <p class="Paragraph SCXW96211671 BCX8">                        <span class="TextRun EmptyTextRun SCXW96211671 BCX8" lang="EN-US" data-contrast="auto">a</span>                    </p>                    </div>            </td><td data-celllook="69905" role="columnheader" class="FirstRow LastCol LastRow AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorWhite SimilarityReviewedLightMode SimilarityUnreviewedDarkMode LowContrastShading SCXW96211671 BCX8"><div class="TableHoverColumnHandle SCXW96211671 BCX8"></div><div class="TableCellTopBorderHandle SCXW96211671 BCX8"></div><div class="TableColumnResizeHandle SCXW96211671 BCX8"></div><div class="TableInsertRowGapBlank SCXW96211671 BCX8"></div><div class="TableCellContent SCXW96211671 BCX8"><p><span>asd</span></p></div></td></tr></tbody></table>',
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
                                segments: [{ segmentType: 'Text', text: 'List1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
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
                                segments: [{ segmentType: 'Text', text: 'List2', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
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
            '<p>it went: &nbsp;</p><ol start="1"><li><p role="presentation">Test</p></li><li><p role="presentation">Test.&nbsp;</p></li><li><div role="presentation"><br></div></li></ol>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'it went: ', format: {} },
                            { segmentType: 'Text', text: ' ', format: {} },
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
                                segments: [{ segmentType: 'Text', text: 'Test', format: {} }],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                    { segmentType: 'Text', text: 'Test.', format: {} },
                                    { segmentType: 'Text', text: ' ', format: {} },
                                ],
                                format: { marginTop: '1em', marginBottom: '1em' },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [{ listType: 'OL', format: {}, dataset: {} }],
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
                                segments: [{ segmentType: 'Br', format: {} }],
                                format: {},
                            },
                        ],
                        levels: [{ listType: 'OL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Table Container with negative margin left', () => {
        runTest(
            '<div class="TableContainer" style="margin-left: -5px">Test</div>',
            '<div>Test</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'Test', format: {} }],
                        format: {},
                    },
                ],
            }
        );
    });

    itChromeOnly('Table with merged cells.', () => {
        const result: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'FormatContainer',
                            tagName: 'div',
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
                                                            blockType: 'BlockGroup',
                                                            blockGroupType: 'FormatContainer',
                                                            tagName: 'div',
                                                            blocks: [
                                                                {
                                                                    blockType: 'Paragraph',
                                                                    segments: [
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: 'ODSP',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '20pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight: 'bold',
                                                                                lineHeight:
                                                                                    '41.85px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '20pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '41.85px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Br',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '20pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '41.85px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: 'xFun',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '20pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight: 'bold',
                                                                                lineHeight:
                                                                                    '41.85px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '20pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '41.85px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
                                                                    },
                                                                    decorator: {
                                                                        tagName: 'p',
                                                                        format: {},
                                                                    },
                                                                },
                                                            ],
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'start',
                                                                marginTop: '0px',
                                                                marginRight: '0px',
                                                                marginBottom: '0px',
                                                                marginLeft: '0px',
                                                                paddingRight: '6px',
                                                                paddingLeft: '6px',
                                                                textIndent: '0px',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        borderTop: '1px solid',
                                                        borderBottom: '1px solid rgb(0, 0, 0)',
                                                        borderLeft: '1px solid',
                                                        backgroundColor: 'rgb(21, 96, 130)',
                                                        verticalAlign: 'middle',
                                                        width: '312px',
                                                        textIndent: '0px',
                                                    },
                                                    spanLeft: false,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '69905',
                                                    },
                                                },
                                                {
                                                    blockGroupType: 'TableCell',
                                                    blocks: [
                                                        {
                                                            blockType: 'BlockGroup',
                                                            blockGroupType: 'FormatContainer',
                                                            tagName: 'div',
                                                            blocks: [
                                                                {
                                                                    blockType: 'Paragraph',
                                                                    segments: [
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text:
                                                                                'Title of Announcement',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '21.5pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight: 'bold',
                                                                                lineHeight:
                                                                                    '44.175px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '21.5pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '44.175px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
                                                                    },
                                                                    decorator: {
                                                                        tagName: 'p',
                                                                        format: {},
                                                                    },
                                                                },
                                                            ],
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'start',
                                                                marginTop: '0px',
                                                                marginRight: '0px',
                                                                marginBottom: '0px',
                                                                marginLeft: '0px',
                                                                paddingRight: '6px',
                                                                paddingLeft: '6px',
                                                                textIndent: '0px',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        borderTop: '1px solid',
                                                        borderRight: '1px solid',
                                                        borderBottom: '1px solid rgb(0, 0, 0)',
                                                        backgroundColor: 'rgb(21, 96, 130)',
                                                        verticalAlign: 'middle',
                                                        width: '312px',
                                                        textIndent: '0px',
                                                    },
                                                    spanLeft: false,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '69905',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            height: 0,
                                            format: {},
                                            cells: [
                                                {
                                                    blockGroupType: 'TableCell',
                                                    blocks: [
                                                        {
                                                            blockType: 'BlockGroup',
                                                            blockGroupType: 'FormatContainer',
                                                            tagName: 'div',
                                                            blocks: [
                                                                {
                                                                    blockType: 'Paragraph',
                                                                    segments: [
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: 'Announcement ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'Aptos_MSFontService, Aptos_MSFontService_EmbeddedFont, Aptos_MSFontService_MSFontService, sans-serif',
                                                                                fontSize: '14pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight: 'bold',
                                                                                lineHeight:
                                                                                    '24.4125px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'Aptos_MSFontService, Aptos_MSFontService_EmbeddedFont, Aptos_MSFontService_MSFontService, sans-serif',
                                                                                fontSize: '14pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(255, 255, 255)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '24.4125px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
                                                                    },
                                                                    decorator: {
                                                                        tagName: 'p',
                                                                        format: {},
                                                                    },
                                                                },
                                                            ],
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'start',
                                                                marginTop: '0px',
                                                                marginRight: '0px',
                                                                marginBottom: '0px',
                                                                marginLeft: '0px',
                                                                paddingRight: '6px',
                                                                paddingLeft: '6px',
                                                                textIndent: '0px',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        borderTop: '1px solid rgb(0, 0, 0)',
                                                        borderRight: '1px solid',
                                                        borderBottom: '1px solid rgb(0, 0, 0)',
                                                        borderLeft: '1px solid',
                                                        backgroundColor: 'rgb(0, 0, 0)',
                                                        verticalAlign: 'middle',
                                                        width: '624px',
                                                        textIndent: '0px',
                                                    },
                                                    spanLeft: false,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '69905',
                                                    },
                                                },
                                                {
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        borderTop: '1px solid rgb(0, 0, 0)',
                                                        borderRight: '1px solid',
                                                        borderBottom: '1px solid rgb(0, 0, 0)',
                                                        borderLeft: '1px solid',
                                                        backgroundColor: 'rgb(0, 0, 0)',
                                                        verticalAlign: 'middle',
                                                        width: '624px',
                                                        textIndent: '0px',
                                                    },
                                                    spanLeft: true,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '69905',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            height: 0,
                                            format: {},
                                            cells: [
                                                {
                                                    blockGroupType: 'TableCell',
                                                    blocks: [
                                                        {
                                                            blockType: 'BlockGroup',
                                                            blockGroupType: 'FormatContainer',
                                                            tagName: 'div',
                                                            blocks: [
                                                                {
                                                                    blockType: 'Paragraph',
                                                                    segments: [
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: 'Hello ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            text:
                                                                                '[Brief description of change]',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Br',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            text:
                                                                                '[What changed and how it ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: 'benefits',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: 'devs',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ']',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            text:
                                                                                '[Any action needed by devs]',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            text:
                                                                                '[Link to Documentation ]',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Br',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight: '21px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
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
                                                                            text:
                                                                                '[What comes next if something comes next]',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Br',
                                                                            format: {
                                                                                fontFamily:
                                                                                    'WordVisiCarriageReturn_MSFontService, "Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                        {
                                                                            segmentType: 'Text',
                                                                            text: ' ',
                                                                            format: {
                                                                                fontFamily:
                                                                                    '"Segoe UI", "Segoe UI_EmbeddedFont", "Segoe UI_MSFontService", sans-serif',
                                                                                fontSize: '12pt',
                                                                                italic: false,
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                fontWeight:
                                                                                    'normal',
                                                                                lineHeight:
                                                                                    '23.7333px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                        textIndent: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        italic: false,
                                                                        fontWeight: 'normal',
                                                                        textColor: 'rgb(0, 0, 0)',
                                                                    },
                                                                    decorator: {
                                                                        tagName: 'p',
                                                                        format: {},
                                                                    },
                                                                },
                                                            ],
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'start',
                                                                marginTop: '0px',
                                                                marginRight: '0px',
                                                                marginBottom: '0px',
                                                                marginLeft: '0px',
                                                                paddingRight: '6px',
                                                                paddingLeft: '6px',
                                                                textIndent: '0px',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        borderTop: '1px solid rgb(0, 0, 0)',
                                                        borderRight: '1px solid rgb(0, 0, 0)',
                                                        borderBottom: '1px solid rgb(0, 0, 0)',
                                                        borderLeft: '1px solid rgb(0, 0, 0)',
                                                        verticalAlign: 'top',
                                                        width: '624px',
                                                        textIndent: '0px',
                                                    },
                                                    spanLeft: false,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '4369',
                                                    },
                                                },
                                                {
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        borderTop: '1px solid rgb(0, 0, 0)',
                                                        borderRight: '1px solid rgb(0, 0, 0)',
                                                        borderBottom: '1px solid rgb(0, 0, 0)',
                                                        borderLeft: '1px solid rgb(0, 0, 0)',
                                                        verticalAlign: 'top',
                                                        width: '624px',
                                                        textIndent: '0px',
                                                    },
                                                    spanLeft: true,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '4369',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    format: {
                                        direction: 'ltr',
                                        textAlign: 'start',
                                        marginTop: '0px',
                                        marginRight: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '0px',
                                        width: '0px',
                                        tableLayout: 'fixed',
                                        borderCollapse: true,
                                        textIndent: '0px',
                                    },
                                    widths: [],
                                    dataset: {
                                        tablelook: '1696',
                                        tablestyle: 'MsoTableGrid',
                                    },
                                },
                            ],
                            format: {
                                direction: 'ltr',
                                textAlign: 'start',
                                marginTop: '2px',
                                marginRight: '0px',
                                marginBottom: '2px',
                                textIndent: '0px',
                            },
                        },
                    ],
                    format: {
                        direction: 'ltr',
                        textAlign: 'start',
                        backgroundColor: 'rgb(255, 255, 255)',
                        marginTop: '0px',
                        marginRight: '0px',
                        marginBottom: '0px',
                        marginLeft: '0px',
                        textIndent: '0px',
                    },
                },
            ],
        };

        runTest(
            '<div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;" class="OutlineElement Ltr BCX8 SCXW253660117"><div style="margin: 2px 0px 2px -5px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; position: relative; display: flex; justify-content: flex-start;" class="TableContainer Ltr BCX8 SCXW253660117"><table style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; table-layout: fixed; width: 0px; overflow: visible; border-collapse: collapse; empty-cells: show; position: relative; background: transparent; border-spacing: 0px;" aria-rowcount="3" data-tablelook="1696" data-tablestyle="MsoTableGrid" border="1" class="Table Ltr TableWordWrap BCX8 SCXW253660117"><tbody style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="BCX8 SCXW253660117"><tr style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; height: 87px;" aria-rowindex="1" role="row" class="TableRow BCX8 SCXW253660117"><td style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; vertical-align: middle; overflow: visible; position: relative; background-color: rgb(21, 96, 130); width: 312px; border-width: 1px 0px 1px 1px; border-style: solid none solid solid; border-top-color: initial; border-right-color: initial; border-bottom-color: rgb(0, 0, 0); border-left-color: initial; border-image: initial;" data-celllook="69905" role="rowheader" class="TableCellBorderSelection FirstRow FirstCol LowContrastShading BCX8 AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorWhite SimilarityReviewedWhite SimilarityUnreviewedWhite SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; display: flex; overflow: visible; width: 15px; height: 10px; cursor: pointer; z-index: 5; background-color: transparent; bottom: -5.5px; left: -15.5px;" class="TableHoverRowHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 20px; height: 12px; top: -12.5px; left: auto; cursor: pointer; z-index: 4; text-align: center; display: inline-block; background-color: transparent; right: -10px;" class="TableHoverColumnHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 7px; z-index: 1; background-repeat: repeat; cursor: pointer; height: calc(100% + 1px); left: -4px; top: -0.5px;" class="TableCellLeftBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 1; background-repeat: repeat; background-color: transparent; cursor: pointer; left: -0.5px; width: calc(100% + 0.5px); top: -4px;" class="TableCellTopBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; bottom: 0px; overflow: visible; width: 7px; top: -0.5px; z-index: 3; background-repeat: repeat; height: calc(100% + 1px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/hD55E5E9C2AD2E4F5_resources/1033/ColResize.cur&quot;), pointer; right: -3.5px;" class="TableColumnResizeHandle BCX8 SCXW253660117"></div><div style="margin: -3px 0px 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 3; background-repeat: repeat; background-color: transparent; left: -0.5px; width: calc(100% + 0.5px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/h1E5273DBAA04AEF6_resources/1033/RowResize.cur&quot;), pointer; bottom: -4px;" class="TableInsertRowGapBlank BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px 6px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible;" class="TableCellContent BCX8 SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(255, 255, 255); font-size: 20pt; line-height: 41.85px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; font-weight: bold;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun BookmarkStart SCXW253660117 BCX8">ODSP</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 20pt; line-height: 41.85px; font-family: WordVisiCarriageReturn_MSFontService, &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(255, 255, 255);" class="LineBreakBlob BlobObject DragDrop SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8">&nbsp;</span><br style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(255, 255, 255); font-size: 20pt; line-height: 41.85px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; font-weight: bold;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">xFun</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 20pt; line-height: 41.85px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(255, 255, 255);" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559740&quot;:279}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div></div></td><td style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; vertical-align: middle; overflow: visible; position: relative; background-color: rgb(21, 96, 130); width: 312px; border-width: 1px 1px 1px 0px; border-style: solid solid solid none; border-top-color: initial; border-right-color: initial; border-bottom-color: rgb(0, 0, 0); border-left-color: initial; border-image: initial;" data-celllook="69905" role="columnheader" class="TableCellBorderSelection FirstRow LastCol LowContrastShading BCX8 AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorWhite SimilarityReviewedWhite SimilarityUnreviewedWhite SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 20px; height: 12px; top: -12.5px; left: auto; cursor: pointer; z-index: 4; text-align: center; display: inline-block; background-color: transparent; right: -10.5px;" class="TableHoverColumnHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 7px; z-index: 1; background-repeat: repeat; cursor: pointer; height: calc(100% + 1px); left: -3.5px; top: -0.5px;" class="TableCellLeftBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 1; background-repeat: repeat; background-color: transparent; cursor: pointer; left: 0px; width: calc(100% + 0.5px); top: -4px;" class="TableCellTopBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; bottom: 0px; overflow: visible; width: 7px; top: -0.5px; z-index: 3; background-repeat: repeat; height: calc(100% + 1px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/hD55E5E9C2AD2E4F5_resources/1033/ColResize.cur&quot;), pointer; right: -4px;" class="TableColumnResizeHandle BCX8 SCXW253660117"></div><div style="margin: -3px 0px 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 3; background-repeat: repeat; background-color: transparent; left: 0px; width: calc(100% + 0.5px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/h1E5273DBAA04AEF6_resources/1033/RowResize.cur&quot;), pointer; bottom: -4px;" class="TableInsertRowGapBlank BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px 6px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible;" class="TableCellContent BCX8 SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(255, 255, 255); font-size: 21.5pt; line-height: 44.175px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; font-weight: bold;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">Title of Announcement</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 21.5pt; line-height: 44.175px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(255, 255, 255);" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559740&quot;:279}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div></div></td></tr><tr style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; height: 27px;" aria-rowindex="2" role="row" class="TableRow BCX8 SCXW253660117"><td style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; vertical-align: middle; overflow: visible; position: relative; background-color: rgb(0, 0, 0); width: 624px; border-width: 1px; border-style: solid; border-top-color: rgb(0, 0, 0); border-right-color: initial; border-bottom-color: rgb(0, 0, 0); border-left-color: initial; border-image: initial;" colspan="2" data-celllook="69905" role="rowheader" class="TableCellBorderSelection FirstCol LastCol LowContrastShading BCX8 AdvancedProofingDarkMode ContextualSpellingDarkMode SpellingErrorDarkMode SimilarityReviewedLightMode SimilarityUnreviewedDarkMode SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; display: flex; overflow: visible; width: 15px; height: 10px; cursor: pointer; z-index: 5; background-color: transparent; bottom: -5.5px; left: -15.5px;" class="TableHoverRowHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 7px; z-index: 1; background-repeat: repeat; cursor: pointer; height: calc(100% + 1px); left: -4px; top: -0.5px;" class="TableCellLeftBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 1; background-repeat: repeat; background-color: transparent; cursor: pointer; left: -0.5px; width: calc(100% + 1px); top: -4px;" class="TableCellTopBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; bottom: 0px; overflow: visible; width: 7px; top: -0.5px; z-index: 3; background-repeat: repeat; height: calc(100% + 1px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/hD55E5E9C2AD2E4F5_resources/1033/ColResize.cur&quot;), pointer; right: -4px;" class="TableColumnResizeHandle BCX8 SCXW253660117"></div><div style="margin: -3px 0px 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 3; background-repeat: repeat; background-color: transparent; left: -0.5px; width: calc(100% + 1px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/h1E5273DBAA04AEF6_resources/1033/RowResize.cur&quot;), pointer; bottom: -4px;" class="TableInsertRowGapBlank BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px 6px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible;" class="TableCellContent BCX8 SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(255, 255, 255); font-size: 14pt; line-height: 24.4125px; font-family: Aptos_MSFontService, Aptos_MSFontService_EmbeddedFont, Aptos_MSFontService_MSFontService, sans-serif; font-weight: bold;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">Announcement&nbsp;</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 14pt; line-height: 24.4125px; font-family: Aptos_MSFontService, Aptos_MSFontService_EmbeddedFont, Aptos_MSFontService_MSFontService, sans-serif; color: rgb(255, 255, 255);" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559740&quot;:279}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div></div></td></tr><tr style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; height: 20px;" aria-rowindex="3" role="row" class="TableRow BCX8 SCXW253660117"><td style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; vertical-align: top; overflow: visible; position: relative; background-color: transparent; width: 624px; border: 1px solid rgb(0, 0, 0);" colspan="2" data-celllook="4369" role="rowheader" class="TableCellBorderSelection FirstCol LastCol LastRow BCX8 SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; display: flex; overflow: visible; width: 15px; height: 10px; cursor: pointer; z-index: 5; background-color: transparent; bottom: -5.5px; left: -15.5px;" class="TableHoverRowHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 7px; z-index: 1; background-repeat: repeat; cursor: pointer; height: calc(100% + 1px); left: -4px; top: -0.5px;" class="TableCellLeftBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 1; background-repeat: repeat; background-color: transparent; cursor: pointer; left: -0.5px; width: calc(100% + 1px); top: -4px;" class="TableCellTopBorderHandle BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; bottom: 0px; overflow: visible; width: 7px; top: -0.5px; z-index: 3; background-repeat: repeat; height: calc(100% + 1px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/hD55E5E9C2AD2E4F5_resources/1033/ColResize.cur&quot;), pointer; right: -4px;" class="TableColumnResizeHandle BCX8 SCXW253660117"></div><div style="margin: -3px 0px 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 3; background-repeat: repeat; background-color: transparent; left: -0.5px; width: calc(100% + 1px); cursor: url(&quot;https://res-1-sdf.cdn.office.net:443/officeonline/we/s/h1E5273DBAA04AEF6_resources/1033/RowResize.cur&quot;), pointer; bottom: -4px;" class="TableInsertRowGapBlank BCX8 SCXW253660117"></div><div style="margin: 0px; padding: 0px 6px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible;" class="TableCellContent BCX8 SCXW253660117"><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">Hello&nbsp;</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:356}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8"></span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:356}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">[Brief description of change]</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: WordVisiCarriageReturn_MSFontService, &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" class="LineBreakBlob BlobObject DragDrop SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8">&nbsp;</span><br style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun EmptyTextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:356}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">[What changed and how it </span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">benefits</span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8"> </span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; background-repeat: repeat-x; background-position: left bottom; background-image: var(--urlSpellingErrorV2); border-bottom: 1px solid transparent;" class="NormalTextRun SpellingErrorV2Themed SCXW253660117 BCX8">devs</span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">]</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:356}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8"></span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:291}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">[Any action needed by devs]</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:291}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8"></span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:291}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">[Link to Documentation ]</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21px; font-family: WordVisiCarriageReturn_MSFontService, &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" class="LineBreakBlob BlobObject DragDrop SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8">&nbsp;</span><br style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">&nbsp;</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:291}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div><div style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;" class="OutlineElement Ltr BCX8 SCXW253660117"><p style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;" class="Paragraph SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;" class="NormalTextRun SCXW253660117 BCX8">[What comes next if something comes next]</span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: WordVisiCarriageReturn_MSFontService, &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" class="LineBreakBlob BlobObject DragDrop SCXW253660117 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8">&nbsp;</span><br style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important;" class="SCXW253660117 BCX8"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(0, 0, 0); font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif;" class="TextRun EmptyTextRun SCXW253660117 BCX8" lang="EN-US" data-contrast="none"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 23.7333px; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI_EmbeddedFont&quot;, &quot;Segoe UI_MSFontService&quot;, sans-serif; color: rgb(0, 0, 0);" data-ccp-props="{&quot;201341983&quot;:1,&quot;335559740&quot;:356}" class="EOP SCXW253660117 BCX8">&nbsp;</span></p></div></div></td></tr></tbody></table></div></div>',
            undefined,
            result
        );
    });

    it('Comment Removal', () => {
        runTest(
            '<div><span class="CommentHighlightRest" style="background-color: rgba(209, 209, 209, 0.5)">Test</span></div>',
            '<div>Test</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'Test', format: {} }],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Comment Removal 2', () => {
        runTest(
            '<div><span class="CommentHighlightClicked" style="background-color: rgba(197, 139, 204, 0.5)">Test</span></div>',
            '<div>Test</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [{ segmentType: 'Text', text: 'Test', format: {} }],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Remove Negative Left margin from table', () => {
        runTest(
            '<div><table style="margin-left: -5px;"><tbody><tr><td>Test</td></tr><tbody></table></div>',
            '<table><tbody><tr><td>Test</td></tr></tbody></table>',
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

    itChromeOnly('Test with multiple list items', () => {
        runTest(
            '<div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="1" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1372804505" paraeid="{eda76604-e671-4d57-b201-b51196189a19}{123}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="2" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="2030008708" paraeid="{6992e937-522a-4d72-bd0e-df82a2072fe7}{172}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle2 SCXW143175918 BCX8" role="list" start="1" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: lower-alpha; overflow: visible;"><li data-leveltext="%2." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:1,&quot;335559684&quot;:-1,&quot;335559685&quot;:1440,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,4,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%2.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="2" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 72px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1014254816" paraeid="{759c6a1b-b3fc-4831-bc8d-1354c2c5db98}{21}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:1440,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle2 SCXW143175918 BCX8" role="list" start="2" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: lower-alpha; overflow: visible;"><li data-leveltext="%2." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:1,&quot;335559684&quot;:-1,&quot;335559685&quot;:1440,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,4,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%2.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="2" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 72px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1091958214" paraeid="{759c6a1b-b3fc-4831-bc8d-1354c2c5db98}{120}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:1440,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle3 SCXW143175918 BCX8" role="list" start="1" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: lower-roman; overflow: visible;"><li data-leveltext="%3." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:2,&quot;335559684&quot;:-1,&quot;335559685&quot;:2160,&quot;335559991&quot;:180,&quot;469769242&quot;:[65533,2,46],&quot;469777803&quot;:&quot;right&quot;,&quot;469777804&quot;:&quot;%3.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="3" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 132px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="839056829" paraeid="{759c6a1b-b3fc-4831-bc8d-1354c2c5db98}{215}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:2160,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:180}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle3 SCXW143175918 BCX8" role="list" start="2" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: lower-roman; overflow: visible;"><li data-leveltext="%3." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:2,&quot;335559684&quot;:-1,&quot;335559685&quot;:2160,&quot;335559991&quot;:180,&quot;469769242&quot;:[65533,2,46],&quot;469777803&quot;:&quot;right&quot;,&quot;469777804&quot;:&quot;%3.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="3" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 132px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1810158270" paraeid="{f908626c-78ed-46b1-8200-5622a1ffe344}{44}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:2160,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:180}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle2 SCXW143175918 BCX8" role="list" start="3" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: lower-alpha; overflow: visible;"><li data-leveltext="%2." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:1,&quot;335559684&quot;:-1,&quot;335559685&quot;:1440,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,4,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%2.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="3" data-aria-level="2" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 72px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="139753695" paraeid="{f908626c-78ed-46b1-8200-5622a1ffe344}{124}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:1440,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle2 SCXW143175918 BCX8" role="list" start="4" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: lower-alpha; overflow: visible;"><li data-leveltext="%2." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:1,&quot;335559684&quot;:-1,&quot;335559685&quot;:1440,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,4,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%2.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="4" data-aria-level="2" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 72px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="407695755" paraeid="{f908626c-78ed-46b1-8200-5622a1ffe344}{209}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:1440,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="3" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="3" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="620995694" paraeid="{9878f376-5df8-4e62-ba39-9c6a1817f7b5}{34}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="4" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="3" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="4" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="406328277" paraeid="{9878f376-5df8-4e62-ba39-9c6a1817f7b5}{119}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="502077388" paraeid="{2147c5de-cb36-425c-ad05-d9081387dfe2}{97}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"></span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="338729307" paraeid="{6992e937-522a-4d72-bd0e-df82a2072fe7}{209}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"></span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1060692795" paraeid="{9878f376-5df8-4e62-ba39-9c6a1817f7b5}{212}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:0,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1868174151" paraeid="{5ff1bd63-a438-4abf-b8f6-ee8fc30ba819}{1}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"></span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="1" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="4" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="963440506" paraeid="{b77ffaa8-6f5e-4079-83c2-373c935ff7d8}{1}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="955920880" paraeid="{b77ffaa8-6f5e-4079-83c2-373c935ff7d8}{129}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:0,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="2" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="4" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1825308776" paraeid="{b77ffaa8-6f5e-4079-83c2-373c935ff7d8}{173}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="326656423" paraeid="{5ff1bd63-a438-4abf-b8f6-ee8fc30ba819}{107}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"></span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="99360513" paraeid="{6b98cfd7-eaec-4e75-8b54-ad1b76c09801}{11}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:0,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="96460220" paraeid="{5ff1bd63-a438-4abf-b8f6-ee8fc30ba819}{157}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"></span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="1" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="5" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="927907704" paraeid="{6b98cfd7-eaec-4e75-8b54-ad1b76c09801}{55}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="2" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="5" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1760568901" paraeid="{6b98cfd7-eaec-4e75-8b54-ad1b76c09801}{169}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="660136120" paraeid="{0bd5b816-7be0-4589-b756-3f1f2a595131}{30}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"></span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="934524283" paraeid="{33f05aa7-528d-4f60-a926-5a5ab49bb8f6}{7}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 10.6667px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:0,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="1" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="6" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1629030307" paraeid="{33f05aa7-528d-4f60-a926-5a5ab49bb8f6}{51}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW143175918 BCX8" role="list" start="2" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; cursor: text; list-style-type: decimal; overflow: visible;"><li data-leveltext="%1." data-font="" data-listid="6" data-list-defn-props="{&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="2" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW143175918 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1045937546" paraeid="{33f05aa7-528d-4f60-a926-5a5ab49bb8f6}{165}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW143175918 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">_</span></span><span class="EOP SCXW143175918 BCX8" data-ccp-props="{&quot;134233117&quot;:false,&quot;134233118&quot;:false,&quot;201341983&quot;:0,&quot;335551550&quot;:1,&quot;335551620&quot;:1,&quot;335559685&quot;:720,&quot;335559737&quot;:0,&quot;335559738&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279,&quot;335559991&quot;:360}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 22.0875px; font-family: Aptos, Aptos_MSFontService, sans-serif;"> </span></p></li></ol></div>',
            '<ol start="1" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><ol start="1" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><ol start="1" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">&nbsp;</span></p></div><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">&nbsp;</span></p></div><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">_&nbsp;</span></p></div><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">&nbsp;</span></p></div><ol start="1" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">_&nbsp;</span></p></div><ol start="2" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">&nbsp;</span></p></div><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">_&nbsp;</span></p></div><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">&nbsp;</span></p></div><ol start="1" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">&nbsp;</span></p></div><div style="background-color: rgb(255, 255, 255); margin: 0px;"><p style="direction: ltr; text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px 0px 10.6667px; color: rgb(0, 0, 0);"><span style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; line-height: 22.0875px;">_&nbsp;</span></p></div><ol start="1" style="direction: ltr; margin-top: 0px; margin-bottom: 0px;"><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li><li style="font-family: Aptos, Aptos_MSFontService, sans-serif; font-size: 12pt; direction: ltr; margin-top: 0px; margin-bottom: 0px;"><p role="presentation" style="text-align: left; text-indent: 0px; white-space: pre-wrap; margin: 0px; color: rgb(0, 0, 0);"><span style="line-height: 22.0875px;">_&nbsp;</span></p></li></ol>',
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    startNumberOverride: 1,
                                },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    startNumberOverride: 1,
                                },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            textColor: 'rgb(0, 0, 0)',
                                            fontWeight: 'normal',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    direction: 'ltr',
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '10.6667px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        format: {
                            direction: 'ltr',
                            textAlign: 'start',
                            textIndent: '0px',
                            backgroundColor: 'rgb(255, 255, 255)',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    startNumberOverride: 1,
                                },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
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
                                        text: '_',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                    {
                                        segmentType: 'Text',
                                        text: ' ',
                                        format: {
                                            fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                            fontSize: '12pt',
                                            italic: false,
                                            fontWeight: 'normal',
                                            textColor: 'rgb(0, 0, 0)',
                                            lineHeight: '22.0875px',
                                        },
                                    },
                                ],
                                format: {
                                    textAlign: 'start',
                                    textIndent: '0px',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                                segmentFormat: {
                                    italic: false,
                                    fontWeight: 'normal',
                                    textColor: 'rgb(0, 0, 0)',
                                },
                                decorator: { tagName: 'p', format: {} },
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Aptos, Aptos_MSFontService, sans-serif',
                                fontSize: '12pt',
                            },
                        },
                        format: { direction: 'ltr', marginTop: '0px', marginBottom: '0px' },
                    },
                ],
            },
            true
        );
    });

    it('Should skip elements with both Selected and EOP classes', () => {
        runTest(
            '<div>Hello<span class="Selected EOP"></span>World</div>',
            '<div>HelloWorld</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'Hello', format: {} },
                            { segmentType: 'Text', text: 'World', format: {} },
                        ],
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Should not skip elements with only Selected class', () => {
        runTest(
            '<div>Hello<span class="Selected">!</span>World</div>',
            '<div>Hello!World</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'Hello', format: {} },
                            { segmentType: 'Text', text: '!', format: {} },
                            { segmentType: 'Text', text: 'World', format: {} },
                        ],
                        format: {},
                    },
                ],
            },
            true
        );
    });

    it('Should not skip elements with only EOP class', () => {
        runTest(
            '<div>Hello<span class="EOP">!</span>World</div>',
            '<div>Hello!World</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'Hello', format: {} },
                            { segmentType: 'Text', text: '!', format: {} },
                            { segmentType: 'Text', text: 'World', format: {} },
                        ],
                        format: {},
                    },
                ],
            },
            true
        );
    });
});
