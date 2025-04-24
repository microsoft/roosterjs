import * as React from 'react';
import { ApiPaneProps } from '../ApiPaneProps';
import { ContentModelFormatContainer } from 'roosterjs-content-model-types';
import { createFormatContainer } from 'roosterjs-content-model-dom';
import { createModelFromHtml } from 'roosterjs-content-model-core';

interface InsertCustomContainerPaneState {
    containers: ContentModelFormatContainer[];
}

const styles = require('./InsertCustomContainerPane.scss');

export default class InsertCustomContainerPane extends React.Component<
    ApiPaneProps,
    InsertCustomContainerPaneState
> {
    private html = React.createRef<HTMLTextAreaElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            containers: [],
        };
    }

    private insertCustomContainer() {
        const model = createModelFromHtml(this.html.current.value);
        const container = createFormatContainer('div');
        container.format;
    }

    render() {
        return (
            <>
                <div className={styles.blockContent}>
                    <label htmlFor="containerId"> Insert container Id:</label>
                    <input title="Container Id" id="containerId" type="text" />
                    <textarea
                        ref={this.html}
                        className={styles.textarea}
                        title="Custom Content"
                        name="Content"
                        id="customContent"></textarea>
                    <button type="button">Insert Custom Container</button>
                </div>

                <div className={styles.blockContent}>
                    <label htmlFor="containerId">Id:</label>
                    <input title="Container Id" id="containerId" type="text" />
                    <button type="button">Get Custom Container</button>
                    <label htmlFor="results"> Results:</label>
                    <span id="results"></span>
                </div>
            </>
        );
    }
}
