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
  version: '0.3.2',
  date: '2026-11-04',
  notes: {
    en: [
      { kind: 'new', text: 'Setpiece now appears consistently across Studio, the AI workspace, documentation, and the download site.' },
      { kind: 'improved', text: 'Chinese copy now uses 造境 throughout, with corrected Korean particles and refreshed release-note translations.' },
      { kind: 'fixed', text: 'The CLI now installs only setpiece; existing projects and preferences continue to work unchanged.' },
    ],
    'zh-CN': [
      { kind: 'new', text: 'Setpiece / 造境已统一出现在 Studio、AI 工作区、文档和下载站。' },
      { kind: 'improved', text: '中文界面全面使用“造境”，并修正韩文助词与发布说明翻译。' },
      { kind: 'fixed', text: '命令行现在只安装 setpiece，已有项目和偏好设置继续可用。' },
    ],
    ja: [
      { kind: 'new', text: 'Setpiece の名称を Studio、AI ワークスペース、ドキュメント、ダウンロードサイト全体で統一しました。' },
      { kind: 'improved', text: '中国語表記を「造境」に統一し、韓国語の助詞とリリースノートの翻訳を修正しました。' },
      { kind: 'fixed', text: 'CLI は setpiece のみをインストールし、既存のプロジェクトと設定はそのまま利用できます。' },
    ],
    ko: [
      { kind: 'new', text: 'Setpiece 이름을 Studio, AI 작업 공간, 문서, 다운로드 사이트 전반에 일관되게 적용했습니다.' },
      { kind: 'improved', text: '중국어 표기를 造境으로 통일하고 한국어 조사와 릴리스 노트 번역을 수정했습니다.' },
      { kind: 'fixed', text: 'CLI는 이제 setpiece만 설치하며 기존 프로젝트와 환경 설정은 그대로 사용할 수 있습니다.' },
    ],
    es: [
      { kind: 'new', text: 'Setpiece aparece ahora de forma coherente en Studio, el espacio de IA, la documentación y el sitio de descargas.' },
      { kind: 'improved', text: 'Los textos en chino usan 造境 de forma uniforme; también corregimos partículas en coreano y traducciones de notas.' },
      { kind: 'fixed', text: 'La CLI ahora instala solo setpiece; los proyectos y las preferencias existentes siguen funcionando.' },
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
