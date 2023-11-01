import { mount as mountClassicalEditorMainPane } from './controls/MainPane';
import { mount as mountAdapterEditorMainPane } from './controls/AdapterEditorMainPane';
import { mount as mountContentModelEditorMainPane } from './controls/ContentModelEditorMainPane';

const search = document.location.search.substring(1).split('&');

if (search.some(x => x == 'cm=1')) {
    mountContentModelEditorMainPane(document.getElementById('mainPane'));
} else if (search.some(x => x == 'cm=2')) {
    mountAdapterEditorMainPane(document.getElementById('mainPane'));
} else {
    mountClassicalEditorMainPane(document.getElementById('mainPane'));
}
