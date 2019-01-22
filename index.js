import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/go/go';
import 'codemirror/mode/python/python';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
// This addon is required to be installed by the caller
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';

import 'lsp-editor-adapter/lib/codemirror-lsp.css';
import { LspWsConnection, CodeMirrorAdapter } from 'lsp-editor-adapter';

let sample = '';

let modes = {
  javascript: 'javascript',
  html: 'htmlmixed',
  css: 'css',
};

let documents = {
  javascript: 'file.js',
  html: 'file.html',
  css: 'file.css',
};

let editor = CodeMirror(document.querySelector('.editor'), {
  theme: 'idea',
  lineNumbers: true,
  value: sample,
});

document.querySelector('select').addEventListener('change', () => {
  switchSources();
});

let connection;
let adapter;

function switchSources() {
  if (connection) {
    connection.close();
  }
  if (adapter) {
    adapter.remove();
  }

  let value = document.querySelector('select').value.toLowerCase();

  if (typeof modes[value] !== undefined) {
    editor.setOption('mode', modes[value]);
  }

  editor.setValue('');

  connection = new LspWsConnection({
    serverUri: 'wss://lsp-server.wylie.su/' + value,
    languageId: value,
    rootUri: 'file:///usr/src/app/sources',
    documentUri: 'file:///usr/src/app/sources/' + documents[value],
    documentText: () => editor.getValue(),
  }).connect(new WebSocket('wss://lsp-server.wylie.su/' + value));

  adapter = new CodeMirrorAdapter(connection, {
    quickSuggestionsDelay: 10,
  }, editor);
}

switchSources();
