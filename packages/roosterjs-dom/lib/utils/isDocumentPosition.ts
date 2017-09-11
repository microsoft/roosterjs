import { DocumentPosition } from 'roosterjs-types';

// Check if completeDocumentPosition is or encompasses documentPosition
export default function isDocumentPosition(
    completeDocumentPosition: DocumentPosition,
    documentPosition: DocumentPosition
): boolean {
    return documentPosition == DocumentPosition.Same
        ? completeDocumentPosition == DocumentPosition.Same
        : (completeDocumentPosition & documentPosition) == documentPosition;
}
