import * as DomTestHelper from '../DomTestHelper';
import isBlockElement from '../../utils/isBlockElement';
import runTestForNodeMethod from './runTestForNodeMethod';

describe('isBlockElement()', () => {
    let testID = 'isBlockElement';

    it('input = ""', () => {
        runTest('', false);
    });

    it('input = <div></div>', () => {
        runTest('<div></div>', true);
    });

    it('input = <p></p>', () => {
        runTest('<p></p>', true);
    });

    it('input = <li></li>', () => {
        runTest('<li></li>', true);
    });

    it('input = <table><tr><td></td></tr></table>', () => {
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<table><tr><td></td></tr></table>'
        );

        DomTestHelper.runTestMethod1(testDiv.querySelector('td'), true, isBlockElement);

        DomTestHelper.removeElement(testID);
    });

    it('input = <br/>', () => {
        runTest('<br/>', false);
    });

    it('input = text', () => {
        runTest('text', false);
    });

    function runTest(input: string, output: boolean) {
        runTestForNodeMethod(input, output, isBlockElement, testID);
    }
});
