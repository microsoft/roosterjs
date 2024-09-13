import { getLinkUrl } from './getLinkUrl';
import { splitTextSegment } from 'roosterjs-content-model-api';
import type {
    ContentModelText,
    FormatContentModelContext,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLinkAfterSpace(
    previousSegment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext,
    autoLink: boolean,
    autoTel: boolean,
    autoMailto: boolean
) {
    const link = previousSegment.text.split(' ').pop();
    const url = link?.trim();
    let linkUrl: string | undefined = undefined;
    if (url && link && (linkUrl = getLinkUrl(url, autoLink, autoTel, autoMailto))) {
        const linkSegment = splitTextSegment(
            previousSegment,
            paragraph,
            previousSegment.text.length - link.trimLeft().length,
            previousSegment.text.trimRight().length
        );
        linkSegment.link = {
            format: {
                href: linkUrl,
                underline: true,
            },
            dataset: {},
        };

        context.canUndoByBackspace = true;

        return true;
    }
    return false;
}
