import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelDocument, hasSelectionInBlock } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelDocumentView.scss');

export function ContentModelDocumentView(props: { doc: ContentModelDocument }) {
    const { doc } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={doc} />;
    }, [doc]);

    return (
        <ContentModelView
            title="Document"
            subTitle={doc.document.location.href}
            className={styles.modelDocument}
            hasSelection={hasSelectionInBlock(doc)}
            jsonSource={doc}
            getContent={getContent}
        />
    );
}
