import * as React from 'react';
import { ContentModelDocument } from 'roosterjs-content-model';
import { ContentModelDocumentView } from '../../contentModel/components/model/ContentModelDocumentView';
import { exportButton } from './buttons/exportButton';
import { refreshButton } from './buttons/refreshButton';
import { Ribbon, RibbonButton, RibbonPlugin } from 'roosterjs-react';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    ribbonPlugin: RibbonPlugin;
}

export default class ContentModelPane extends React.Component<
    ContentModelPaneProps,
    ContentModelPaneState
> {
    private contentModelButtons: RibbonButton<any>[];

    constructor(props: ContentModelPaneProps) {
        super(props);

        this.contentModelButtons = [refreshButton, exportButton];

        this.state = {
            model: null,
        };
    }

    setContentModel(model: ContentModelDocument) {
        this.setState({
            model: model,
        });
    }

    render() {
        return (
            <>
                <Ribbon buttons={this.contentModelButtons} plugin={this.props.ribbonPlugin} />
                <div className={styles.contentModel}>
                    {this.state.model ? <ContentModelDocumentView doc={this.state.model} /> : null}
                </div>
            </>
        );
    }
}
