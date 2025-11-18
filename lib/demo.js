import Peer from 'peerjs';
import SimpleMDE from 'simplemde';

import DemoController from './controller';
import Broadcast from './broadcast';
import Editor from './editor';
import UserBot from './userBot';

const id = Math.floor(Math.random() * 100000);

const demo = new DemoController(
  (location.search.slice(1) || '0'),
  location.origin,
  new Peer('collab-demo-'+id, {
    debug: 3
  }),
  new Broadcast(),
  new Editor(new SimpleMDE({
    placeholder: "Share the link to invite collaborators to your document.",
    spellChecker: false,
    toolbar: false,
    autofocus: true,
    indentWithTabs: true,
    tabSize: 4,
    indentUnit: 4,
    lineWrapping: false,
    shortCuts: []
  }))
);

const script1 = `This is a private and secure real-time collaborative text editor. It
allows you to create and edit documents with multiple people all at the same time.

### How Do I Use It?

To start editing, simply start typing, and then share your Peer ID with collaborators.
They can connect to you by entering your Peer ID in the sidebar.

### Doesn't Google Already Do This?

Kind of, but this editor is decentralized and therefore private. Google stores your
documents on their servers where they and the government could access them. With
this editor, your document is stored only on your computer and any changes you make
are sent only to the people collaborating with you.

### What Else Can It Do?

- Upload a document from your computer to continue editing
- Save the document to your computer at any time
- Video and audio calls with collaborators

Happy Typing!`;

new UserBot('collab-bot'+id, 'collab-demo-'+id, script1, demo.editor.mde);

