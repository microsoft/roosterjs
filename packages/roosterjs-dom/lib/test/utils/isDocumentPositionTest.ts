import * as DomTestHelper from '../DomTestHelper';
import isDocumentPosition from '../../utils/isDocumentPosition';
import { DocumentPosition } from 'roosterjs-types';

describe('isDocumentPosition()', () => {
    it('completeDocumentPosition=Same, documentPosition=Same', () => {
        runTest(DocumentPosition.Same, DocumentPosition.Same, true);
    });

    it('completeDocumentPosition=Following|Preceding, documentPosition=Preceding', () => {
        runTest(
            DocumentPosition.Following | DocumentPosition.Preceding,
            DocumentPosition.Preceding,
            true
        );
    });

    it('completeDocumentPosition=Following|Preceding, documentPosition=Same', () => {
        runTest(
            DocumentPosition.Following | DocumentPosition.Preceding,
            DocumentPosition.Same,
            false
        );
    });

    function runTest(
        completeDocumentPosition: DocumentPosition,
        documentPosition: DocumentPosition,
        output: boolean
    ) {
        DomTestHelper.runTestMethod2(
            [completeDocumentPosition, documentPosition],
            output,
            isDocumentPosition
        );
    }
});
