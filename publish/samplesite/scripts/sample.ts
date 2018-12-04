import initFormatBar from './initFormatBar';
import updateSampleCode from './updateSampleCode';
import initOptions, { initEditorForOptions } from './initOptions';

window.onload = () => {
    initTabs();
    initEditor();
    initFormatBar();
    initOptions();
    updateSampleCode();
    switchTab('quickstart');
};

function initTabs() {
    document.getElementById('quickstartTab').addEventListener('click', function() {
        switchTab('quickstart');
    });
    document.getElementById('optionsTab').addEventListener('click', function() {
        switchTab('options');
    });
    document.getElementById('advanceTab').addEventListener('click', function() {
        switchTab('advance');
    });
}

function switchTab(name: string) {
    document.getElementById('quickstartTab').className = name == 'quickstart' ? 'selected' : '';
    document.getElementById('optionsTab').className = name == 'options' ? 'selected' : '';
    document.getElementById('advanceTab').className = name == 'advance' ? 'selected' : '';
    document.getElementById('options').className = name == 'options' ? 'tab selected' : 'tab';
    document.getElementById('advance').className = name == 'advance' ? 'tab selected' : 'tab';

    document.getElementById('sampleCodeContainer').style.display = name == 'advance' ? 'none' : '';
    document.getElementById('snapshotContainer').style.display = name != 'advance' ? 'none' : '';
}

function initEditor() {
    let editorArea = document.getElementById('editor') as HTMLDivElement;
    editorArea.innerHTML = '';
    initEditorForOptions();
}
