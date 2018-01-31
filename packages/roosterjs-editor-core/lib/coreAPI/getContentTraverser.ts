import EditorCore from '../editor/EditorCore';
import getLiveSelectionRange from './getLiveSelectionRange';
import { ContentScope, ContentPosition, TraversingScoper } from 'roosterjs-editor-types';
import {
    ContentTraverser,
    SelectionBlockScoper,
    SelectionScoper,
    BodyScoper,
} from 'roosterjs-editor-dom';

export default function getContentTraverser(
    core: EditorCore,
    scope: ContentScope,
    position: ContentPosition = ContentPosition.SelectionStart
): ContentTraverser {
    let selectionRange = getLiveSelectionRange(core) || core.cachedSelectionRange;
    if (scope != ContentScope.Body && !selectionRange) {
        return null;
    }

    let contentTraverser: ContentTraverser;
    let scoper: TraversingScoper;
    switch (scope) {
        case ContentScope.Block:
            scoper = new SelectionBlockScoper(
                core.contentDiv,
                selectionRange.rawRange,
                position,
                core.inlineElementFactory
            );
            break;
        case ContentScope.Selection:
            scoper = new SelectionScoper(
                core.contentDiv,
                selectionRange.rawRange,
                core.inlineElementFactory
            );
            break;
        case ContentScope.Body:
            scoper = new BodyScoper(core.contentDiv, core.inlineElementFactory);
            break;
    }

    if (scoper) {
        contentTraverser = new ContentTraverser(core.contentDiv, scoper, core.inlineElementFactory);
    }

    return contentTraverser;
}
