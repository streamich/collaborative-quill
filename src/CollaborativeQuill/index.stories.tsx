import * as React from 'react';
import {CollaborativeQuill} from '.';
import {ModelWithExt, ext} from 'json-joy/lib/json-crdt-extensions';

export default {
  component: CollaborativeQuill,
  title: '<CollaborativeQuill>',
};

const model = ModelWithExt.create(ext.quill.new('abc'));


console.log(model + '');

export const Default = {
  render: () => <CollaborativeQuill />,
};
