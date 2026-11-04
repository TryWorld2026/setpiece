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
  version: '0.3.1',
  date: '2026-11-04',
  notes: {
    en: [
      { kind: 'new', text: 'License and Privacy are now available from Settings, and the desktop app carries both documents with its notices.' },
      { kind: 'improved', text: 'Release packages now include complete third-party notices and legal documents.' },
      { kind: 'fixed', text: 'Existing projects, preferences and the setpiece, twset and openfilm commands carry over unchanged.' },
    ],
    'zh-CN': [
      { kind: 'new', text: '设置中新增“许可”和“隐私”入口，桌面应用也会随安装包附带这两份文档。' },
      { kind: 'improved', text: '发布包现在完整包含第三方声明与法律文件，分发信息更清楚。' },
      { kind: 'fixed', text: '已有项目、偏好设置，以及 setpiece、twset、openfilm 命令继续原样可用。' },
    ],
    ja: [
      { kind: 'new', text: '設定に「ライセンス」と「プライバシー」への入口を追加し、デスクトップアプリにも両方の文書を同梱しました。' },
      { kind: 'improved', text: 'リリースパッケージにサードパーティ通知と法的文書を完全に含めるようにしました。' },
      { kind: 'fixed', text: '既存のプロジェクト、設定、setpiece・twset・openfilm コマンドはそのまま引き継がれます。' },
    ],
    ko: [
      { kind: 'new', text: '설정에 라이선스와 개인정보 보호 항목을 추가했으며, 데스크톱 앱에도 두 문서를 함께 포함합니다.' },
      { kind: 'improved', text: '릴리스 패키지에 타사 고지와 법적 문서를 빠짐없이 포함합니다.' },
      { kind: 'fixed', text: '기존 프로젝트, 환경 설정, setpiece·twset·openfilm 명령이 그대로 유지됩니다.' },
    ],
    es: [
      { kind: 'new', text: 'Licencia y Privacidad ya están disponibles en Ajustes, y la aplicación de escritorio incluye ambos documentos.' },
      { kind: 'improved', text: 'Los paquetes de release incluyen ahora los avisos de terceros y los documentos legales completos.' },
      { kind: 'fixed', text: 'Los proyectos, las preferencias y los comandos setpiece, twset y openfilm se conservan sin cambios.' },
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
