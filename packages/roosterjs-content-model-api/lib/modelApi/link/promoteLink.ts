import { getLinkUrl } from './getLinkUrl';
import { splitTextSegment } from 'roosterjs-content-model-api';
import type {
    AutoLinkOptions,
    ContentModelText,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Promote the given text segment to a hyper link when the segment text is ending with a valid link format.
 * When the whole text segment if of a link, promote the whole segment.
 * When the text segment ends with a link format, split the segment and promote the second part
 * When link is in middle of the text segment, no action.
 * This is mainly used for doing auto link when there is a link before cursor
 * @param segment The text segment to search link text from
 * @param paragraph Parent paragraph of the segment
 * @param options Options of auto link
 * @returns If a link is promoted, return this segment. Otherwise return null
 */
export function promoteLink(
    segment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    autoLinkOptions: AutoLinkOptions
): ContentModelText | null {
    const link = segment.text.split(' ').pop();
    const url = link?.trim();
    let linkUrl: string | undefined = undefined;

    if (url && link && (linkUrl = getLinkUrl(url, autoLinkOptions))) {
        const linkSegment = splitTextSegment(
            segment,
            paragraph,
            segment.text.length - link.trimLeft().length,
            segment.text.trimRight().length
        );
        linkSegment.link = {
            format: {
                href: linkUrl,
                underline: true,
            },
            dataset: {},
        };

        return linkSegment;
    }

    return null;
}
