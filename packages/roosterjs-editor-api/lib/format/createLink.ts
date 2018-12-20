import { ChangeSource, DocumentCommand, QueryScope } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { matchLink } from 'roosterjs-editor-dom';

// Regex matching Uri scheme
const URI_REGEX = /^[a-zA-Z]+:/i;
// Regex matching begin of email address
const MAILTO_REGEX = /^[\w.%+-]+@/i;
// Regex matching begin of ftp, i.e. ftp.microsoft.com
const FTP_REGEX = /^ftp\./i;
const TEMP_TITLE = 'istemptitle';

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

/**
 * Insert a hyperlink at cursor.
 * When there is a selection, hyperlink will be applied to the selection,
 * otherwise a hyperlink will be inserted to the cursor position.
 * @param editor Editor object
 * @param link Link address, can be http(s), mailto, notes, file, unc, ftp, news, telnet, gopher, wais.
 * When protocol is not specified, a best matched protocol will be predicted.
 * @param altText Optional alt text of the link, will be shown when hover on the link
 * @param displayText Optional display text for the link.
 * If specified, the display text of link will be replaced with this text.
 * If not specified and there wasn't a link, the link url will be used as display text.
 */
export default function createLink(
    editor: Editor,
    link: string,
    altText?: string,
    displayText?: string
) {
    editor.focus();
    let url = link ? link.trim() : '';
    if (url) {
        let linkData = matchLink(url);
        // matchLink can match most links, but not all, i.e. if you pass link a link as "abc", it won't match
        // we know in that case, users will want to insert a link like http://abc
        // so we have separate logic in applyLinkPrefix to add link prefix depending on the format of the link
        // i.e. if the link starts with something like abc@xxx, we will add mailto: prefix
        // if the link starts with ftp.xxx, we will add ftp:// link. For more, see applyLinkPrefix
        let normalizedUrl = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        let originalUrl = linkData ? linkData.originalUrl : url;

        editor.addUndoSnapshot(() => {
            let range = editor.getSelectionRange();
            let anchor: HTMLAnchorElement = null;
            if (range && range.collapsed) {
                anchor = getAnchorNodeAtCursor(editor);

                // If there is already a link, just change its href
                if (anchor) {
                    anchor.href = normalizedUrl;
                    // Change text content if it is specified
                    updateAnchorDisplayText(anchor, displayText);
                } else {
                    anchor = editor.getDocument().createElement('A') as HTMLAnchorElement;
                    anchor.textContent = displayText || originalUrl;
                    anchor.href = normalizedUrl;
                    editor.insertNode(anchor);
                }
            } else {
                // the selection is not collapsed, use browser execCommand
                editor.getDocument().execCommand(DocumentCommand.CreateLink, false, normalizedUrl);
                anchor = getAnchorNodeAtCursor(editor);
                updateAnchorDisplayText(anchor, displayText);
            }
            if (altText && anchor) {
                // Hack: Ideally this should be done by HyperLink plugin.
                // We make a hack here since we don't have an event to notify HyperLink plugin
                // before we apply the link.
                anchor.removeAttribute(TEMP_TITLE);
                anchor.title = altText;
            }
            return anchor;
        }, ChangeSource.CreateLink);
    }
}

function getAnchorNodeAtCursor(editor: Editor): HTMLAnchorElement {
    return editor.queryElements('a[href]', QueryScope.OnSelection)[0] as HTMLAnchorElement;
}

function updateAnchorDisplayText(anchor: HTMLAnchorElement, displayText: string) {
    if (displayText && anchor.textContent != displayText) {
        anchor.textContent = displayText;
    }
}
