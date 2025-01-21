import { ClipboardData, DOMCreator } from 'roosterjs-content-model-types';
import { validateExcelFragment } from '../../lib/paste/Excel/processPastedContentFromExcel';

describe('validateExcelFragment', () => {
    let domCreator: DOMCreator;
    let fragment: DocumentFragment;
    let clipboardData: ClipboardData;
    let htmlToDomSpy: jasmine.Spy;

    beforeEach(() => {
        htmlToDomSpy = jasmine.createSpy();
        htmlToDomSpy.and.callFake((html: string) => {
            return new DOMParser().parseFromString(html, 'text/html');
        });

        domCreator = {
            htmlToDOM: htmlToDomSpy,
        };
        fragment = document.createDocumentFragment();
        clipboardData = {
            html: '',
        } as ClipboardData;
    });

    it('should replace fragment with new fragment containing table from combined htmlBefore, clipboardData.html, and htmlAfter', () => {
        const htmlBefore = '<table>';
        const htmlAfter = '</table>';
        clipboardData.html = '<tr><td>Test</td></tr></table>';

        validateExcelFragment(fragment, domCreator, htmlBefore, clipboardData, htmlAfter);

        expect(fragment.querySelector('table')).not.toBeNull();
        expect(domCreator.htmlToDOM).toHaveBeenCalledWith(
            htmlBefore + clipboardData.html + htmlAfter
        );
    });

    it('should use excelHandler to extract table from clipboard data if not found initially', () => {
        const htmlBefore = '';
        const htmlAfter = '';
        clipboardData.html = '<tr><td>Test</td></tr>';

        validateExcelFragment(fragment, domCreator, htmlBefore, clipboardData, htmlAfter);

        expect(fragment.querySelector('table')).not.toBeNull();
        expect(domCreator.htmlToDOM).toHaveBeenCalledTimes(2);
    });
});
