import * as React from 'react';
import { ContentModelLink } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { LinkFormatView } from '../format/LinkFormatView';

const styles = require('./ContentModelLinkView.scss');

export function ContentModelLinkView(props: { link: ContentModelLink }) {
    const { link } = props;

    const getFormat = React.useCallback(() => {
        return <LinkFormatView format={link.format} />;
    }, [link.format]);

    return (
        <ContentModelView
            title="Link"
            subTitle={link.format.href}
            className={styles.modelLink}
            jsonSource={link}
            getFormat={getFormat}
        />
    );
}
