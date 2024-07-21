import * as React from 'react';
import {CollaborativeQuill} from '.';
import {ModelWithExt, ext} from 'json-joy/lib/json-crdt-extensions';
import Quill from 'quill';
import Delta from 'quill-delta';

export default {
  component: CollaborativeQuill,
  title: '<CollaborativeQuill>',
};

const model = ModelWithExt.create(ext.quill.new('abc'));
const api = model.s.toExt();

const Demo: React.FC = () => {
  React.useSyncExternalStore(model.api.subscribe, () => model.tick);
  const editorRef = React.useRef<Quill | null>(null);

  return (
    <div>
      <CollaborativeQuill api={api} onEditor={(editor) => (editorRef.current = editor)} />
      <br />
      <div>
        <button
          onClick={() => {
            setTimeout(() => {
              if (!editorRef.current) return;
              editorRef.current.updateContents(new Delta([{insert: '1. '}]));
            }, 2000);
          }}
        >
          Prepend "1. " to editor after 2s
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setTimeout(() => {
              api.apply([{insert: '1. '}]);
            }, 2000);
          }}
        >
          Prepend "1. " to model after 2s
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setTimeout(() => {
              const delta = new Delta(api.view());
              api.apply([{retain: delta.length() || 0}, {insert: '?'}]);
            }, 2000);
          }}
        >
          Append "?" to model after 2s
        </button>
      </div>
      <pre style={{fontSize: '10px'}}>
        <code>{model.toString()}</code>
      </pre>
    </div>
  );
};

export const Default = {
  render: Demo,
};
