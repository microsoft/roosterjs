import { WAC_IDENTIFY_SELECTOR } from '../WacComponents/constants';
import type { GetSourceFunction } from './getPasteSource';

/**
 * @internal
 * Check whether the fragment provided contain Wac Elements
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const documentContainWacElements: GetSourceFunction = props => {
    const { fragment } = props;
    return !!fragment.querySelector(WAC_IDENTIFY_SELECTOR);
};
