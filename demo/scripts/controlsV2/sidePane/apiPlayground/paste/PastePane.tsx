import * as React from 'react';
import { ApiPaneProps, ApiPlaygroundComponent } from '../ApiPaneProps';
import { ClipboardData, PasteType, PluginEvent } from 'roosterjs-content-model-types';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { extractClipboardItems } from 'roosterjs-content-model-dom';
import { paste } from 'roosterjs-content-model-core';

const styles = require('./PastePane.scss');
const pasteTypes: PasteType[] = ['normal', 'mergeFormat', 'asPlainText', 'asImage'];

interface PastePaneState {
    clipboardData: ClipboardData | undefined;
    shouldEncrypt: boolean;
}

let lastClipboardData: ClipboardData | undefined = undefined;

export default class PastePane extends React.Component<ApiPaneProps, PastePaneState>
    implements ApiPlaygroundComponent {
    private clipboardDataRef = React.createRef<HTMLTextAreaElement>();
    private pasteTypeRef = React.createRef<HTMLSelectElement>();
    private shouldEncryptRef = React.createRef<HTMLInputElement>();
    private ignoreBeforePasteEvent: boolean = false;

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            clipboardData: lastClipboardData,
            shouldEncrypt: false,
        };
    }

    public onPluginEvent = (e: PluginEvent) => {
        if (e.eventType == 'beforePaste' && !this.ignoreBeforePasteEvent) {
            this.trySetClipboardData(e.clipboardData);
        }
    };

    private downloadClipboardDataAsJson = () => {
        if (this.state.clipboardData) {
            const dataStr =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(this.getClipboardData()));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', 'clipboardData.json');
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert(
                'No clipboard data available to export, either paste in the text area above or use the extract clipboard programmatically button.'
            );
        }
    };

    private importClipboardDataFromJson = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async e => {
            const file = (e.target as HTMLInputElement).files![0];
            const reader = new FileReader();
            reader.onload = async () => {
                const clipboardData = JSON.parse(reader.result as string);
                this.trySetClipboardData(clipboardData);
            };
            reader.readAsText(file);
        };
        input.click();
    };

    private onExtractClipboardProgrammatically = async () => {
        const doc = this.clipboardDataRef.current.ownerDocument;
        const clipboard = doc.defaultView.navigator.clipboard;
        if (clipboard && clipboard.read) {
            try {
                const clipboardItems = await clipboard.read();
                const dataTransferItems = await Promise.all(
                    createDataTransferItems(clipboardItems)
                );
                const clipboardData = await extractClipboardItems(dataTransferItems);
                this.trySetClipboardData(clipboardData);
            } catch {
                this.clipboardDataRef.current.value = 'Error parsing clipboard data';
            }
        }
    };

    private trySetClipboardData(clipboardData: ClipboardData) {
        this.setState({
            clipboardData,
        });

        lastClipboardData = clipboardData;
    }

    private paste = () => {
        if (this.state.clipboardData) {
            const editor = this.props.getEditor();
            const pasteType = (this.pasteTypeRef.current.value || 'normal') as PasteType;

            this.ignoreBeforePasteEvent = true;
            paste(editor, this.getClipboardData(), pasteType);
            this.ignoreBeforePasteEvent = false;
        } else {
            alert(
                'No clipboard data available to paste, either paste in the text area above or use the extract clipboard programmatically button.'
            );
        }
    };

    private getClipboardData = () => {
        try {
            const clipboardData = Object.assign({}, this.state.clipboardData);
            if (this.state.shouldEncrypt) {
                clipboardData.text = clipboardData.text?.replace(/./g, '■');
                clipboardData.rawHtml = maskContent(clipboardData.rawHtml);
                clipboardData.html = maskContent(clipboardData.html);
            }
            return clipboardData;
        } catch {
            alert('Error masking clipboard data');
            return undefined;
        }
    };

    private getClipboardDataJson = () => {
        try {
            return JSON.stringify(this.getClipboardData());
        } catch {
            return 'Error parsing clipboard data';
        }
    };

    render() {
        return (
            <>
                <div>
                    {this.state.clipboardData ? (
                        <PrimaryButton
                            iconProps={{
                                iconName: 'Checkmark',
                            }}
                            text="Clipboard available. Export or paste with options below."
                        />
                    ) : (
                        <DefaultButton
                            iconProps={{ iconName: 'Error' }}
                            text="No clipboard data available. Please paste content into the editor or import a JSON file."
                        />
                    )}
                </div>
                <h3>Export / Import Clipboard Data</h3>
                <div>
                    <div>
                        <button
                            className={styles.button}
                            onClick={this.downloadClipboardDataAsJson}>
                            Export Clipboard Data
                        </button>
                        <button
                            className={styles.button}
                            onClick={this.importClipboardDataFromJson}>
                            Import Clipboard Data
                        </button>
                    </div>
                    <details>
                        <summary>Click to show the clipboard data</summary>
                        <textarea
                            placeholder="Clipboard data will be shown here"
                            className={styles.showClipboardTextArea}
                            ref={this.clipboardDataRef}
                            readOnly
                            value={this.getClipboardDataJson()}></textarea>
                    </details>
                    <details>
                        <summary>Advanced actions</summary>
                        <div>
                            <label htmlFor="shouldEncrypt">
                                Should mask the text content in clipboard
                            </label>
                            <input
                                type="checkbox"
                                value={this.state.shouldEncrypt ? 'checked' : ''}
                                ref={this.shouldEncryptRef}
                                onChange={e => {
                                    this.setState({
                                        clipboardData: this.state.clipboardData,
                                        shouldEncrypt: e.target.checked,
                                    });
                                }}
                            />
                            <hr />
                            <div>
                                <button onClick={this.onExtractClipboardProgrammatically}>
                                    Extract clipboard data programmatically
                                </button>
                            </div>
                        </div>
                    </details>
                </div>
                <h3>Paste using clipboard data</h3>

                <div>
                    <label htmlFor="SelectPasteType">Paste Type:</label>
                    <select id="SelectPasteType" ref={this.pasteTypeRef}>
                        {pasteTypes.map(pasteType => (
                            <option value={pasteType} key={pasteType}>
                                {pasteType}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button onClick={this.paste}>Paste</button>
                </div>
            </>
        );
    }
}

const createDataTransfer = (
    kind: 'string' | 'file',
    type: string,
    blob: Blob
): DataTransferItem => {
    const file = blob as File;
    return {
        kind,
        type,
        getAsFile: () => file,
        getAsString: (callback: (data: string) => void) => {
            blob.text().then(callback);
        },
        webkitGetAsEntry: () => null,
    };
};

const createDataTransferItems = (data: ClipboardItems) => {
    const isTEXT = (type: string) => type.startsWith('text/');
    const dataTransferItems: Promise<DataTransferItem>[] = [];
    data.forEach(item => {
        item.types.forEach(type => {
            dataTransferItems.push(
                item
                    .getType(type)
                    .then(blob => createDataTransfer(isTEXT(type) ? 'string' : 'file', type, blob))
            );
        });
    });
    return dataTransferItems;
};

const maskContent = (html: string | undefined): string => {
    return html
        ? html.replace(/>([^<]+)</g, (_match, p1) => {
              return '>' + '■'.repeat(p1.length) + '<';
          })
        : undefined;
};
