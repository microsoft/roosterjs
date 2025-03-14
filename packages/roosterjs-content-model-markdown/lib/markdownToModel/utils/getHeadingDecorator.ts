import { headingLevels } from '../../constants/headings';
import type { ContentModelParagraphDecorator } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getHeadingDecorator(text: string): ContentModelParagraphDecorator | undefined {
    for (const level of headingLevels) {
        if (text.startsWith(level.prefix)) {
            return {
                tagName: level.tagName,
                format: {
                    fontWeight: 'bold',
                    fontSize: level.fontSize,
                },
            };
        }
    }

    return undefined;
}
