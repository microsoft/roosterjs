import { ContentModelHandlerMap } from '../../publicTypes/context/ModelToDomSettings';
import { handleBlock } from '../handlers/handleBlock';
import { handleBlockGroup } from '../handlers/handleBlockGroup';
import { handleBlockGroupChildren } from '../handlers/handleBlockGroupChildren';
import { handleBr } from '../handlers/handleBr';
import { handleCode } from '../handlers/handleCode';
import { handleEntity } from '../handlers/handleEntity';
import { handleGeneralModel } from '../handlers/handleGeneralModel';
import { handleHR } from '../handlers/handleHr';
import { handleImage } from '../handlers/handleImage';
import { handleList } from '../handlers/handleList';
import { handleListItem } from '../handlers/handleListItem';
import { handleParagraph } from '../handlers/handleParagraph';
import { handleQuote } from '../handlers/handleQuote';
import { handleSegment } from '../handlers/handleSegment';
import { handleTable } from '../handlers/handleTable';
import { handleText } from '../handlers/handleText';

/**
 * @internal
 */
export const defaultContentModelHandlers: ContentModelHandlerMap = {
    block: handleBlock,
    blockGroup: handleBlockGroup,
    blockGroupChildren: handleBlockGroupChildren,
    br: handleBr,
    code: handleCode,
    entity: handleEntity,
    general: handleGeneralModel,
    hr: handleHR,
    image: handleImage,
    list: handleList,
    listItem: handleListItem,
    paragraph: handleParagraph,
    quote: handleQuote,
    segment: handleSegment,
    table: handleTable,
    text: handleText,
};
