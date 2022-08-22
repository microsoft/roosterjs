import * as React from 'react';
import { ContentModelBlock, ContentModelBlockType } from 'roosterjs-content-model';
import { ContentModelBlockGroupView } from './ContentModelBlockGroupView';
import { ContentModelParagraphView } from './ContentModelParagraphView';
import { ContentModelTableView } from './ContentModelTableView';

export function ContentModelBlockView(props: { block: ContentModelBlock }) {
    const { block } = props;

    switch (block.blockType) {
        case ContentModelBlockType.BlockGroup:
            return <ContentModelBlockGroupView group={block} />;

        case ContentModelBlockType.Paragraph:
            return <ContentModelParagraphView paragraph={block} />;

        case ContentModelBlockType.Table:
            return <ContentModelTableView table={block} />;
    }
}
