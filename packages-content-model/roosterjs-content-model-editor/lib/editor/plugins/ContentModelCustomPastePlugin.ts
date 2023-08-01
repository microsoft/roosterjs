import ContentModelBeforePasteEvent from '../../publicTypes/event/ContentModelBeforePasteEvent';
import getSelectedSegments from '../../publicApi/selection/getSelectedSegments';
import { ContentModelDocument, ContentModelSegment } from 'roosterjs-content-model-types/';
import { domToContentModel, normalizeContentModel } from 'roosterjs-content-model-dom';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

const SUPPORTED_PROTOCOLS = ['http:', 'https:'];
const INVALID_LINKS_REGEX = /^file:\/\/\/[a-zA-Z\/]/i;

export default class ContentModelCustomPastePlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelPaste';
    }

    /**
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.editor = editor as IContentModelEditor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor || event.eventType != PluginEventType.BeforePaste) {
            return;
        }

        const ev = event as ContentModelBeforePasteEvent;
        if (!ev.domToModelOption && !ev.clipboardData.pasteNativeEvent) {
            return;
        }

        console.log('onPluginEvent', ev.clipboardData.pasteNativeEvent);

        createLinkTurboMode(this.editor, ev);
    }
}

function createLinkTurboMode(editor: IContentModelEditor, event: ContentModelBeforePasteEvent) {
    const url = getLinkUrl(event);
    const model = editor.createContentModel({ disableCacheElement: true });

    if (url && isInlineTextSelection(model)) {
        event.customizedMerge = (target: ContentModelDocument, _source: ContentModelDocument) => {
            applyLinks(target, url);
            normalizeContentModel(target);
        };
    } else {
        event.customizedMerge = undefined;
    }
}

const checkValidURL = (href: string) => {
    let url: URL | undefined;
    try {
        url = new URL(href);
    } catch {
        url = undefined;
    }
    return url && SUPPORTED_PROTOCOLS.indexOf(url.protocol) >= 0 && !INVALID_LINKS_REGEX.test(href);
};

const getLinkUrl = (event: ContentModelBeforePasteEvent) => {
    const pasteModel = domToContentModel(event.fragment, event.domToModelOption);
    const linkBlock = pasteModel.blocks[0];
    const segment =
        linkBlock && linkBlock.blockType === 'Paragraph' && linkBlock.segments.length === 1
            ? linkBlock.segments[0]
            : undefined;
    if (pasteModel.blocks.length === 1 && segment && segment.segmentType === 'Text') {
        const href = segment.link?.format.href || segment.text;
        if (href && checkValidURL(href)) {
            return href;
        }
    }
    return undefined;
};

const applyLinks = (model: ContentModelDocument, url: string) => {
    const selectedSegments = getSelectedSegments(model, false /*includingFormatHolder*/);
    selectedSegments.forEach(segment => {
        if (segment.segmentType === 'Text') {
            createLinkSegment(segment, url);
        }
    });
};

const createLinkSegment = (segment: ContentModelSegment, url: string) => {
    segment.link = {
        dataset: {},
        format: {
            href: url,
            underline: true,
        },
    };
};

const isInlineTextSelection = (model: ContentModelDocument) => {
    let isInline = true;
    let selectedIndex: number | undefined = undefined;

    model.blocks.forEach((block, index) => {
        if (block.blockType === 'Paragraph') {
            block.segments.forEach(segment => {
                if (segment.isSelected) {
                    if (!selectedIndex) {
                        selectedIndex = index;
                    } else {
                        isInline = selectedIndex === index;
                    }
                }
            });
        }
    });

    const selectedSegments = getSelectedSegments(model, false /*includingFormatHolder*/);
    return isInline && selectedSegments.every(segment => segment.segmentType === 'Text');
};
