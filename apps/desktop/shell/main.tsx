/**
 * The app's window: Studio's editor, as the open-source Studio is (its App, unchanged), and the chat in the column
 * Studio leaves for it (lib/host.ts `panel`). One page, one theme, one layer of dialogs over both.
 */
import './bridge';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@tryworld/set/studio-ui/App.tsx';
import { FocusNav } from '@tryworld/set/studio-ui/components/FocusNav.tsx';
import { applyStudioHost } from '@tryworld/set/studio-ui/lib/host.ts';
import { mountChat } from '../chat/src/mount';
import './shell.css';
import '../chat/src/chat.css';

applyStudioHost();
createRoot(document.getElementById('root')!).render(<StrictMode><FocusNav /><App /></StrictMode>);
void mountChat(document.getElementById('of-chat')!);
