import * as React from 'react';
import Delta from 'quill-delta';
import Quill from 'quill';
import {QuillDeltaApi} from 'json-joy/lib/json-crdt-extensions/quill-delta/QuillDeltaApi';
import {loadCss} from './loadCss';
import type {QuillDeltaOp} from 'json-joy/lib/json-crdt-extensions/quill-delta/types';

loadCss('https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css');

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'link'], // toggled buttons
  ['blockquote', 'code-block'],

  [{header: 1}, {header: 2}], // custom button values
  [{list: 'ordered'}, {list: 'bullet'}],
  [{script: 'sub'}, {script: 'super'}], // superscript/subscript
  [{indent: '-1'}, {indent: '+1'}], // outdent/indent
  [{direction: 'rtl'}], // text direction

  ['image'],

  [{header: [1, 2, 3, 4, 5, 6, false]}],

  [{color: []}, {background: []}], // dropdown with defaults from theme
  [{font: []}],
  [{align: []}],

  ['clean'], // remove formatting button
];

export interface CollaborativeQuillProps {
  api?: QuillDeltaApi;
  content?: QuillDeltaOp[];
  readOnly?: boolean;
  onChange?: (ops: QuillDeltaOp[]) => void;
}

export const CollaborativeQuill: React.FC<CollaborativeQuillProps> = ({api, content, readOnly, onChange}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const editor = React.useRef<Quill>();
  React.useEffect(() => {
    const div = ref.current;
    if (!div) return;
    const quill = new Quill(div, {
      theme: 'snow',
      modules: {
        toolbar: readOnly ? [] : toolbarOptions,
      },
    });
    if (api) {
      const delta = new Delta(api.view() as any);
      quill.setContents(delta as any, 'silent');
    }
    editor.current = quill;
    if (readOnly) quill.enable(false);
    else {
      quill.on('editor-change', (name: any, delta: any) => {
        if (name === 'text-change') {
          const ops = delta.ops as QuillDeltaOp[];

          /**
           * When inside an annotated text (say bold test), a character is inserted,
           * just before the last annotated character, and the inserted character
           * is the same as the last character, then Quill does not insert it in
           * the right place: it inserts it just after the last annotated character.
           * This is a workaround for this bug.
           */
          if (ops.length === 2) {
            const retain = (ops[0] as any).retain;
            const insert = (ops[1] as any).insert;
            const attributes = (ops[1] as any).attributes;
            if (
              typeof retain === 'number' &&
              typeof insert === 'string' &&
              attributes &&
              insert.length === 1 &&
              insert !== '\n'
            ) {
              const selection = quill.getSelection();
              if (selection && selection.length === 0) {
                if (selection.index === retain) {
                  delta.ops[0].retain = retain - 1;
                }
              }
            }
          }

          if (api) api.apply(delta.ops);
          if (onChange) {
            // tslint:disable-next-line:no-console
            console.log(quill.getSelection(), delta.ops[0], delta.ops[1]);
            onChange(delta.ops as QuillDeltaOp[]);
          }
        }
      });
    }
  }, [ref]);

  if (content) {
    editor.current?.setContents(new Delta(content as any) as any, 'api');
  }

  return <div ref={ref} />;
};
