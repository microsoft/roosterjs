import { ContentModelHandlerMap } from '../../publicTypes/context/ModelToDomSettings';
import { handleBlock } from '../handlers/handleBlock';
import { handleBlockGroup } from '../handlers/handleBlockGroup';
import { handleBlockGroupChildren } from '../handlers/handleBlockGroupChildren';
import { handleEntity } from '../handlers/handleEntity';
import { handleList } from '../handlers/handleList';
import { handleListItem } from '../handlers/handleListItem';
import { handleParagraph } from '../handlers/handleParagraph';
import { handleQuote } from '../handlers/handleQuote';
import { handleSegment } from '../handlers/handleSegment';
import { handleTable } from '../handlers/handleTable';

/**
 * @internal
 */
export const defaultContentModelHandlers: ContentModelHandlerMap = {
    block: handleBlock,
    blockGroup: handleBlockGroup,
    blockGroupChildren: handleBlockGroupChildren,
    entity: handleEntity,
    list: handleList,
    listItem: handleListItem,
    paragraph: handleParagraph,
    quote: handleQuote,
    segment: handleSegment,
    table: handleTable,
};
