import { addLink } from '../../modelApi/common/addLink';
import { addSegment } from '../../modelApi/common/addSegment';
import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { ContentModelLink } from '../../publicTypes/decorator/ContentModelLink';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../../modelApi/creators/createContentModelDocument';
import { createText } from '../../modelApi/creators/createText';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { HtmlSanitizer, matchLink } from 'roosterjs-editor-dom';
import { HyperLinkColorPlaceholder } from '../../formatHandlers/utils/defaultStyles';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { setSelection } from '../../modelApi/selection/setSelection';
import {
    getSelectedParagraphs,
    getSelectedSegments,
} from '../../modelApi/selection/collectSelections';

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
        let normalizedUrl = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        let originalUrl = linkData ? linkData.originalUrl : url;

        formatWithContentModel(editor, 'insertLink', model => {
            const paragraphs = getSelectedParagraphs(model);
            let first: ContentModelSegment | undefined;
            let last: ContentModelSegment | undefined;
            let isStopped = false;

            paragraphs.forEach(p => {
                let index: number;

                if (!first) {
                    index = p.segments.findIndex(x => x.isSelected && !!x.link);
                    first = p.segments[index];
                    let isThisStopped = false;

                    for (; !isThisStopped && index >= 0; index--) {
                        const segment = p.segments[index];
                        if (
                            segment.link &&
                            areSameFormats(first.link!.format, segment.link.format)
                        ) {
                            first = segment;
                        } else {
                            isThisStopped = true;
                        }
                    }
                } else {
                    index = 0;
                }

                if (first && index >= 0) {
                    for (; !isStopped && index < p.segments.length; index++) {
                        const segment = p.segments[index];
                        if (
                            segment.link &&
                            areSameFormats(first.link!.format, segment.link.format)
                        ) {
                            last = segment;
                        } else {
                            isStopped = true;
                        }
                    }
                }
            });

            if (first && last) {
                setSelection(model, first, last);
            }

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
