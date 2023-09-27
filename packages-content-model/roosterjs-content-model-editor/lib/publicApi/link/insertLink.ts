import getSelectedSegments from '../selection/getSelectedSegments';
import { ChangeSource } from 'roosterjs-editor-types';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { HtmlSanitizer, matchLink } from 'roosterjs-editor-dom';
import { mergeModel } from '../../modelApi/common/mergeModel';
import type { ContentModelLink } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    addLink,
    addSegment,
    createContentModelDocument,
    createText,
} from 'roosterjs-content-model-dom';

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
    editor: IContentModelEditor,
    link: string,
    anchorTitle?: string,
    displayText?: string,
    target?: string
) {
    let url = (checkXss(link) || '').trim();
    if (url) {
        const linkData = matchLink(url);
        const linkUrl = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        const links: ContentModelLink[] = [];
        let anchorNode: Node | undefined;

        formatWithContentModel(
            editor,
            'insertLink',
            (model, context) => {
                const segments = getSelectedSegments(model, false /*includingFormatHolder*/);
                const originalText = segments
                    .map(x => (x.segmentType == 'Text' ? x.text : ''))
                    .join('');
                const text = displayText || originalText || '';

                if (
                    segments.some(x => x.segmentType != 'SelectionMarker') &&
                    originalText == text
                ) {
                    segments.forEach(x => {
                        const link = createLink(
                            linkUrl,
                            anchorTitle,
                            target,
                            x.segmentType == 'Text'
                        );
                        addLink(x, link);
                        if (x.link) {
                            links.push(x.link);
                        }
                    });
                } else if (
                    segments.every(x => x.segmentType == 'SelectionMarker') ||
                    (!!text && text != originalText)
                ) {
                    const segment = createText(text || (linkData ? linkData.originalUrl : url), {
                        ...(segments[0]?.format || {}),
                        ...(getPendingFormat(editor) || {}),
                    });
                    const doc = createContentModelDocument();
                    const link = createLink(linkUrl, anchorTitle, target);

                    addLink(segment, link);
                    addSegment(doc, segment);

                    if (segment.link) {
                        links.push(segment.link);
                    }

                    mergeModel(model, doc, context, {
                        mergeFormat: 'mergeAll',
                    });
                }

                return segments.length > 0;
            },
            {
                changeSource: ChangeSource.CreateLink,
                onNodeCreated: (modelElement, node) => {
                    if (!anchorNode && links.indexOf(modelElement as ContentModelLink) >= 0) {
                        anchorNode = node;
                    }
                },
                getChangeData: () => anchorNode,
            }
        );
    }
}

const createLink = (
    url: string,
    anchorTitle?: string,
    target?: string,
    underline: boolean = true
): ContentModelLink => {
    return {
        dataset: {},
        format: {
            href: url,
            anchorTitle,
            target,
            underline: underline,
        },
    };
};

// TODO: This is copied from original code. We may need to integrate this logic into matchLink() later.
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

// TODO: This is copied from original code. However, ContentModel should be able to filter out malicious
// attributes later, so no need to use HtmlSanitizer here
function checkXss(link: string): string {
    const sanitizer = new HtmlSanitizer();
    const a = document.createElement('a');

    a.href = link || '';

    sanitizer.sanitize(a);
    // We use getAttribute because some browsers will try to make the href property a valid link.
    // This has unintended side effects when the link lacks a protocol.
    return a.getAttribute('href') || '';
}
