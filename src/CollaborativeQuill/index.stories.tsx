import * as React from 'react';
import {CollaborativeQuill} from '.';
import {ModelWithExt, ext} from 'json-joy/lib/json-crdt-extensions';

export default {
  component: CollaborativeQuill,
  title: '<CollaborativeQuill>',
};

const model = ModelWithExt.create(ext.quill.new('abc'));
const api = model.s.toExt();

const Demo: React.FC = () => {
  React.useSyncExternalStore(model.api.subscribe, () => model.tick);

  return (
    <div>
      <CollaborativeQuill api={api} />
      <pre style={{fontSize: '10px'}}>
        <code>{model.toString()}</code>
      </pre>
    </div>
  );
};

export const Default = {
  render: Demo,
};
