import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelView } from '../ContentModelView';
import { hasSelectionInBlockGroup } from 'roosterjs-content-model-editor';

const styles = require('./ContentModelDocumentView.scss');

export function ContentModelDocumentView(props: { doc: ContentModelDocument }) {
    const { doc } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={doc} />;
    }, [doc]);

    return (
        <ContentModelView
            title="Document"
            className={styles.modelDocument}
            hasSelection={hasSelectionInBlockGroup(doc)}
            jsonSource={doc}
            getContent={getContent}
        />
    );
}
