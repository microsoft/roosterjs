import { addLink } from '../../modelApi/common/addLink';
import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelLink } from '../../publicTypes/decorator/ContentModelLink';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../../modelApi/creators/createContentModelDocument';
import { createText } from '../../modelApi/creators/createText';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { HtmlSanitizer, matchLink } from 'roosterjs-editor-dom';
import { HyperLinkColorPlaceholder } from '../../formatHandlers/utils/defaultStyles';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';

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
 * @param altText Optional alt text of the link, will be shown when hover on the link
 * @param displayText Optional display text for the link.
 * @param target Optional display target for the link ("_blank"|"_self"|"_parent"|"_top"|"{framename}")
 * If specified, the display text of link will be replaced with this text.
 * If not specified and there wasn't a link, the link url will be used as display text.
 */
export default function insertLink(
    editor: IExperimentalContentModelEditor,
    link: string,
    altText?: string,
    displayText?: string,
    target?: string
) {
    let url = (checkXss(link) || '').trim();
    if (url) {
        let linkData = matchLink(url);

        // matchLink can match most links, but not all, i.e. if you pass link a link as "abc", it won't match
        // we know in that case, users will want to insert a link like http://abc
        // so we have separate logic in applyLinkPrefix to add link prefix depending on the format of the link
        // i.e. if the link starts with something like abc@xxx, we will add mailto: prefix
        // if the link starts with ftp.xxx, we will add ftp:// link. For more, see applyLinkPrefix
        let normalizedUrl = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        let originalUrl = linkData ? linkData.originalUrl : url;

        formatWithContentModel(editor, 'insertLink', model => {
            const segments = getSelectedSegments(model, false /*includingFormatHolder*/);
            const originalText = segments
                .map(x => (x.segmentType == 'Text' ? x.text : ''))
                .join('');
            const link: ContentModelLink = {
                dataset: {},
                format: {
                    href: normalizedUrl,
                    anchorTitle: altText,
                    target: target,
                },
            };

            if (
                segments.every(x => x.segmentType == 'SelectionMarker') ||
                (!!displayText && displayText != originalText)
            ) {
                const segment = createText(displayText || originalUrl, segments[0]?.format);
                const doc = createContentModelDocument();

                addLink(segment, link);
                addSegment(doc, segment);
                updateLinkSegmentFormat(segment.format);

                mergeModel(model, doc);
            } else if (displayText == originalText || !displayText) {
                segments.forEach(x => {
                    addLink(x, link);
                    updateLinkSegmentFormat(x.format);
                });
            }

            return true;
        });
    }
}

function updateLinkSegmentFormat(format: ContentModelSegmentFormat) {
    format.underline = true;
    format.textColor = HyperLinkColorPlaceholder;
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

function checkXss(link: string): string {
    const sanitizer = new HtmlSanitizer();
    const a = document.createElement('a');

    a.href = link || '';

    // TODO: No need to use HtmlSanitizer here
    sanitizer.sanitize(a);
    // We use getAttribute because some browsers will try to make the href property a valid link.
    // This has unintended side effects when the link lacks a protocol.
    return a.getAttribute('href') || '';
}
