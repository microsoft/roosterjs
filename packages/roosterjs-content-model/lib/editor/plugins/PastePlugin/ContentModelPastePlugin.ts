import ContentModelBeforePasteEvent from '../../../publicTypes/event/ContentModelBeforePasteEvent';
import { getPasteSource, safeInstanceOf } from 'roosterjs-editor-dom';
import { handleExcelOnline } from './handleExcelOnline';
import { handleWacComponents } from './handleWacComponents';
import { IContentModelEditor } from '../../../publicTypes/IContentModelEditor';
import { wordDesktopElementProcessor } from './WordDesktopProcessor/wordDesktopElementProcessor';
import {
    EditorPlugin,
    IEditor,
    KnownPasteSourceType,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

const WAC_CLASSES = [
    'BulletListStyle',
    'OutlineElement',
    'NumberListStyle',
    'OutlineElement',
    'WACImageContainer',
    'ListContainerWrapper',
    'BulletListStyle',
    'NumberListStyle',
    'WACImageContainer',
    'Superscript',
];
const deprecatedColorParser = (
    format: import('c:/Users/bvalverde/Desktop/Newfolder/roosterjs/packages/roosterjs-content-model/lib/index').ContentModelSegmentFormat,
    element: HTMLElement,
    _context: import('c:/Users/bvalverde/Desktop/Newfolder/roosterjs/packages/roosterjs-content-model/lib/index').DomToModelContext,
    defaultStyles: Readonly<Partial<CSSStyleDeclaration>>
): void => {
    console.log(element);
    if (DeprecatedColorList.indexOf(element.style.backgroundColor) > -1) {
        format.backgroundColor = defaultStyles.backgroundColor;
        element.style.backgroundColor = defaultStyles.backgroundColor ?? '';
    }
    if (DeprecatedColorList.indexOf(element.style.color) > -1) {
        format.textColor = defaultStyles.color;
        element.style.color = defaultStyles.color ?? '';
    }
};
/**
 * ContentModelFormat plugins helps editor to do formatting on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
export default class ContentModelFormatPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Construct a new instance of Paste class
     * @param unknownTagReplacement Replace solution of unknown tags, default behavior is to replace with SPAN
     */
    constructor(private unknownTagReplacement: string = 'SPAN') {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelPaste';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
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
        if (!ev.domToModelOption.processorOverride) {
            ev.domToModelOption.processorOverride = {};
        }
        const pasteSource = getPasteSource(event, false);
        switch (pasteSource) {
            case KnownPasteSourceType.WordDesktop:
                ev.domToModelOption.processorOverride.element = wordDesktopElementProcessor;
                break;
            case KnownPasteSourceType.ExcelOnline:
                handleExcelOnline(ev);
                break;
            case KnownPasteSourceType.WacComponents:
                event.sanitizingOption.additionalAllowedCssClasses.push(...WAC_CLASSES);

                handleWacComponents(ev);
                break;

            default:
                break;
        }
        sanitizeHtmlColorsFromPastedContent(ev);
        sanitizeLinks(ev);

        event.sanitizingOption.unknownTagReplacement = this.unknownTagReplacement;
    }
}

/**
 * @internal
 * List of deprecated colors that should be removed
 */

export const DeprecatedColorList: string[] = [
    'activeborder',
    'activecaption',
    'appworkspace',
    'background',
    'buttonhighlight',
    'buttonshadow',
    'captiontext',
    'inactiveborder',
    'inactivecaption',
    'inactivecaptiontext',
    'infobackground',
    'infotext',
    'menu',
    'menutext',
    'scrollbar',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedfhadow',
    'window',
    'windowframe',
    'windowtext',
];
function sanitizeHtmlColorsFromPastedContent(ev: ContentModelBeforePasteEvent) {
    if (!ev.domToModelOption.additionalFormatParsers) {
        ev.domToModelOption.additionalFormatParsers = {};
    }
    if (!ev.domToModelOption.additionalFormatParsers.segment) {
        ev.domToModelOption.additionalFormatParsers.segment = [];
    }
    if (!ev.domToModelOption.additionalFormatParsers.segmentOnBlock) {
        ev.domToModelOption.additionalFormatParsers.segmentOnBlock = [];
    }
    ev.domToModelOption.additionalFormatParsers.segment.push(deprecatedColorParser);
    ev.domToModelOption.additionalFormatParsers.segmentOnBlock.push(deprecatedColorParser);
}

const HTTP = 'http:';
const HTTPS = 'https:';
const NOTES = 'notes:';

function sanitizeLinks(ev: ContentModelBeforePasteEvent) {
    if (!ev.domToModelOption.additionalFormatParsers) {
        ev.domToModelOption.additionalFormatParsers = {};
    }
    if (!ev.domToModelOption.additionalFormatParsers.link) {
        ev.domToModelOption.additionalFormatParsers.link = [];
    }

    ev.domToModelOption.additionalFormatParsers.link.push(
        (format, element, context, defaultStyle) => {
            if (!safeInstanceOf(element, 'HTMLAnchorElement')) {
                return;
            }

            let url: URL | undefined;
            try {
                url = new URL(element.href);
            } catch {
                url = undefined;
            }

            if (
                !url ||
                !(
                    url.protocol === HTTP ||
                    url.protocol === HTTPS ||
                    url.protocol === NOTES
                ) /* whitelist Notes protocol */
            ) {
                element.removeAttribute('href');
                format.href = '';
            }
        }
    );
}
