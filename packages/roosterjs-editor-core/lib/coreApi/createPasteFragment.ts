import {
    applyFormat,
    applyTextStyle,
    Browser,
    createDefaultHtmlSanitizerOptions,
    getInheritableStyles,
    getTagOfNode,
    HtmlSanitizer,
    moveChildNodes,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    ClipboardData,
    CreatePasteFragment,
    EditorCore,
    PluginEventType,
    DefaultFormat,
    NodePosition,
} from 'roosterjs-editor-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';
const NBSP_HTML = '\u00A0';
const ENSP_HTML = '\u2002';
const TAB_SPACES = 6;

/**
 * @internal
 * Create a DocumentFragment for paste from a ClipboardData
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param position The position to paste to
 * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original format
 */
export const createPasteFragment: CreatePasteFragment = (
    core: EditorCore,
    clipboardData: ClipboardData,
    position: NodePosition | null,
    pasteAsText: boolean,
    applyCurrentStyle: boolean
) => {
    if (!clipboardData) {
        return null;
    }

    // Step 1: Prepare BeforePasteEvent object
    const event = createBeforePasteEvent(core, clipboardData);
    const { fragment, sanitizingOption } = event;
    const { rawHtml, text, imageDataUri } = clipboardData;
    const document = core.contentDiv.ownerDocument;
    let doc: Document | undefined = rawHtml
        ? new DOMParser().parseFromString(core.trustedHTMLHandler(rawHtml), 'text/html')
        : undefined;

    // Step 2: Retrieve Metadata from Html and the Html that was copied.
    if (rawHtml && doc?.body) {
        const attributes = doc.querySelector('html')?.attributes;
        (attributes ? toArray(attributes) : []).reduce((attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
        }, event.htmlAttributes);
        toArray(doc.querySelectorAll('meta')).reduce((attrs, meta) => {
            attrs[meta.name] = meta.content;
            return attrs;
        }, event.htmlAttributes);

        clipboardData.htmlFirstLevelChildTags = [];
        doc?.body.normalize();

        for (let i = 0; i < doc?.body.childNodes.length; i++) {
            const node = doc?.body.childNodes.item(i);
            if (node.nodeType == Node.TEXT_NODE) {
                const trimmedString = node.nodeValue?.replace(/(\r\n|\r|\n)/gm, '').trim();
                if (!trimmedString) {
                    continue;
                }
            }
            const nodeTag = getTagOfNode(node);
            if (node.nodeType != Node.COMMENT_NODE) {
                clipboardData.htmlFirstLevelChildTags.push(nodeTag);
            }
        }
        // Move all STYLE nodes into header, and save them into sanitizing options.
        // Because if we directly move them into a fragment, all sheets under STYLE will be lost.
        processStyles(doc, style => {
            doc?.head.appendChild(style);
            sanitizingOption.additionalGlobalStyleNodes.push(style);
        });

        const startIndex = rawHtml.indexOf(START_FRAGMENT);
        const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

        if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
            event.htmlBefore = rawHtml.substr(0, startIndex);
            event.htmlAfter = rawHtml.substr(endIndex + END_FRAGMENT.length);
            clipboardData.html = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
            doc.body.innerHTML = core.trustedHTMLHandler(clipboardData.html);

            // Remove style nodes just added by setting innerHTML of body since we already have all
            // style nodes in header.
            // Here we use doc.body instead of doc because we only want to remove STYLE nodes under BODY
            // and the nodes under HEAD are still used when convert global CSS to inline
            processStyles(doc.body, style => style.parentNode?.removeChild(style));
        }
    }

    // Step 3: Fill the BeforePasteEvent object, especially the fragment for paste
    if (!pasteAsText && !text && imageDataUri) {
        // Paste image
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = imageDataUri;
        fragment.appendChild(img);
    } else if (!pasteAsText && rawHtml && doc ? doc.body : false) {
        moveChildNodes(fragment, doc?.body);

        if (applyCurrentStyle && position) {
            const format = getCurrentFormat(core, position.node);
            applyTextStyle(fragment, node => applyFormat(node, format));
        }
    } else if (text) {
        // Paste text
        text.split('\n').forEach((line, index, lines) => {
            line = line
                .replace(/^ /g, NBSP_HTML)
                .replace(/\r/g, '')
                .replace(/ {2}/g, ' ' + NBSP_HTML);

            if (line.includes('\t')) {
                line = transformTabCharacters(line, index === 0 ? position?.offset : 0);
            }

            const textNode = document.createTextNode(line);

            // There are 3 scenarios:
            // 1. Single line: Paste as it is
            // 2. Two lines: Add <br> between the lines
            // 3. 3 or More lines, For first and last line, paste as it is. For middle lines, wrap with DIV, and add BR if it is empty line
            if (lines.length == 2 && index == 0) {
                // 1 of 2 lines scenario, add BR
                fragment.appendChild(textNode);
                fragment.appendChild(document.createElement('br'));
            } else if (index > 0 && index < lines.length - 1) {
                // Middle line of >=3 lines scenario, wrap with DIV
                fragment.appendChild(wrap(line == '' ? document.createElement('br') : textNode));
            } else {
                // All others, paste as it is
                fragment.appendChild(textNode);
            }
        });
    }

    // Step 4: Trigger BeforePasteEvent so that plugins can do proper change before paste
    core.api.triggerEvent(core, event, true /*broadcast*/);

    // Step 5. Sanitize the fragment before paste to make sure the content is safe
    const sanitizer = new HtmlSanitizer(event.sanitizingOption);

    sanitizer.convertGlobalCssToInlineCss(fragment);
    sanitizer.sanitize(fragment, position ? getInheritableStyles(position.element) : undefined);

    // Step 6. Remove unexpected caret color for Safari
    if (Browser.isSafari) {
        removeCaretColor(fragment);
    }

    return fragment;
};

