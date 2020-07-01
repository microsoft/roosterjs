import EditorCore, { CreatePasteFragment } from '../interfaces/EditorCore';
import {
    applyFormat,
    applyTextStyle,
    createDefaultHtmlSanitizerOptions,
    getComputedStyles,
    getInheritableStyles,
    getPendableFormatState,
    HtmlSanitizer,
    Position,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    ClipboardData,
    PasteOption,
    PluginEventType,
    DefaultFormat,
} from 'roosterjs-editor-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

export const createPasteFragment: CreatePasteFragment = (
    core: EditorCore,
    clipboardData: ClipboardData,
    pasteAsText: boolean,
    applyCurrentStyle: boolean
) => {
    // Step 1: Prepare BeforePasteEvent object
    const range = core.api.getSelectionRange(core, false /*tryGetFromCache*/);
    const startPos = range && Position.getStart(range);
    const { rawHtml, text, imageDataUri } = clipboardData;
    const pasteOption = pasteAsText
        ? PasteOption.PasteText
        : clipboardData.text || !clipboardData.image
        ? PasteOption.PasteHtml
        : PasteOption.PasteImage;
    const fragment = core.document.createDocumentFragment();
    const event: BeforePasteEvent = {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        pasteOption,
        fragment,
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    };

    let doc: HTMLDocument;

    // Step 2: Fill the BeforePasteEvent object, especially the fragment for paste
    if (pasteOption == PasteOption.PasteImage && imageDataUri) {
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = imageDataUri;
        fragment.appendChild(img);
    } else if (
        pasteOption == PasteOption.PasteHtml &&
        rawHtml &&
        (doc = new DOMParser().parseFromString(rawHtml, 'text/html')) &&
        doc.body
    ) {
        const attributes = doc.querySelector('html')?.attributes;
        (attributes ? toArray(attributes) : []).reduce((attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
        }, event.htmlAttributes);

        const startIndex = rawHtml.indexOf(START_FRAGMENT);
        const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

        if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
            event.htmlBefore = rawHtml.substr(0, startIndex);
            event.htmlAfter = rawHtml.substr(endIndex + END_FRAGMENT.length);
            doc.body.innerHTML = clipboardData.html = rawHtml.substring(
                startIndex + START_FRAGMENT.length,
                endIndex
            );
        }

        const styles = toArray(doc.querySelectorAll('style'));

        // Append all styles nodes, included those under <HEAD> tag so that we can convert them to inline CSS
        styles.forEach(style => fragment.appendChild(style));
        while (doc.body.firstChild) {
            fragment.appendChild(doc.body.firstChild);
        }

        if (applyCurrentStyle && startPos) {
            applyTextStyle(fragment, node =>
                applyFormat(node, getCurrentFormat(core.document, startPos.node))
            );
        }
    } else if (text) {
        text.split('\n').forEach((line, index, lines) => {
            line = line.replace(/^ /g, '\u00A0').replace(/\r/g, '').replace(/ {2}/g, ' \u00A0');

            const node = line == '' ? document.createElement('br') : document.createTextNode(line);

            fragment.appendChild(index == 0 || index == lines.length - 1 ? node : wrap(node));
        });
    }

    // Step 3: Trigger BeforePasteEvent so that plugins can do proper change before paste
    core.api.triggerEvent(core, event, true /*broadcast*/);

    // Step 4. Sanitize the fragment before paste to make sure the content is safe
    const sanitizer = new HtmlSanitizer(event.sanitizingOption);

    sanitizer.convertGlobalCssToInlineCss(fragment);
    sanitizer.sanitize(fragment, startPos && getInheritableStyles(startPos.element));

    return fragment;
};

function getCurrentFormat(doc: HTMLDocument, node: Node): DefaultFormat {
    const focusedNode = node;
    const pendableFormat = getPendableFormatState(doc);
    const styleBasedForamt = getComputedStyles(focusedNode);
    return {
        fontFamily: styleBasedForamt[0],
        fontSize: styleBasedForamt[1],
        textColor: styleBasedForamt[2],
        backgroundColor: styleBasedForamt[3],
        bold: pendableFormat.isBold,
        italic: pendableFormat.isItalic,
        underline: pendableFormat.isUnderline,
    };
}
