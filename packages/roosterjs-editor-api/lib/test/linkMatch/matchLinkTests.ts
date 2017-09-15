import RegExLinkMatchRule from '../../linkMatch/RegExLinkMatchRule';
import matchLink from '../../linkMatch/matchLink';
import { LinkMatchOption } from 'roosterjs-editor-types';

describe('matchLink', () => {
    it('exclude override test', () => {
        let regexRule = new RegExLinkMatchRule('http', 'http' + '://', /http:\/\/\S+|www\.\S+/i);

        // Spyon on exclude to return true
        spyOn(regexRule, 'exclude').and.returnValue(true);

        let linkData = matchLink('www.bing.com', LinkMatchOption.Exact, [regexRule]);
        expect(linkData).toBeNull();
    });
});
