import getTagOfNode from '../../utils/getTagOfNode';
import runTestForNodeMethod from './runTestForNodeMethod';

describe('htmlTagOfNode()', () => {
    let testID = 'htmlTagOfNode';

    it('input = <div></div>', () => {
        runTest('<div></div>', 'DIV');
    });

    it('input = <p></p>', () => {
        runTest('<p></p>', 'P');
    });

    it('input = <br/>', () => {
        runTest('<br/>', 'BR');
    });

    it('input = <li></li>', () => {
        runTest('<li></li>', 'LI');
    });

    it('input = text', () => {
        runTest('text', '');
    });

    it('input = ""', () => {
        runTest('', '');
    });

    function runTest(input: string, output: string) {
        runTestForNodeMethod(input, output, getTagOfNode, testID);
    }
});
