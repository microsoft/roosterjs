import * as React from 'react';
import { ContentModelLinkFormat } from 'roosterjs-content-model';
import { FormatView } from './FormatView';
import { LinkFormatRenderers } from './formatPart/LinkFormatRenderers';

export function LinkFormatView(props: { format: ContentModelLinkFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={LinkFormatRenderers} />;
}
