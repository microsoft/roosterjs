import { handleBlock } from '../handlers/handleBlock';
import { handleBlockGroupChildren } from '../handlers/handleBlockGroupChildren';
import { handleBr } from '../handlers/handleBr';
import { handleDivider } from '../handlers/handleDivider';
import { handleEntityBlock, handleEntitySegment } from '../handlers/handleEntity';
import { handleFormatContainer } from '../handlers/handleFormatContainer';
import { handleGeneralBlock, handleGeneralSegment } from '../handlers/handleGeneralModel';
import { handleImage } from '../handlers/handleImage';
import { handleList } from '../handlers/handleList';
import { handleListItem } from '../handlers/handleListItem';
import { handleParagraph } from '../handlers/handleParagraph';
import { handleSegment } from '../handlers/handleSegment';
import { handleSegmentDecorator } from '../handlers/handleSegmentDecorator';
import { handleTable } from '../handlers/handleTable';
import { handleText } from '../handlers/handleText';
import type { ContentModelHandlerMap } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const defaultContentModelHandlers: ContentModelHandlerMap = {
    block: handleBlock,
    blockGroupChildren: handleBlockGroupChildren,
    br: handleBr,
    entityBlock: handleEntityBlock,
    entitySegment: handleEntitySegment,
    generalBlock: handleGeneralBlock,
    generalSegment: handleGeneralSegment,
    divider: handleDivider,
    image: handleImage,
    list: handleList,
    listItem: handleListItem,
    paragraph: handleParagraph,
    formatContainer: handleFormatContainer,
    segment: handleSegment,
    segmentDecorator: handleSegmentDecorator,
    table: handleTable,
    text: handleText,
};
