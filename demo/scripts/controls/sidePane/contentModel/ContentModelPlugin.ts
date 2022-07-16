import ContentModelPane, { ContentModelPaneProps } from './ContentModelPane';
import HackedEditor from '../../hackedEditor/HackedEditor';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { ChangeSource, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default class ContentModelPlugin extends SidePanePluginImpl<
    ContentModelPane,
    ContentModelPaneProps
> {
    constructor() {
        super(ContentModelPane, 'contentModel', 'Content Model (Under development)');
    }

    initialize(editor: IEditor): void {
        super.initialize(editor);

        editor.getDocument().addEventListener('selectionchange', this.onModelChange);
    }

    dispose(): void {
        this.editor.getDocument().removeEventListener('selectionchange', this.onModelChange);

        super.dispose();
    }

    onPluginEvent(e: PluginEvent) {
        if (
            e.eventType == PluginEventType.ContentChanged &&
            (e.source == ChangeSource.SwitchToDarkMode ||
                e.source == ChangeSource.SwitchToLightMode)
        ) {
            this.onModelChange();
        }
    }

    private onGetModel = () => {
        return isHackedEditor(this.editor) ? this.editor.getContentModel() : null;
    };

    protected getComponentProps(baseProps: SidePaneElementProps): ContentModelPaneProps {
        return {
            ...baseProps,
            model: null,
            onUpdateModel: this.onGetModel,
        };
    }

    private onModelChange = () => {
        this.getComponent(component => {
            const model = this.onGetModel();
            component.setContentModel(model);
        });
    };
}

function isHackedEditor(editor: IEditor | null): editor is HackedEditor {
    return editor && !!(<HackedEditor>editor).getContentModel;
}
