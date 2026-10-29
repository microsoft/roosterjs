import { MarkdownPastePlugin } from '../../lib/plugins/MarkdownPastePlugin';
import type { MarkdownToModelOptions } from '../../lib/markdownToModel/types/MarkdownToModelOptions';
import {
    ChangeSource,
    contentModelToDom,
    createModelToDomContext,
} from 'roosterjs-content-model-dom';
import type {
    BeforePasteEvent,
    ClipboardData,
    ContentChangedEvent,
    ContentModelDocument,
    DOMCreator,
    FormatContentModelOptions,
    IEditor,
    PasteType,
    PluginEvent,
} from 'roosterjs-content-model-types';

describe('MarkdownPastePlugin', () => {
    let doc: Document;
    let trustedHTMLHandler: DOMCreator;
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;

    beforeEach(() => {
        doc = document.implementation.createHTMLDocument('test');
        trustedHTMLHandler = {
            htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        };
        formatContentModelSpy = jasmine.createSpy('formatContentModel');
        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
        editor = ({
            getDocument: () => doc,
            getDOMCreator: () => trustedHTMLHandler,
            formatContentModel: formatContentModelSpy,
            takeSnapshot: takeSnapshotSpy,
        } as unknown) as IEditor;
    });

    function createPlugin(
        autoConversion?: boolean,
        undoConversion?: boolean,
        markdownToModelOptions?: MarkdownToModelOptions
    ): MarkdownPastePlugin {
        const plugin =
            autoConversion === undefined && undoConversion === undefined
                ? new MarkdownPastePlugin()
                : new MarkdownPastePlugin({
                      autoConversion: !!autoConversion,
                      undoConversion: !!undoConversion,
                      markdownToModelOptions,
                  });
        plugin.initialize(editor);
        return plugin;
    }

    function createEvent(
        clipboardData: Partial<ClipboardData>,
        pasteType: PasteType
    ): BeforePasteEvent {
        const fragment = doc.createDocumentFragment();
        const placeholder = doc.createElement('span');
        placeholder.textContent = clipboardData.text || '';
        fragment.appendChild(placeholder);

        return ({
            eventType: 'beforePaste',
            clipboardData: clipboardData as ClipboardData,
            fragment,
            pasteType,
        } as unknown) as BeforePasteEvent;
    }

    function createEmptyModel(): ContentModelDocument {
        return {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        };
    }

    function createContentChangedPasteEvent(
        clipboardData: Partial<ClipboardData>
    ): ContentChangedEvent {
        return ({
            eventType: 'contentChanged',
            source: ChangeSource.Paste,
            data: clipboardData as ClipboardData,
        } as unknown) as ContentChangedEvent;
    }

    it('has the expected name', () => {
        const plugin = createPlugin();
        expect(plugin.getName()).toBe('MarkdownPaste');
        plugin.dispose();
    });

    it('ignores non-beforePaste events', () => {
        const plugin = createPlugin();
        const event = ({ eventType: 'contentChanged' } as unknown) as PluginEvent;

        expect(() => plugin.onPluginEvent(event)).not.toThrow();
        plugin.dispose();
    });

    it('converts the fragment to markdown when pasteType is asMarkdown', () => {
        const plugin = createPlugin();
        const event = createEvent({ text: '# Heading', rawHtml: '' }, 'asMarkdown');

        plugin.onPluginEvent(event);

        expect(event.fragment.querySelector('h1')).not.toBeNull();
        plugin.dispose();
    });

    [false, true].forEach(autoConversion => {
        describe(autoConversion ? 'automatic conversion options' : 'asMarkdown options', () => {
            function convertWithOptions(
                options?: MarkdownToModelOptions,
                text = '# First\n\n\nSecond'
            ): DocumentFragment {
                const plugin = createPlugin(autoConversion, false /*undoConversion*/, options);
                let fragment: DocumentFragment;

                if (autoConversion) {
                    plugin.onPluginEvent(
                        createContentChangedPasteEvent({
                            text,
                            rawHtml: '',
                            customValues: {},
                            pasteNativeEvent: true,
                            modelBeforePaste: createEmptyModel(),
                        })
                    );

                    expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
                    const [callback] = formatContentModelSpy.calls.mostRecent().args as [
                        (model: ContentModelDocument) => boolean
                    ];
                    const target = createEmptyModel();
                    expect(callback(target)).toBe(true);
                    fragment = doc.createDocumentFragment();
                    contentModelToDom(doc, fragment, target, createModelToDomContext());
                } else {
                    const event = createEvent({ text, rawHtml: '' }, 'asMarkdown');
                    plugin.onPluginEvent(event);
                    fragment = event.fragment;
                }

                plugin.dispose();
                return fragment;
            }

            it('merges empty lines when conversion options are omitted', () => {
                const fragment = convertWithOptions();

                expect(fragment.querySelectorAll('h1').length).toBe(1);
                expect(fragment.querySelectorAll('div').length).toBe(2);
            });

            it('merges empty lines when only direction is specified', () => {
                const fragment = convertWithOptions({ direction: 'rtl' });

                expect(fragment.querySelectorAll('div').length).toBe(2);
                expect(fragment.querySelector<HTMLElement>('h1')?.style.direction).toBe('rtl');
            });

            it('merges empty lines when emptyLine is explicitly undefined', () => {
                const fragment = convertWithOptions({ direction: 'rtl', emptyLine: undefined });

                expect(fragment.querySelectorAll('div').length).toBe(2);
                expect(fragment.querySelector<HTMLElement>('h1')?.style.direction).toBe('rtl');
            });

            ['remove', 'preserve'].forEach((emptyLine: 'remove' | 'preserve') => {
                it(`applies ${emptyLine} empty lines and right-to-left direction`, () => {
                    const fragment = convertWithOptions({
                        emptyLine,
                        direction: 'rtl',
                    });

                    expect(fragment.querySelectorAll('div').length).toBe(
                        emptyLine === 'preserve' ? 3 : 1
                    );
                    expect(fragment.querySelector<HTMLElement>('h1')?.style.direction).toBe('rtl');
                });
            });

            it('applies plain table styles by default', () => {
                const fragment = convertWithOptions({}, '|Header|\n|---|\n|Body|');
                const cells = fragment.querySelectorAll<HTMLElement>('td');

                expect(fragment.querySelector('th')).toBeNull();
                expect(cells.length).toBe(2);
                cells.forEach(cell => {
                    expect(cell.style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                    expect(cell.style.backgroundColor).toBe('');
                    expect(cell.style.fontWeight).toBe('');
                });
            });

            it('applies custom table styles', () => {
                const fragment = convertWithOptions(
                    {
                        emptyLine: 'remove',
                        direction: 'rtl',
                        markdownTableStyle: {
                            hasHeaderRow: false,
                            topBorderColor: '#ff0000',
                            bottomBorderColor: '#00ff00',
                            verticalBorderColor: '#0000ff',
                        },
                    },
                    '|Header|\n|---|\n|Body|'
                );

                expect(fragment.querySelector('table')?.style.direction).toBe('rtl');
                expect(fragment.querySelector('th')).toBeNull();
                const cell = fragment.querySelector('td');
                expect(cell).not.toBeNull();
                expect(cell?.style.borderTop).toBe('1px solid rgb(255, 0, 0)');
                expect(cell?.style.borderBottom).toBe('1px solid rgb(0, 255, 0)');
                expect(cell?.style.borderLeft).toBe('1px solid rgb(0, 0, 255)');
            });
        });
    });

    it('does not convert non-markdown content even when pasteType is asMarkdown', () => {
        const plugin = createPlugin();
        const event = createEvent({ text: 'just plain text', rawHtml: '' }, 'asMarkdown');

        plugin.onPluginEvent(event);

        expect(event.fragment.querySelector('h1')).toBeNull();
        expect(event.fragment.textContent).toBe('just plain text');
        plugin.dispose();
    });

    it('does not convert markdown on normal paste when autoConversion is false (default)', () => {
        const plugin = createPlugin();
        const event = createEvent({ text: '# Heading', rawHtml: '' }, 'normal');

        plugin.onPluginEvent(event);

        expect(event.fragment.querySelector('h1')).toBeNull();
        plugin.dispose();
    });

    it('does not run the beforePaste conversion when the paste came from a native event', () => {
        const plugin = createPlugin();
        const event = createEvent(
            { text: '# Heading', rawHtml: '', pasteNativeEvent: true },
            'asMarkdown'
        );

        plugin.onPluginEvent(event);

        expect(event.fragment.querySelector('h1')).toBeNull();
        plugin.dispose();
    });

    it('converts markdown on contentChanged Paste when autoConversion is true', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        const modelBeforePaste = createEmptyModel();
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
            modelBeforePaste,
        });

        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        const [callback, options] = formatContentModelSpy.calls.mostRecent().args as [
            (model: ContentModelDocument) => boolean,
            FormatContentModelOptions
        ];
        expect(options).toEqual({
            apiName: 'MarkdownConversion',
            changeSource: ChangeSource.AutoMarkdownConversion,
            scrollCaretIntoView: true,
        });

        const target = createEmptyModel();
        expect(callback(target)).toBe(true);
        const paragraph = target.blocks[0];
        expect(paragraph.blockType).toBe('Paragraph');
        if (paragraph.blockType === 'Paragraph') {
            expect(paragraph.decorator?.tagName).toBe('h1');
            expect(paragraph.segments[0]).toEqual({
                segmentType: 'Text',
                text: 'Heading',
                format: { fontWeight: 'bold', fontSize: '2em' },
            });
        }
        plugin.dispose();
    });

    ['2em', '1.5em', '1.17em', '1em', '0.83em', '0.67em'].forEach((fontSize, index) => {
        const level = index + 1;
        it(`preserves the h${level} tag and font size while inheriting other target formatting`, () => {
            const plugin = createPlugin(true /*autoConversion*/);
            const modelBeforePaste = createEmptyModel();
            const paragraph = modelBeforePaste.blocks[0];

            modelBeforePaste.format = {
                fontFamily: 'Arial',
            };
            if (paragraph.blockType === 'Paragraph') {
                paragraph.segments[0].format = {
                    fontSize: '20px',
                    textColor: 'red',
                    fontWeight: 'normal',
                    strikethrough: true,
                };
            }

            const event = createContentChangedPasteEvent({
                text: `${'#'.repeat(level)} Heading`,
                rawHtml: '',
                customValues: {},
                pasteNativeEvent: true,
                modelBeforePaste,
            });

            plugin.onPluginEvent(event);

            const [callback] = formatContentModelSpy.calls.mostRecent().args as [
                (model: ContentModelDocument) => boolean,
                FormatContentModelOptions
            ];
            const target = createEmptyModel();
            expect(callback(target)).toBe(true);

            const heading = target.blocks[0];
            expect(heading?.blockType).toBe('Paragraph');
            if (heading?.blockType === 'Paragraph') {
                expect(heading.decorator).toEqual({
                    tagName: `h${level}`,
                    format: {
                        fontSize,
                        fontWeight: 'bold',
                    },
                });
                expect(heading.segments[0]).toEqual({
                    segmentType: 'Text',
                    text: 'Heading',
                    format: {
                        fontFamily: 'Arial',
                        fontSize,
                        fontWeight: 'bold',
                        textColor: 'red',
                        strikethrough: true,
                    },
                });
            }

            const fragment = doc.createDocumentFragment();
            contentModelToDom(doc, fragment, target, createModelToDomContext());
            const headingElement = fragment.querySelector<HTMLElement>(`h${level}`);
            expect(headingElement).not.toBeNull();
            expect(headingElement?.textContent).toBe('Heading');
            expect(
                Array.from(headingElement?.querySelectorAll<HTMLElement>('[style]') || []).some(
                    element => !!element.style.fontSize
                )
            ).toBe(false);
            const host = document.createElement('div');
            host.style.fontSize = '20px';
            host.appendChild(fragment);
            document.body.appendChild(host);
            try {
                if (headingElement) {
                    expect(
                        parseFloat(window.getComputedStyle(headingElement).fontSize)
                    ).toBeCloseTo(parseFloat(fontSize) * 20, 2);
                }
            } finally {
                host.remove();
            }

            plugin.dispose();
        });
    });

    ['decorator', 'segmentFormat'].forEach(colorSource => {
        it(`inherits heading text color from the target paragraph ${colorSource}`, () => {
            const plugin = createPlugin(true /*autoConversion*/);
            const modelBeforePaste = createEmptyModel();
            const paragraph = modelBeforePaste.blocks[0];
            modelBeforePaste.format = { textColor: 'black' };

            if (paragraph.blockType === 'Paragraph') {
                if (colorSource === 'decorator') {
                    paragraph.decorator = {
                        tagName: 'h3',
                        format: { textColor: 'red', fontSize: '1.17em', fontWeight: 'bold' },
                    };
                } else {
                    paragraph.segmentFormat = { textColor: 'red' };
                }
            }

            plugin.onPluginEvent(
                createContentChangedPasteEvent({
                    text: '# First\n## Second',
                    rawHtml: '',
                    customValues: {},
                    pasteNativeEvent: true,
                    modelBeforePaste,
                })
            );

            const [callback] = formatContentModelSpy.calls.mostRecent().args as [
                (model: ContentModelDocument) => boolean
            ];
            const target = createEmptyModel();
            expect(callback(target)).toBe(true);
            const headings = target.blocks.filter(block => block.blockType === 'Paragraph');
            expect(headings.length).toBe(2);
            headings.forEach(heading => {
                if (heading.blockType === 'Paragraph') {
                    expect(heading.segments[0].format.textColor).toBe('red');
                }
            });

            const host = document.createElement('div');
            contentModelToDom(document, host, target, createModelToDomContext());
            document.body.appendChild(host);
            try {
                ['h1', 'h2'].forEach(tagName => {
                    const heading = host.querySelector(tagName);
                    expect(heading).not.toBeNull();
                    const textParent = heading?.querySelector('span') || heading;
                    if (textParent) {
                        expect(window.getComputedStyle(textParent).color).toBe('rgb(255, 0, 0)');
                    }
                });
            } finally {
                host.remove();
            }

            plugin.dispose();
        });
    });

    [false, true].forEach(strikethrough => {
        it(`preserves markdown emphasis while inheriting target strikethrough=${strikethrough}`, () => {
            const plugin = createPlugin(true /*autoConversion*/);
            const modelBeforePaste = createEmptyModel();
            const paragraph = modelBeforePaste.blocks[0];
            const targetFormat = {
                fontFamily: 'Arial',
                fontSize: '20px',
                textColor: 'red',
                fontWeight: 'normal',
                italic: false,
                strikethrough,
            };

            if (paragraph.blockType === 'Paragraph') {
                paragraph.segments[0].format = { ...targetFormat };
            }

            plugin.onPluginEvent(
                createContentChangedPasteEvent({
                    text: 'plain **bold** *italic* ~~strike~~',
                    rawHtml: '',
                    customValues: {},
                    pasteNativeEvent: true,
                    modelBeforePaste,
                })
            );

            expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
            const [callback] = formatContentModelSpy.calls.mostRecent().args as [
                (model: ContentModelDocument) => boolean
            ];
            const target = createEmptyModel();
            expect(callback(target)).toBe(true);
            const result = target.blocks[0];

            expect(result.blockType).toBe('Paragraph');
            if (result.blockType === 'Paragraph') {
                expect(
                    result.segments
                        .filter(segment => segment.segmentType === 'Text')
                        .map(segment => segment.format)
                ).toEqual([
                    targetFormat,
                    { ...targetFormat, fontWeight: 'bold' },
                    targetFormat,
                    { ...targetFormat, italic: true },
                    targetFormat,
                    { ...targetFormat, strikethrough: true },
                ]);
            }
            if (paragraph.blockType === 'Paragraph') {
                expect(paragraph.segments[0].format).toEqual(targetFormat);
            }
            plugin.dispose();
        });
    });

    it('merges converted markdown into a modelBeforePaste that already has content', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        const modelBeforePaste: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'existing ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        };
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
            modelBeforePaste,
        });

        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);

        const [callback] = formatContentModelSpy.calls.mostRecent().args as [
            (model: ContentModelDocument) => boolean,
            FormatContentModelOptions
        ];
        const target = createEmptyModel();
        expect(callback(target)).toBe(true);

        const paragraph = target.blocks[0];
        expect(paragraph.blockType).toBe('Paragraph');
        if (paragraph.blockType === 'Paragraph') {
            expect(paragraph.decorator?.tagName).toBe('h1');
            expect(paragraph.segments.filter(segment => segment.segmentType === 'Text')).toEqual([
                {
                    segmentType: 'Text',
                    text: 'existing ',
                    format: {},
                    isSelected: undefined,
                },
                {
                    segmentType: 'Text',
                    text: 'Heading',
                    format: { fontWeight: 'bold', fontSize: '2em' },
                },
            ]);
        }

        plugin.dispose();
    });

    it('does not convert on contentChanged Paste when pasteNativeEvent is missing', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            modelBeforePaste: createEmptyModel(),
        });

        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).not.toHaveBeenCalled();
        plugin.dispose();
    });

    it('does not convert on contentChanged Paste when modelBeforePaste is missing', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
        });

        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).not.toHaveBeenCalled();
        plugin.dispose();
    });

    it('does not convert non-markdown content on contentChanged Paste when autoConversion is true', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        const event = createContentChangedPasteEvent({
            text: 'just plain text',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
            modelBeforePaste: createEmptyModel(),
        });

        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).not.toHaveBeenCalled();
        plugin.dispose();
    });

    it('does not convert on contentChanged Paste when autoConversion is false', () => {
        const plugin = createPlugin(false /*autoConversion*/);
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
            modelBeforePaste: createEmptyModel(),
        });

        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).not.toHaveBeenCalled();
        plugin.dispose();
    });

    it('takes an undo snapshot when undoConversion is true', () => {
        const plugin = createPlugin(true /*autoConversion*/, true /*undoConversion*/);
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
            modelBeforePaste: createEmptyModel(),
        });

        plugin.onPluginEvent(event);

        expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        plugin.dispose();
    });

    it('does not take an undo snapshot when undoConversion is false', () => {
        const plugin = createPlugin(true /*autoConversion*/, false /*undoConversion*/);
        const event = createContentChangedPasteEvent({
            text: '# Heading',
            rawHtml: '',
            customValues: {},
            pasteNativeEvent: true,
            modelBeforePaste: createEmptyModel(),
        });

        plugin.onPluginEvent(event);

        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        plugin.dispose();
    });

    it('does nothing after dispose', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        plugin.dispose();
        const event = createEvent({ text: '# Heading', rawHtml: '' }, 'asMarkdown');

        plugin.onPluginEvent(event);

        expect(event.fragment.querySelector('h1')).toBeNull();
    });
});
