import * as React from 'react';
import { ApiPaneProps } from '../ApiPaneProps';
import { createFormatContainer, mergeModel } from 'roosterjs-content-model-dom';
import { createModelFromHtml } from 'roosterjs-content-model-core';
import { trustedHTMLHandler } from '../../../../utils/trustedHTMLHandler';
import {
    ContentModelDocument,
    ContentModelFormatContainer,
    IEditor,
} from 'roosterjs-content-model-types';

interface InsertCustomContainerPaneState {
    containers: {
        [id: string]: ContentModelFormatContainer;
    };
}

const styles = require('./InsertCustomContainerPane.scss');

export default class InsertCustomContainerPane extends React.Component<
    ApiPaneProps,
    InsertCustomContainerPaneState
> {
    public html = React.createRef<HTMLTextAreaElement>();
    private containerId = React.createRef<HTMLInputElement>();
    private searchId = React.createRef<HTMLInputElement>();
    private result = React.createRef<HTMLParagraphElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            containers: {},
        };
    }

    private insertCustomContainer = () => {
        const model = createModelFromHtml(this.html.current.value, undefined, trustedHTMLHandler);
        const container = createFormatContainer('div');
        const containerId = this.containerId.current.value;
        container.format.id = containerId;
        container.blocks = [...model.blocks];
        this.state.containers[containerId] = container;
        model.blocks = [container];
        const editor = this.props.getEditor();
        insertContainer(editor, model);
    };

    private getCustomContainer = () => {
        const id = this.searchId.current.value;
        const container = this.state.containers[id];
        if (container) {
            this.result.current.innerText = JSON.stringify(container);
        } else {
            this.result.current.innerText = 'No container found';
        }
    };

    render() {
        return (
            <>
                <div className={styles.blockContent}>
                    <label htmlFor="containerId"> Insert container</label>
                    <input
                        ref={this.containerId}
                        title="Container Id"
                        id="containerId"
                        type="text"
                        placeholder="Container Id"
                    />
                    <textarea
                        ref={this.html}
                        className={styles.textarea}
                        title="Custom Content"
                        name="Content"
                        id="customContent"
                        placeholder="Insert HTML Content"></textarea>
                    <button onClick={this.insertCustomContainer} type="button">
                        Insert container
                    </button>
                </div>

                <div className={styles.blockContent}>
                    <label htmlFor="containerId">Id:</label>
                    <input ref={this.searchId} title="Container Id" id="containerId" type="text" />
                    <button onClick={this.getCustomContainer} type="button">
                        Get Custom Container
                    </button>
                    <label htmlFor="results"> Results:</label>
                    <p className={styles.results} ref={this.result} id="results"></p>
                </div>
            </>
        );
    }
}

function insertContainer(editor: IEditor, newModel: ContentModelDocument) {
    editor.formatContentModel((model, context) => {
        mergeModel(model, newModel, context, {
            mergeFormat: 'mergeAll',
        });
        return true;
    });
}
