import { Editor, EditorPlugin, EditorOptions } from 'roosterjs-core';
import { createEditor } from 'roosterjs';
import ShowCursorPosition from './plugins/ShowCursorPosition';
import ShowFromState from './plugins/ShowFormatState';
import initFormatBar from './initFormatBar';
import initOptions from './initOptions';
import getCurrentEditor, { setCurrentEditor } from './currentEditor';

window.onload = () => {
    initTabs();
    initEditor();
    initFormatBar();
    initOptions();
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
}

function initEditor() {
    let editorArea = document.getElementById('editor') as HTMLDivElement;
    setCurrentEditor(createEditor(editorArea, [
        new ShowCursorPosition(document.getElementById('cursorPosition')),
        new ShowFromState(document.getElementById('formatState')),
    ]));
    getCurrentEditor().setContent('Hello, RoosterJs!');
}
