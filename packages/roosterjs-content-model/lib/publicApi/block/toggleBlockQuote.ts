import { ContentModelFormatContainerFormat } from '../../publicTypes/format/ContentModelFormatContainerFormat';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { toggleModelBlockQuote } from '../../modelApi/block/toggleModelBlockQuote';

const DefaultQuoteFormat: ContentModelFormatContainerFormat = {
    borderLeft: '3px solid rgb(200, 200, 200)', // TODO: Support RTL
    textColor: 'rgb(102, 102, 102)',
};
const BuildInQuoteFormat: ContentModelFormatContainerFormat = {
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '40px',
    marginRight: '40px',
    paddingLeft: '10px',
};

/**
 * Toggle BLOCKQUOTE state of selected paragraphs.
 * If any selected paragraph is not under a BLOCKQUOTE, wrap them into a BLOCKQUOTE.
 * Otherwise, unwrap all related BLOCKQUOTEs.
 * @param editor The editor object to toggle BLOCKQUOTE onto
 * @param quoteFormat @optional Block format for the new quote object
 */
export default function toggleBlockQuote(
    editor: IContentModelEditor,
    quoteFormat: ContentModelFormatContainerFormat = DefaultQuoteFormat
) {
    const fullQuoteFormat = {
        ...BuildInQuoteFormat,
        ...quoteFormat,
    };

    formatWithContentModel(
        editor,
        'toggleBlockQuote',
        model => toggleModelBlockQuote(model, fullQuoteFormat),
        {
            preservePendingFormat: true,
        }
    );
}