/**
 * @internal
 * Transform \t characters into EN SPACE characters
 * @param input string NOT containing \n characters
 * @example t("\thello", 2) => "&ensp;&ensp;&ensp;&ensp;hello"
 */
export function transformTabCharacters(input: string, initialOffset: number = 0) {
    let line = input;
    let tIndex: number;
    while ((tIndex = line.indexOf('\t')) != -1) {
        const lineBefore = line.slice(0, tIndex);
        const lineAfter = line.slice(tIndex + 1);
        const tabCount = TAB_SPACES - ((lineBefore.length + initialOffset) % TAB_SPACES);
        const tabStr = Array(tabCount).fill(ENSP_HTML).join('');
        line = lineBefore + tabStr + lineAfter;
    }
    return line;
}

function getCurrentFormat(core: EditorCore, node: Node): DefaultFormat {
    const pendableFormat = core.api.getPendableFormatState(core, true /** forceGetStateFromDOM*/);
    const styleBasedFormat = core.api.getStyleBasedFormatState(core, node);
    return {
        fontFamily: styleBasedFormat.fontName,
        fontSize: styleBasedFormat.fontSize,
        textColor: styleBasedFormat.textColor,
        backgroundColor: styleBasedFormat.backgroundColor,
        textColors: styleBasedFormat.textColors,
        backgroundColors: styleBasedFormat.backgroundColors,
        bold: pendableFormat.isBold,
        italic: pendableFormat.isItalic,
        underline: pendableFormat.isUnderline,
    };
}

function createBeforePasteEvent(core: EditorCore, clipboardData: ClipboardData): BeforePasteEvent {
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        fragment: core.contentDiv.ownerDocument.createDocumentFragment(),
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    };
}

function processStyles(node: ParentNode, callback: (style: HTMLStyleElement) => void) {
    toArray(node.querySelectorAll('style')).forEach(callback);
}

/**
 * Remove unwanted caret-color value for some browsers, such as Safari.
 * We create a light mode only temp div to do the copy paste, and Safari always sets 'caret-color' to 'color' for copied text,
 * However, when transform colors to dark, we don't take caret-color into account, hence a pure black caret will be used in dark mode, which is invisible.
 * @param fragment the DocumentFragment to clean up
 */
function removeCaretColor(fragment: DocumentFragment) {
    const children = fragment.children;
    for (let index = 0; index < children.length; ++index) {
        const element = children[index] as HTMLElement;
        if (element) {
            element.style.caretColor = '';
        }
    }
}
