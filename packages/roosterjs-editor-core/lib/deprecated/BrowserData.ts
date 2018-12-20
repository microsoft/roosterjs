import { Browser, getBrowserInfo } from 'roosterjs-editor-dom';
import { BrowserInfo } from 'roosterjs-editor-types';

/**
 * @deprecated
 */
const browserData = Browser;
const getBrowserData = getBrowserInfo;
type BrowserData = BrowserInfo;

export default browserData;
export { BrowserData, getBrowserData };
