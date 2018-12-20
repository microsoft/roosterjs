import * as DomTestHelper from '../DomTestHelper';
import isVoidHtmlElement from '../../utils/isVoidHtmlElement';

describe('isVoidHtmlElement()', () => {
    let testID = 'isVoidHtmlElement';

    it('element = null', () => {
        let result = isVoidHtmlElement(null);
        expect(result).toBe(false);
    });

    it('element = <area shape="rect" coords="0,0,82,126" href="sun.htm" alt="Sun">', () => {
        runTest('<area shape="rect" coords="0,0,82,126" href="sun.htm" alt="Sun">', true);
    });

    it('element = <base href="" target="_blank">', () => {
        runTest('<base href="" target="_blank">', true);
    });

    it('element = <br/>', () => {
        runTest('<br/>', true);
    });

    it('element = <col span="1" style="background-color:red">', () => {
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<table><colgroup><col span="1" style="background-color:red"></colgroup><tr><td>3476896</td></tr></table>'
        );
        DomTestHelper.runTestMethod1(
            testDiv.firstChild.firstChild.firstChild as HTMLElement,
            true,
            isVoidHtmlElement
        );
        DomTestHelper.removeElement(testID);
    });

    it('element = <command/>', () => {
        runTest('<command/>', true);
    });

    it('element = <embed src="">', () => {
        runTest('<embed src="">', true);
    });

    it('element = <hr>', () => {
        runTest('<hr>', true);
    });

    it('element = <img src="" alt="Smiley face" height="42" width="42">', () => {
        runTest('<img src="" alt="Smiley face" height="42" width="42">', true);
    });

    it('element = <input type="submit" value="Submit">', () => {
        runTest('<input type="submit" value="Submit">', true);
    });

    it('element = <keygen name="security">', () => {
        runTest('<keygen name="security">', true);
    });

    it('element = <link rel="stylesheet" type="text/css" href="">', () => {
        runTest('<link rel="stylesheet" type="text/css" href="">', true);
    });

    it('element = <meta charset="UTF-8">', () => {
        runTest('<meta charset="UTF-8">', true);
    });

    it('element = <param name="autoplay" value="true">', () => {
        runTest('<param name="autoplay" value="true">', true);
    });

    it('element = <source src="horse.ogg" type="audio/ogg">', () => {
        runTest('<source src="horse.ogg" type="audio/ogg">', true);
    });

    it('element = <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">', () => {
        runTest(
            '<track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">',
            true
        );
    });

    it('element = <wbr>', () => {
        runTest('<wbr>', true);
    });

    it('element = <div></div>', () => {
        runTest('<div></div>', false);
    });

    it('element = <p></p>', () => {
        runTest('<p></p>', false);
    });

    function runTest(input: string, output: boolean) {
        DomTestHelper.runTestMethod1(
            DomTestHelper.createElementFromContent(testID, input).children.item(0) as HTMLElement,
            output,
            isVoidHtmlElement
        );
        DomTestHelper.removeElement(testID);
    }
});
