import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { toggleModelBlockQuote } from '../../modelApi/block/toggleModelBlockQuote';

const DefaultQuoteFormat: ContentModelBlockFormat = {
    borderLeft: '3px solid rgb(200, 200, 200)', // TODO: Support RTL
};
const DefaultSegmentFormat: ContentModelSegmentFormat = {
    textColor: 'rgb(102, 102, 102)',
};
const BuildInQuoteFormat: ContentModelBlockFormat = {
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
 * @param segmentFormat @optional Segment format for the content of model
 */
export default function toggleBlockQuote(
    editor: IExperimentalContentModelEditor,
    quoteFormat: ContentModelBlockFormat = DefaultQuoteFormat,
    segmentFormat: ContentModelSegmentFormat = DefaultSegmentFormat
) {
    const fullQuoteFormat = {
        ...BuildInQuoteFormat,
        ...quoteFormat,
    };

    formatWithContentModel(editor, 'toggleBlockQuote', model =>
        toggleModelBlockQuote(model, fullQuoteFormat, segmentFormat)
    );
}
