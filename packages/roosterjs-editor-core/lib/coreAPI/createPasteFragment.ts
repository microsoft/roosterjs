import EditorCore, { CreatePasteFragment } from '../interfaces/EditorCore';
import {
    applyFormat,
    applyTextStyle,
    createDefaultHtmlSanitizerOptions,
    getInheritableStyles,
    getPendableFormatState,
    HtmlSanitizer,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    ClipboardData,
    PasteOption,
    PluginEventType,
    DefaultFormat,
    NodePosition,
} from 'roosterjs-editor-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';
const NBSP_HTML = '\u00A0';

export const createPasteFragment: CreatePasteFragment = (
    core: EditorCore,
    clipboardData: ClipboardData,
    position: NodePosition,
    pasteAsText: boolean,
    applyCurrentStyle: boolean
) => {
    // Step 1: Prepare BeforePasteEvent object
    const event = createBeforePasteEvent(core, clipboardData, pasteAsText);
    const { fragment, pasteOption, sanitizingOption } = event;
    const { rawHtml, text, imageDataUri } = clipboardData;
    let doc: HTMLDocument;

    // Step 2: Fill the BeforePasteEvent object, especially the fragment for paste
    if (pasteOption == PasteOption.PasteImage && imageDataUri) {
        const img = core.document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = imageDataUri;
        fragment.appendChild(img);
    } else if (
        pasteOption == PasteOption.PasteHtml &&
        rawHtml &&
        (doc = new DOMParser().parseFromString(rawHtml, 'text/html'))?.body
    ) {
        // Save HTML node attributes and META attributes so that plugin can query
        const attributes = doc.querySelector('html')?.attributes;
        (attributes ? toArray(attributes) : []).reduce((attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
        }, event.htmlAttributes);
        toArray(doc.querySelectorAll('meta')).reduce((attrs, meta) => {
            attrs[meta.name] = meta.content;
            return attrs;
        }, event.htmlAttributes);

        // Move all STYLE nodes into header, and save them into sanitizing options.
        // Because if we directly move them into a fragment, all sheets under STYLE will be lost.
        processStyles(doc, style => {
            doc.head.appendChild(style);
            sanitizingOption.additionalGlobalStyleNodes.push(style);
        });

        const startIndex = rawHtml.indexOf(START_FRAGMENT);
        const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

        if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
            event.htmlBefore = rawHtml.substr(0, startIndex);
            event.htmlAfter = rawHtml.substr(endIndex + END_FRAGMENT.length);
            doc.body.innerHTML = clipboardData.html = rawHtml.substring(
                startIndex + START_FRAGMENT.length,
                endIndex
            );

            // Remove style nodes just added by setting innerHTML of body since we already have all
            // style nodes in header.
            // Here we use doc.body instead of doc because we only want to remove STYLE nodes under BODY
            // and the nodes under HEAD are still used when convert global CSS to inline
            processStyles(doc.body, style => style.parentNode?.removeChild(style));
        }

        while (doc.body.firstChild) {
            fragment.appendChild(doc.body.firstChild);
        }

        if (applyCurrentStyle && position) {
            const format = getCurrentFormat(core, position.node);
            applyTextStyle(fragment, node => applyFormat(node, format));
        }
    } else if (text) {
        text.split('\n').forEach((line, index, lines) => {
            line = line
                .replace(/^ /g, NBSP_HTML)
                .replace(/\r/g, '')
                .replace(/ {2}/g, ' ' + NBSP_HTML);

            const node = line == '' ? document.createElement('br') : document.createTextNode(line);

            fragment.appendChild(index == 0 || index == lines.length - 1 ? node : wrap(node));
        });
    }

    // Step 3: Trigger BeforePasteEvent so that plugins can do proper change before paste
    core.api.triggerEvent(core, event, true /*broadcast*/);

    // Step 4. Sanitize the fragment before paste to make sure the content is safe
    const sanitizer = new HtmlSanitizer(event.sanitizingOption);

    sanitizer.convertGlobalCssToInlineCss(fragment);
    sanitizer.sanitize(fragment, position && getInheritableStyles(position.element));

    return fragment;
};

function getCurrentFormat(core: EditorCore, node: Node): DefaultFormat {
    const pendableFormat = getPendableFormatState(core.document);
    const styleBasedForamt = core.api.getStyleBasedFormatState(core, node);
    return {
        fontFamily: styleBasedForamt.fontName,
        fontSize: styleBasedForamt.fontSize,
        textColor: styleBasedForamt.textColor,
        backgroundColor: styleBasedForamt.backgroundColor,
        textColors: styleBasedForamt.textColors,
        backgroundColors: styleBasedForamt.backgroundColors,
        bold: pendableFormat.isBold,
        italic: pendableFormat.isItalic,
        underline: pendableFormat.isUnderline,
    };
}

function createBeforePasteEvent(
    core: EditorCore,
    clipboardData: ClipboardData,
    pasteAsText: boolean
): BeforePasteEvent {
    const pasteOption = pasteAsText
        ? PasteOption.PasteText
        : clipboardData.text || !clipboardData.image
        ? PasteOption.PasteHtml
        : PasteOption.PasteImage;
    const fragment = core.document.createDocumentFragment();
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        pasteOption,
        fragment,
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    };
}

function processStyles(node: ParentNode, callback: (style: HTMLStyleElement) => void) {
    const styles = node.querySelectorAll('style');
    for (let i = 0; i < styles.length; i++) {
        callback(styles[i]);
    }
}
