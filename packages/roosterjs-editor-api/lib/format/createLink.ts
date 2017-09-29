import CursorData from '../cursor/CursorData';
import defaultLinkMatchRules from '../linkMatch/defaultLinkMatchRules';
import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import matchLink from '../linkMatch/matchLink';
import { ContentPosition, LinkMatchOption } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { LinkInlineElement } from 'roosterjs-editor-dom';

// Regex matching Uri scheme
const URI_REGEX = /^[a-zA-Z]+:/i;
// Regex matching begin of email address
const MAILTO_REGEX = /^[\w.%+-]+@/i;
// Regex matching begin of ftp, i.e. ftp.microsoft.com
const FTP_REGEX = /^ftp\./i;

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
            prefix = 'http' + '://';
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
 * If there is a selection, this parameter will be ignored.
 * If not specified, will use link instead
 */
export default function createLink(editor: Editor, link: string, altText?: string, displayText?: string): void {
    editor.focus();
    let url = link ? link.trim() : '';
    if (url) {
        let formatter: () => void = null;
        let linkData = matchLink(url, LinkMatchOption.Exact, defaultLinkMatchRules);
        // matchLink can match most links, but not all, i.e. if you pass link a link as "abc", it won't match
        // we know in that case, users will want to insert a link like http://abc
        // so we have separate logic in applyLinkPrefix to add link prefix depending on the format of the link
        // i.e. if the link starts with something like abc@xxx, we will add mailto: prefix
        // if the link starts with ftp.xxx, we will add ftp:// link. For more, see applyLinkPrefix
        let normalizedUrl = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        let originalUrl = linkData ? linkData.originalUrl : normalizedUrl;

        if (isSelectionCollapsed(editor)) {
            let anchor = editor.getDocument().createElement('A') as HTMLAnchorElement;
            anchor.textContent = displayText || originalUrl;
            anchor.href = normalizedUrl;
            if (altText) {
                anchor.setAttribute('alt', altText);
            }

            formatter = () =>
                editor.insertNode(anchor, {
                    position: ContentPosition.SelectionStart,
                    updateCursor: true,
                    replaceSelection: true,
                    insertOnNewLine: false,
                });
        } else {
            /* the selection is not collapsed, use browser execCommand */
            formatter = () => {
                editor.getDocument().execCommand('createLink', false, normalizedUrl);
                // The link is created first, and then we apply altText if user asks
                if (altText) {
                    let cursorData = new CursorData(editor);
                    // The link remains selected after it is applied. To get the link, need to read
                    // The inline element after cursor since cursor always points to start of selection
                    // There can also be cases that users select text across multiple lines causing mulitple links
                    // to be created (one per line). This means the alttext will only be applied to first link
                    // This is less a case. For simplicity, we just that case for the moment
                    let inlineBeforeCursor = cursorData.inlineElementAfterCursor;
                    if (inlineBeforeCursor && inlineBeforeCursor instanceof LinkInlineElement) {
                        (inlineBeforeCursor.getContainerNode() as HTMLAnchorElement).setAttribute(
                            'alt',
                            altText
                        );
                    }
                }
            };
        }

        if (formatter) {
            execFormatWithUndo(editor, formatter);
        }
    }
}
