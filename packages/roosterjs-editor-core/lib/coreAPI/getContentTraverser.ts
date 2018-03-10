import EditorCore from '../editor/EditorCore';
import getLiveRange from './getLiveRange';
import { ContentScope, ContentPosition } from 'roosterjs-editor-types';
import {
    ContentTraverser,
    SelectionBlockScoper,
    SelectionScoper,
    BodyScoper,
    SelectionRange,
    TraversingScoper,
} from 'roosterjs-editor-dom';

export default function getContentTraverser(
    core: EditorCore,
    scope: ContentScope,
    position: ContentPosition = ContentPosition.SelectionStart
): ContentTraverser {
    let range = getLiveRange(core) || core.cachedRange;
    if (scope != ContentScope.Body && !range) {
        return null;
    }

    let contentTraverser: ContentTraverser;
    let scoper: TraversingScoper;
    switch (scope) {
        case ContentScope.Block:
            scoper = new SelectionBlockScoper(core.contentDiv, new SelectionRange(range), position);
            break;
        case ContentScope.Selection:
            scoper = new SelectionScoper(core.contentDiv, new SelectionRange(range));
            break;
        case ContentScope.Body:
            scoper = new BodyScoper(core.contentDiv);
            break;
    }

    if (scoper) {
        contentTraverser = new ContentTraverser(core.contentDiv, scoper);
    }

    return contentTraverser;
}
