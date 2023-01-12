import { formatWithContentModel } from '../utils/formatWithContentModel';
import { HtmlSanitizer, matchLink } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { insertModelLink } from '../../modelApi/link/insertModelLink';

// Regex matching Uri scheme
const URI_REGEX = /^[a-zA-Z]+:/i;
// Regex matching begin of email address
const MAILTO_REGEX = /^[\w.%+-]+@/i;
// Regex matching begin of ftp, i.e. ftp.microsoft.com
const FTP_REGEX = /^ftp\./i;

/**
 * Insert a hyperlink at cursor.
 * When there is a selection, hyperlink will be applied to the selection,
 * otherwise a hyperlink will be inserted to the cursor position.
 * @param editor Editor object
 * @param link Link address, can be http(s), mailto, notes, file, unc, ftp, news, telnet, gopher, wais.
 * When protocol is not specified, a best matched protocol will be predicted.
 * @param anchorTitle Optional alt text of the link, will be shown when hover on the link
 * @param displayText Optional display text for the link.
 * @param target Optional display target for the link ("_blank"|"_self"|"_parent"|"_top"|"{framename}")
 * If specified, the display text of link will be replaced with this text.
 * If not specified and there wasn't a link, the link url will be used as display text.
 */
export default function insertLink(
    editor: IExperimentalContentModelEditor,
    link: string,
    anchorTitle?: string,
    displayText?: string,
    target?: string
) {
    let url = (checkXss(link) || '').trim();
    if (url) {
        const linkData = matchLink(url);

        formatWithContentModel(editor, 'insertLink', model => {
            return insertModelLink(model, displayText || (linkData ? linkData.originalUrl : url), {
                href: linkData ? linkData.normalizedUrl : applyLinkPrefix(url),
                anchorTitle,
                target,
            });
        });
    }
}

function applyLinkPrefix(url: string): string {
    if (!url) {
        return url;
    }

    // Add link prefix per rule:
    // (a) if the url always starts with a URI scheme, leave it as it is
    // (b) if the url is an email address, xxx@... add mailto: prefix
    // (c) if the url starts with ftp., add ftp:// prefix
    // (d) rest, add http:// prefix
    let prefix = '';
    if (url.search(URI_REGEX) < 0) {
        if (url.search(MAILTO_REGEX) == 0) {
            prefix = 'mailto:';
        } else if (url.search(FTP_REGEX) == 0) {
            prefix = 'ftp://';
        } else {
            // fallback to http://
            prefix = 'http://';
        }
    }

    return prefix + url;
}

// TODO: No need to use HtmlSanitizer here
function checkXss(link: string): string {
    const sanitizer = new HtmlSanitizer();
    const a = document.createElement('a');

    a.href = link || '';

    sanitizer.sanitize(a);
    // We use getAttribute because some browsers will try to make the href property a valid link.
    // This has unintended side effects when the link lacks a protocol.
    return a.getAttribute('href') || '';
}
