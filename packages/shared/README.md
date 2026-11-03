# setpiece-shared

What Setpiece's clients share: a chat turn and the events a client sees, how an agent's activity reads, prompt
references, title limits and Markdown parsing.

```ts
import { buildPromptDisplay, type Turn } from 'setpiece-shared';
import { scanMarkdownBlocks } from 'setpiece-shared/markdown';
```

Part of [Setpiece](https://github.com/TryWorld2026/setpiece). MIT licensed.
