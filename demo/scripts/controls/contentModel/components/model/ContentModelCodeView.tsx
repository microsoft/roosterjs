import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelCode, hasSelectionInBlock } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelCodeView.scss');

export function ContentModelCodeView(props: { code: ContentModelCode }) {
    const { code } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={code} />;
    }, [code]);

    const getFormat = React.useCallback(() => {
        return <BlockFormatView format={code.format} />;
    }, [code.format]);

    return (
        <ContentModelView
            title="Code"
            className={styles.modelCode}
            hasSelection={hasSelectionInBlock(code)}
            jsonSource={code}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
