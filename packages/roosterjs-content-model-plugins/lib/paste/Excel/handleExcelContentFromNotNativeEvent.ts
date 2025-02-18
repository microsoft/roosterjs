import { setupExcelTableHandlers } from './setupExcelTableHandlers';
import type { BeforePasteEvent } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function handleExcelContentFromNotNativeEvent(
    event: BeforePasteEvent,
    allowExcelNoBorderTable: boolean
) {
    setupExcelTableHandlers(event, allowExcelNoBorderTable, false /* handleForNativeEvent */);
}
