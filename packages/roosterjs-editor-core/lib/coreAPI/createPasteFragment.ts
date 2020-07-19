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
    const event = createBeforePasteEvent(core, clipboardData);
    const { fragment } = event;
    const { rawHtml, text, imageDataUri } = clipboardData;
    let doc: HTMLDocument;

    // Step 2: Fill the BeforePasteEvent object, especially the fragment for paste
    if (!pasteAsText && !text && imageDataUri) {
        // Paste image
        const img = core.document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = imageDataUri;
        fragment.appendChild(img);
    } else if (
        !pasteAsText &&
        rawHtml &&
        (doc = new DOMParser().parseFromString(rawHtml, 'text/html'))?.body
    ) {
        // Paste HTML
        const attributes = doc.querySelector('html')?.attributes;
        (attributes ? toArray(attributes) : []).reduce((attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
        }, event.htmlAttributes);

        const startIndex = rawHtml.indexOf(START_FRAGMENT);
        const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

        if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
            event.htmlBefore = rawHtml.substr(0, startIndex);
            event.htmlAfter = rawHtml.substr(endIndex + END_FRAGMENT.length);
            doc.body.innerHTML = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
        }

        const styles = toArray(doc.querySelectorAll('style'));

        // Append all styles nodes, included those under <HEAD> tag so that we can convert them to inline CSS
        styles.forEach(style => fragment.appendChild(style));
        while (doc.body.firstChild) {
            fragment.appendChild(doc.body.firstChild);
        }

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

function createBeforePasteEvent(core: EditorCore, clipboardData: ClipboardData): BeforePasteEvent {
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        fragment: core.document.createDocumentFragment(),
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    };
}
