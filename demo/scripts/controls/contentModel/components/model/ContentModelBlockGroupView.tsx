import * as React from 'react';
import { ContentModelBlockGroup, ContentModelFormatContainer } from 'roosterjs-content-model';
import { ContentModelDocumentView } from './ContentModelDocumentView';
import { ContentModelGeneralView } from './ContentModelGeneralView';
import { ContentModelListItemView } from './ContentModelListItemView';
import { ContentModelQuoteView } from './ContentModelQuoteView';
import { ContentModelTableCellView } from './ContentModelTableCellView';

export function ContentModelBlockGroupView(props: { group: ContentModelBlockGroup }) {
    const { group } = props;

    switch (group.blockGroupType) {
        case 'Document':
            return <ContentModelDocumentView doc={group} />;

        case 'General':
            return <ContentModelGeneralView model={group} />;

        case 'ListItem':
            return <ContentModelListItemView listItem={group} />;

        case 'FormatContainer':
            return <ContentModelFormatContainerView formatContainer={group} />;

        case 'TableCell':
            return <ContentModelTableCellView cell={group} />;
    }
}

function ContentModelFormatContainerView(props: { formatContainer: ContentModelFormatContainer }) {
    const { formatContainer } = props;

    switch (formatContainer.tagName) {
        case 'blockquote':
            return <ContentModelQuoteView quote={formatContainer} />;
    }
}
