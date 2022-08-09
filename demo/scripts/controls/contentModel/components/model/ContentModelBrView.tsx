import * as React from 'react';
import { ContentModelBr } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelBrView.scss');

export function ContentModelBrView(props: { br: ContentModelBr }) {
    const { br } = props;

    return (
        <ContentModelView
            title="BR"
            className={styles.modelBr}
            isSelected={br.isSelected}
            jsonSource={br}
        />
    );
}
