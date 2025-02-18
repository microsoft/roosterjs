import * as addParserFile from '../../../lib/paste/utils/addParser';
import * as setProcessorFile from '../../../lib/paste/utils/setProcessor';
import * as setupExcelTableHandlersFile from '../../../lib/paste/Excel/setupExcelTableHandlers';
import { BeforePasteEvent } from 'roosterjs-content-model-types';
import { handleExcelContentFromNotNativeEvent } from '../../../lib/paste/Excel/handleExcelContentFromNotNativeEvent';

describe('handleExcelContentFromNotNativeEvent', () => {
    beforeEach(() => {
        spyOn(setupExcelTableHandlersFile, 'setupExcelTableHandlers').and.callThrough();
        spyOn(addParserFile, 'addParser').and.callFake(() => {});
        spyOn(setProcessorFile, 'setProcessor').and.callFake(() => {});
    });

    it('should handle Excel content from non-native event', () => {
        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        fragment.appendChild(table);

        const event: BeforePasteEvent = {
            fragment,
            clipboardData: {
                types: ['web data/shadow-workbook'],
            } as any,
        } as any;

        const allowExcelNoBorderTable = true;

        handleExcelContentFromNotNativeEvent(event, allowExcelNoBorderTable);

        expect(setupExcelTableHandlersFile.setupExcelTableHandlers).toHaveBeenCalledWith(
            event,
            allowExcelNoBorderTable,
            false /* handleForNativeEvent */
        );
        expect(setProcessorFile.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserFile.addParser).toHaveBeenCalledTimes(1);
    });
});
