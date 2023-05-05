import { ContentModelHyperLinkFormat } from '../../../../publicTypes/format/ContentModelHyperLinkFormat';
import { FormatParser } from '../../../../publicTypes/context/DomToModelSettings';
import { safeInstanceOf } from 'roosterjs-editor-dom';

const HTTP = 'http:';
const HTTPS = 'https:';
const NOTES = 'notes:';

const sanitizeLinks: FormatParser<ContentModelHyperLinkFormat> = (
    format,
    element,
    context,
    defaultStyle
) => {
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
};

export default sanitizeLinks;
