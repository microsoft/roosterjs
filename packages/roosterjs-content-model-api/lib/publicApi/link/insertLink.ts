import { adjustTrailingSpaceSelection } from '../../modelApi/selection/adjustTrailingSpaceSelection';
import { checkXss } from '../utils/checkXss';
import { matchLink } from '../../modelApi/link/matchLink';
import {
    addLink,
    addSegment,
    ChangeSource,
    createContentModelDocument,
    createText,
    getSelectedSegments,
    mergeModel,
} from 'roosterjs-content-model-dom';
import type { ContentModelLink, IEditor } from 'roosterjs-content-model-types';

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
export function insertLink(
    editor: IEditor,
    link: string,
    anchorTitle?: string,
    displayText?: string,
    target?: string
) {
    editor.focus();

    const url = (checkXss(link) || '').trim();
    if (url) {
        const linkData = matchLink(url);
        const linkUrl = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        const links: ContentModelLink[] = [];
        let anchorNode: Node | undefined;

        editor.formatContentModel(
            (model, context) => {
                const segments = getSelectedSegments(
                    model,
                    false /*includingFormatHolder*/,
                    true /*mutate*/
                );

                const originalText = segments
                    .map(x => (x.segmentType == 'Text' ? x.text : ''))
                    .join('');
                const text = displayText || originalText || '';

                if (
                    (segments.some(x => x.segmentType != 'SelectionMarker') &&
                        originalText == text) ||
                    (segments.length == 1 && segments[0].segmentType == 'Image')
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
                        ...segments[0]?.format,
                        ...editor.getPendingFormat(),
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

                adjustTrailingSpaceSelection(model);
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
                apiName: 'insertLink',
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
