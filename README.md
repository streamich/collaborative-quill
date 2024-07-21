# Quill editor collaborative editing binding

Makes a rich-text Quill editor instance collaborative by binding it to a JSON CRDT
document using the `quill` extension. This allows multiple users to edit the
same document json-joy JSON CRDT document concurrently through the Quill editor.


## Usage

Installation:

```
npm install json-joy quill collaborative-quill
```

Usage:

```ts
import {bind} from 'collaborative-quill';
import {Model} from 'json-joy/es2020/json-crdt';

// ...

const unbind = bind(str, editor);

// When done, unbind the binding.
binding.unbind();
```


## Preview

- See [demo](https://streamich.github.io/collaborative-quill).
