import * as React from 'react';
import { ContentModelBlock } from 'roosterjs-content-model';
import { ContentModelBlockGroupView } from './ContentModelBlockGroupView';
import { ContentModelDividerView } from './ContentModelDividerView';
import { ContentModelEntityView } from './ContentModelEntityView';
import { ContentModelParagraphView } from './ContentModelParagraphView';
import { ContentModelTableView } from './ContentModelTableView';

export function ContentModelBlockView(props: { block: ContentModelBlock }) {
    const { block } = props;

    switch (block.blockType) {
        case 'BlockGroup':
            return <ContentModelBlockGroupView group={block} />;

        case 'Paragraph':
            return <ContentModelParagraphView paragraph={block} />;

        case 'Table':
            return <ContentModelTableView table={block} />;

        case 'Entity':
            return <ContentModelEntityView entity={block} />;

        case 'Divider':
            return <ContentModelDividerView divider={block} />;
    }
}
