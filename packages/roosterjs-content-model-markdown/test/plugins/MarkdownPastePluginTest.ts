import { MarkdownPastePlugin } from '../../lib/plugins/MarkdownPastePlugin';
import type {
    BeforePasteEvent,
    ClipboardData,
    DOMCreator,
    IEditor,
    PasteType,
    PluginEvent,
} from 'roosterjs-content-model-types';

describe('MarkdownPastePlugin', () => {
    let doc: Document;
    let trustedHTMLHandler: DOMCreator;
    let editor: IEditor;

    beforeEach(() => {
        doc = document.implementation.createHTMLDocument('test');
        trustedHTMLHandler = {
            htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        };
        editor = ({
            getDocument: () => doc,
            getDOMCreator: () => trustedHTMLHandler,
        } as unknown) as IEditor;
    });

    function createPlugin(autoConversion?: boolean): MarkdownPastePlugin {
        const plugin =
            autoConversion === undefined
                ? new MarkdownPastePlugin()
                : new MarkdownPastePlugin({ autoConversion });
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

    it('converts markdown on normal paste when autoConversion is true', () => {
        const plugin = createPlugin(true /*autoConversion*/);
        const event = createEvent({ text: '# Heading', rawHtml: '' }, 'normal');

        plugin.onPluginEvent(event);

        expect(event.fragment.querySelector('h1')).not.toBeNull();
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
