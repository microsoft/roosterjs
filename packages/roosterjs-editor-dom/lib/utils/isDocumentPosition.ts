import { DocumentPosition } from 'roosterjs-editor-types';

/**
 * Check if position is or encompasses any of targets
 * @param position The doucment position to check
 * @param targets The target position or position array
 */
export default function isDocumentPosition(
    position: DocumentPosition,
    targets: DocumentPosition | DocumentPosition[]
): boolean {
    targets = targets instanceof Array ? targets : [targets];
    return targets.some(
        target =>
            target == DocumentPosition.Same
                ? position == DocumentPosition.Same
                : (position & target) == target
    );
}
