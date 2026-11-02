/**
 * What this release brings, said to the person after an update, in every language Studio speaks (a release without them
 * all does not compile), grouped as new, improved and fixed. Only this release's: the dialog tells what the version now
 * running brings, and the changelog on GitHub keeps every release's.
 *
 * Written when a release is made (the "Version packages" pull request), in place of the release before's: the
 * changesets say everything that changed, for the changelog; these say every change a person would notice, in their
 * words, one line each (at most 24). A version without them fails the tests (whats-new.test.ts), so that pull request
 * cannot be merged until they are written.
 *
 * After an update they appear once (Studio's prefs keep `seenVersion`). A new install shows none: there is nothing it
 * was updated from.
 */
import type { Language } from '@/i18n';

export type NoteKind = 'new' | 'improved' | 'fixed';
export interface ReleaseNote { kind: NoteKind; text: string }
export interface ReleaseNotes { version: string; date: string; notes: Record<Language, ReleaseNote[]> }

export const RELEASE: ReleaseNotes = {
  version: '0.2.8',
  date: '2026-11-03',
  notes: {
    en: [
      { kind: 'improved', text: 'Windows: the app looks for installed agents about twice as fast, so the list is ready sooner.' },
      { kind: 'fixed', text: 'Layers: on a slow machine the panel waits for the picture instead of staying empty, and a selected layer survives a page redraw.' },
      { kind: 'fixed', text: 'Clips with their own sound are marked in the timeline, so the clip menu and the Layers panel show their mute state correctly.' },
      { kind: 'fixed', text: 'Studio records an agent\'s merge or edit as soon as the new film is published, so the note no longer disappears on a slow Windows disk.' },
      { kind: 'improved', text: 'Exports: on Windows and Linux, the estimated size of a ProRes 4444 video now allows for up to 1.6× ProRes\'s rate on detailed footage.' },
    ],
    'zh-CN': [
      { kind: 'improved', text: 'Windows：查找已安装智能体的速度约快一倍，列表更快就绪。' },
      { kind: 'fixed', text: '图层面板：慢电脑上会等画面准备好再显示，不再一直空白；页面重绘时，选中的图层也会保留。' },
      { kind: 'fixed', text: '时间线会标出带独立声音的片段，片段菜单和图层面板能正确显示其静音状态。' },
      { kind: 'fixed', text: 'Studio 会在新影片文件发布的同时记录 Agent 的合并或编辑，慢速 Windows 磁盘上也不会再丢掉给 Agent 的说明。' },
      { kind: 'improved', text: '导出：Windows 和 Linux 上，ProRes 4444 的预计体积现在会按 ProRes 码率最高 1.6 倍估算，细节多的素材更接近实际。' },
    ],
    ja: [
      { kind: 'improved', text: 'Windows：インストール済みエージェントの検索が約2倍速くなり、一覧が早く表示されます。' },
      { kind: 'fixed', text: 'レイヤー：遅いマシンでは画面の準備を待ってから表示され、空白のままにならず、ページを描き直しても選択が保たれます。' },
      { kind: 'fixed', text: '独自の音声を持つクリップがタイムラインに表示され、クリップメニューとレイヤーパネルでミュート状態を正しく確認できます。' },
      { kind: 'fixed', text: 'Studio は新しい film.html が公開された時点でエージェントの統合・編集を記録するため、遅い Windows ディスクでも説明が失われません。' },
      { kind: 'improved', text: '書き出し：Windows と Linux では、ProRes 4444 の推定サイズが細部の多い映像で最大 1.6 倍の ProRes レートを見込むようになりました。' },
    ],
    ko: [
      { kind: 'improved', text: 'Windows: 설치된 에이전트를 찾는 속도가 약 두 배 빨라져 목록이 더 빨리 준비됩니다.' },
      { kind: 'fixed', text: '레이어: 느린 컴퓨터에서는 화면이 준비될 때까지 기다렸다가 표시되어 빈 패널로 남지 않고, 페이지를 다시 그려도 선택한 레이어가 유지됩니다.' },
      { kind: 'fixed', text: '자체 소리가 있는 클립이 타임라인에 표시되어 클립 메뉴와 레이어 패널에서 음소거 상태를 올바르게 확인할 수 있습니다.' },
      { kind: 'fixed', text: 'Studio가 새 film.html을 게시하는 즉시 에이전트의 병합·편집을 기록하므로 느린 Windows 디스크에서도 설명이 사라지지 않습니다.' },
      { kind: 'improved', text: '내보내기: Windows와 Linux에서 ProRes 4444의 예상 크기가 세부 묘사가 많은 영상의 경우 ProRes 비트레이트의 최대 1.6배를 반영합니다.' },
    ],
    es: [
      { kind: 'improved', text: 'Windows: la app busca los agentes instalados aproximadamente el doble de rápido, así que la lista está antes disponible.' },
      { kind: 'fixed', text: 'Capas: en un equipo lento, el panel espera a que la imagen esté lista en vez de quedarse vacío, y una capa seleccionada sobrevive a un redibujado de la página.' },
      { kind: 'fixed', text: 'Los clips con sonido propio se marcan en la línea de tiempo, para que el menú del clip y el panel de Capas muestren bien su estado de silencio.' },
      { kind: 'fixed', text: 'Studio registra la fusión o edición de un agente en cuanto se publica la nueva película, así que la nota ya no desaparece en un disco de Windows lento.' },
      { kind: 'improved', text: 'Exportaciones: en Windows y Linux, el tamaño estimado de un vídeo ProRes 4444 ahora contempla hasta 1,6× la tasa de ProRes en material con mucho detalle.' },
    ],
  },
};

/** -1, 0 or 1 as `a` is older than, the same as or newer than `b` (x.y.z; a pre-release is older than its release). */
export function compareVersions(a: string, b: string): number {
  const parse = (v: string) => {
    const [core, pre = ''] = v.split('-');
    return { parts: core.split('.').map((n) => Number(n) || 0), pre };
  };
  const x = parse(a), y = parse(b);
  for (let i = 0; i < 3; i++) {
    const d = (x.parts[i] ?? 0) - (y.parts[i] ?? 0);
    if (d) return Math.sign(d);
  }
  if (x.pre === y.pre) return 0;
  if (!x.pre) return 1;
  if (!y.pre) return -1;
  return x.pre < y.pre ? -1 : 1;
}

/** This release's notes when `version` is this release, else null. */
export function releaseNotes(version: string, release: ReleaseNotes = RELEASE): ReleaseNotes | null {
  return compareVersions(release.version, version) === 0 ? release : null;
}

/** Said on the window to show this release's notes again (Settings → About, Developer's preview). */
export const WHATS_NEW_EVENT = 'openfilm:whats-new';
export function showWhatsNew(): void {
  window.dispatchEvent(new CustomEvent(WHATS_NEW_EVENT));
}
