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
  version: '0.3.0',
  date: '2026-11-03',
  notes: {
    en: [
      { kind: 'new', text: 'Setpiece · 造境: a refined, Apple-inspired workspace with a quieter interface, warmer neutrals and a fog-blue focus color.' },
      { kind: 'new', text: 'The Projects window is now a full-window library with recents, folders, examples, search, sorting and grid or list views.' },
      { kind: 'improved', text: 'The editor, inspector, timeline, settings and assistant share one visual system, with clearer dividers and lighter motion.' },
      { kind: 'fixed', text: 'Existing projects, preferences and the setpiece, twset and openfilm commands keep working through the rename.' },
    ],
    'zh-CN': [
      { kind: 'new', text: 'Setpiece · 造境：全新的 Apple 风格专业工作台，更安静的中性色、更细的分隔和雾蓝色焦点。' },
      { kind: 'new', text: '项目库改为全窗口 Finder 式布局，集中呈现最近项目、文件夹、示例、搜索、排序以及网格和列表视图。' },
      { kind: 'improved', text: '编辑器、检查器、时间线、设置和 AI 助理统一使用同一套视觉与动效语言。' },
      { kind: 'fixed', text: '已有项目、偏好设置，以及 setpiece、twset、openfilm 三个命令在更名后继续可用。' },
    ],
    ja: [
      { kind: 'new', text: 'Setpiece · 造境：Apple のプロ向けアプリを参考にした、静かな中性色とフォグブルーの焦点を持つ新しいワークスペース。' },
      { kind: 'new', text: 'プロジェクトウィンドウが全画面のライブラリになり、最近の作品、フォルダー、作例、検索、並べ替え、グリッド／リスト表示をまとめて扱えます。' },
      { kind: 'improved', text: 'エディター、インスペクター、タイムライン、設定、AI アシスタントが一つの視覚言語と控えめな動きを共有します。' },
      { kind: 'fixed', text: '名前の変更後も、既存のプロジェクト、設定、setpiece・twset・openfilm コマンドはそのまま使えます。' },
    ],
    ko: [
      { kind: 'new', text: 'Setpiece · 造境: Apple 스타일의 전문 작업 공간으로, 더 차분한 중성색과 포그 블루 포인트를 사용합니다.' },
      { kind: 'new', text: '프로젝트 창이 전체 창 라이브러리로 바뀌어 최근 작품, 폴더, 예제, 검색, 정렬, 그리드 및 목록 보기를 한곳에서 제공합니다.' },
      { kind: 'improved', text: '편집기, 인스펙터, 타임라인, 설정, AI 어시스턴트가 하나의 시각 언어와 절제된 움직임을 공유합니다.' },
      { kind: 'fixed', text: '이름 변경 후에도 기존 프로젝트, 환경 설정, setpiece·twset·openfilm 명령이 계속 작동합니다.' },
    ],
    es: [
      { kind: 'new', text: 'Setpiece · 造境: un espacio de trabajo profesional inspirado en Apple, con neutros más serenos y un acento azul niebla.' },
      { kind: 'new', text: 'La ventana de proyectos ahora es una biblioteca a pantalla completa con recientes, carpetas, ejemplos, búsqueda, orden y vistas de cuadrícula o lista.' },
      { kind: 'improved', text: 'El editor, el inspector, la línea de tiempo, los ajustes y el asistente comparten un mismo lenguaje visual y un movimiento discreto.' },
      { kind: 'fixed', text: 'Los proyectos, las preferencias y los comandos setpiece, twset y openfilm siguen funcionando tras el cambio de nombre.' },
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
