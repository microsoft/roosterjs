import * as DomTestHelper from '../DomTestHelper';
import unwrap from '../../utils/unwrap';

describe('EditorUitls unwrap()', () => {
    let testID = 'unwrap';

    it('node = null', () => {
        let result = unwrap(null);
        expect(result).toBeNull();
    });

    it('node = disconnected <p></p>', () => {
        let node = document.createElement('p');
        let result = unwrap(node);
        expect(result).toBeNull();
    });

    it('node = <p><br></p>', () => {
        runTest('<p><br></p>', '<br>');
    });

    it('node = <a href="www.bing.com">BING</a>', () => {
        runTest('<a href="www.bing.com">BING</a>', 'BING');
    });

    it('node = <a href="www.bing.com"><span>BING</span><span>BING</span></a>', () => {
        runTest(
            '<a href="www.bing.com"><span>BING</span><span>BING</span></a>',
            '<span>BING</span><span>BING</span>'
        );
    });

    it('node = <a href="www.bing.com">BING</a><a href="www.microsoft.com">MICROSOFT</a>', () => {
        runTest(
            '<a href="www.bing.com">BING</a><a href="www.microsoft.com">MICROSOFT</a>',
            'BING<a href="www.microsoft.com">MICROSOFT</a>'
        );
    });

    function runTest(input: string, output: string) {
        let wrapper = DomTestHelper.createElementFromContent(testID, input).firstChild;
        let result = unwrap(wrapper) as HTMLElement;

        // After unwrap, wrapper should be disconntected and has its parentNode to be null
        expect(wrapper.parentNode).toBeNull();
        expect(result).not.toBe(null);
        expect(result.innerHTML).toBe(output);
        DomTestHelper.removeElement(testID);
    }
});
