import { attachDomEvent } from './attachDomEvent';
import { ensureTypeInContainer } from './ensureTypeInContainer';
import { getContent } from './getContent';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
import { insertNode } from './insertNode';
import { setContent } from './setContent';
import { transformColor } from './transformColor';
import { triggerEvent } from './triggerEvent';
import type { UnportedCoreApiMap } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const coreApiMap: UnportedCoreApiMap = {
    attachDomEvent,
    ensureTypeInContainer,
    getContent,
    getStyleBasedFormatState,
    insertNode,
    setContent,
    transformColor,
    triggerEvent,
};
