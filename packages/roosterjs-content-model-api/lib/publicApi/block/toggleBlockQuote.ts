import { toggleModelBlockQuote } from '../../modelApi/block/toggleModelBlockQuote';
import type {
    IEditor,
    ReadonlyContentModelFormatContainerFormat,
} from 'roosterjs-content-model-types';

const DefaultQuoteFormatLtr: ReadonlyContentModelFormatContainerFormat = {
    borderLeft: '3px solid rgb(200, 200, 200)',
    textColor: 'rgb(102, 102, 102)',
};
const DefaultQuoteFormatRtl: ReadonlyContentModelFormatContainerFormat = {
    borderRight: '3px solid rgb(200, 200, 200)',
    textColor: 'rgb(102, 102, 102)',
};
const BuildInQuoteFormat: ReadonlyContentModelFormatContainerFormat = {
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '40px',
    marginRight: '40px',
};

/**
 * Toggle BLOCKQUOTE state of selected paragraphs.
 * If any selected paragraph is not under a BLOCKQUOTE, wrap them into a BLOCKQUOTE.
 * Otherwise, unwrap all related BLOCKQUOTEs.
 * @param editor The editor object to toggle BLOCKQUOTE onto
 * @param quoteFormat @optional Block format for the new quote object
 */
export function toggleBlockQuote(
    editor: IEditor,
    quoteFormat?: ReadonlyContentModelFormatContainerFormat,
    quoteFormatRtl?: ReadonlyContentModelFormatContainerFormat
) {
    const fullQuoteFormatLtr: ReadonlyContentModelFormatContainerFormat = {
        ...BuildInQuoteFormat,
        paddingLeft: '10px',
        ...(quoteFormat ?? DefaultQuoteFormatLtr),
    };
    const fullQuoteFormatRtl: ReadonlyContentModelFormatContainerFormat = {
        ...BuildInQuoteFormat,
        paddingRight: '10px',
        direction: 'rtl',
        ...(quoteFormatRtl ?? quoteFormat ?? DefaultQuoteFormatRtl),
    };

    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            context.newPendingFormat = 'preserve';

            return toggleModelBlockQuote(model, fullQuoteFormatLtr, fullQuoteFormatRtl);
        },
        {
            apiName: 'toggleBlockQuote',
        }
    );
}
