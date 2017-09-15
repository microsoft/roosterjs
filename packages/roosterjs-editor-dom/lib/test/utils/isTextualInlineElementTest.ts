import * as DomTestHelper from '../DomTestHelper';
import PartialInlineElement from '../../inlineElements/PartialInlineElement';
import TextInlineElement from '../../inlineElements/TextInlineElement';
import isTextualInlineElement from '../../utils/isTextualInlineElement';
import { InlineElement } from 'roosterjs-editor-types';

describe('isTextualInlineElement()', () => {
    it('input = null', () => {
        runTest(null, false);
    });

    it('input = <TextInlineElement>', () => {
        runTest(new TextInlineElement(null, null, null, null), true);
    });

    it('input = <PartialInlineElement>{}', () => {
        runTest(new PartialInlineElement(<InlineElement>{}), false);
    });

    it('input = PartialInlineElement with TextInlineElement as decoratedInline', () => {
        let mockInlineElement = new PartialInlineElement(
            new TextInlineElement(null, null, null, null)
        );
        runTest(mockInlineElement, true);
    });

    function runTest(input: InlineElement, output: boolean) {
        DomTestHelper.runTestMethod1(input, output, isTextualInlineElement);
    }
});
