import { ContentModelDocument } from 'roosterjs-content-model-types';
import { createBeforePasteEventMock } from './processPastedContentFromWordDesktopTest';
import { parseLink } from '../../lib/paste/utils/linkParser';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
    moveChildNodes,
} from 'roosterjs-content-model-dom';

let div: HTMLElement;
let fragment: DocumentFragment;

describe('link parser test', () => {
    function runTest(source?: string, expected?: string, expectedModel?: ContentModelDocument) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment);
        event.domToModelOption.additionalFormatParsers = {};
        event.domToModelOption.additionalFormatParsers = {
            link: [parseLink],
        };

        const model = domToContentModel(
            fragment,
            createDomToModelContext(undefined, event.domToModelOption)
        );

        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }

        contentModelToDom(
            document,
            div,
            model,
            createModelToDomContext({
                isDarkMode: false,
            })
        );

        //Assert
        if (expected) {
            expect(div.innerHTML).toBe(expected);
        }
        div.parentElement?.removeChild(div);
    }

    it('sanitize anchor', () =>
        runTest('<a href="file://text.txt">Test</a>', 'Test', {
            blockGroupType: 'Document',
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
        }));

    it('not sanitize anchor', () =>
        runTest(
            '<a href="https://microsoft.github.io/">Test</a>',
            '<a href="https://microsoft.github.io/">Test</a>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {},
                                link: {
                                    format: {
                                        underline: true,
                                        href: 'https://microsoft.github.io/',
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                ],
            }
        ));

    it('sanitize div', () =>
        runTest(
            '<div><a href="/text.txt">Test</a></div>',
            '<div><a href="/text.txt">Test</a></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {},
                                link: {
                                    format: { underline: true, href: '/text.txt' },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
            }
        ));

    it('not sanitize div', () =>
        runTest(
            '<div><a href="https://microsoft.github.io/">Test</a></div>',
            '<div><a href="https://microsoft.github.io/">Test</a></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {},
                                link: {
                                    format: {
                                        underline: true,
                                        href: 'https://microsoft.github.io/',
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
            }
        ));

    it('not sanitize onenote link', () =>
        runTest(
            '<div><a href="onenote:https://microsoft.github.io/">Test</a></div>',
            '<div><a href="onenote:https://microsoft.github.io/">Test</a></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {},
                                link: {
                                    format: {
                                        underline: true,
                                        href: 'onenote:https://microsoft.github.io/',
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
            }
        ));

    it('not sanitize mailto link', () =>
        runTest(
            '<div><a href="mailto:email@outlook.com">Test</a></div>',
            '<div><a href="mailto:email@outlook.com">Test</a></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {},
                                link: {
                                    format: {
                                        underline: true,
                                        href: 'mailto:email@outlook.com',
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
            }
        ));
});
