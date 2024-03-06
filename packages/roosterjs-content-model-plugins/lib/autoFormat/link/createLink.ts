import { addLink } from 'roosterjs-content-model-dom';
import { getLinkSegment } from './getLinkSegment';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor) {
    editor.formatContentModel(model => {
        const link = getLinkSegment(model);
        if (link && !link.link) {
            addLink(link, {
                format: {
                    href: link.text,
                    underline: true,
                },
                dataset: {},
            });

            return true;
        }

        return false;
    });
}
