import { MarkdownPastePlugin } from '../../lib/plugins/MarkdownPastePlugin';
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

    function createPlugin(autoConversion?: boolean, undoConversion?: boolean): MarkdownPastePlugin {
        const plugin =
            autoConversion === undefined && undoConversion === undefined
                ? new MarkdownPastePlugin()
                : new MarkdownPastePlugin({
                      autoConversion: !!autoConversion,
                      undoConversion: !!undoConversion,
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
            source: 'Paste',
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
        expect(options).toEqual({ apiName: 'MarkdownConversion' });

        const target = createEmptyModel();
        expect(callback(target)).toBe(true);
        expect(target.blocks).toBe(modelBeforePaste.blocks);
        expect(modelBeforePaste.blocks.length).toBeGreaterThan(0);
        plugin.dispose();
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

        // The pre-existing text segment should still be present after merging
        const firstBlock = modelBeforePaste.blocks[0];
        expect(firstBlock.blockType).toBe('Paragraph');
        if (firstBlock.blockType === 'Paragraph') {
            const hasExistingText = firstBlock.segments.some(
                s => s.segmentType === 'Text' && s.text === 'existing '
            );
            expect(hasExistingText).toBe(true);
        }

        // The converted heading should have been merged into the model
        const hasHeadingBlock = modelBeforePaste.blocks.some(
            b => b.blockType === 'Paragraph' && b.decorator?.tagName === 'h1'
        );
        expect(hasHeadingBlock).toBe(true);

        // The callback should swap the formatted model's blocks for the merged ones
        const [callback] = formatContentModelSpy.calls.mostRecent().args as [
            (model: ContentModelDocument) => boolean,
            FormatContentModelOptions
        ];
        const target = createEmptyModel();
        expect(callback(target)).toBe(true);
        expect(target.blocks).toBe(modelBeforePaste.blocks);

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
