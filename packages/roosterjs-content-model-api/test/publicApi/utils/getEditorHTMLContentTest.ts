import * as transformColor from '../../../../roosterjs-content-model-dom/lib/domUtils/style/transformColor';
import { getEditorHTMLContent } from '../../../lib/publicApi/utils/getEditorHTMLContent';

describe('getEditorHTMLContent', () => {
    function runTest(isDarkMode: boolean) {
        const clonedRoot = document.createElement('div');
        clonedRoot.innerHTML = 'test';
        const getClonedRootSpy = jasmine.createSpy('getClonedRoot').and.returnValue(clonedRoot);
        const isDarkModeSpy = jasmine.createSpy('isDarkMode').and.returnValue(isDarkMode);
        const getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({
            getClonedRoot: getClonedRootSpy,
        });
        const triggerEventSpy = jasmine.createSpy('triggerEvent');
        const transformColorSpy = spyOn(transformColor, 'transformColor');
        const getColorManagerSpy = jasmine.createSpy('getColorManager');

        const editor = {
            getDOMHelper: getDOMHelperSpy,
            isDarkMode: isDarkModeSpy,
            triggerEvent: triggerEventSpy,
            getColorManager: getColorManagerSpy,
        } as any;

        const result = getEditorHTMLContent(editor);
        expect(isDarkModeSpy).toHaveBeenCalled();
        expect(triggerEventSpy).toHaveBeenCalledWith('extractContentWithDom', { clonedRoot }, true);
        if (isDarkMode) {
            expect(transformColorSpy).toHaveBeenCalledWith(
                clonedRoot,
                false /*includeSelf*/,
                'darkToLight',
                editor.getColorManager()
            );
        } else {
            expect(transformColorSpy).not.toHaveBeenCalled();
        }

        expect(result).toBe('test');
    }

    it('should return the inner HTML content of the editor in dark mode', () => {
        runTest(true);
    });

    it('should return the inner HTML content of the editor in light mode', () => {
        runTest(false);
    });
});
