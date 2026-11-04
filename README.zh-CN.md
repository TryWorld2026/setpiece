# Setpiece / 造境

> 把想法，造成现场。
>
> Bring ideas to the set.

**Setpiece · 造境** 是一个 AI 片场：以网页为影片格式，提供 Apple 风格的专业桌面编辑器与命令行。它完整保留
编辑、时间线、素材、智能体与导出能力，并采用全新的产品身份与界面。

[English](README.md)

## 状态

`@tryworld/setpiece@0.3.2` 是当前 CLI、npm 版本，`v0.3.2` 仍是 GitHub Latest。重设计后的桌面界面已随未签名
[`v0.3.2-preview.4`](https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.2-preview.4) 预发布版开放测试：
Apple Silicon、Intel Mac 与 Windows x64 安装包均由同一份源码构建。正式签名与公证的桌面版本仍需发布密钥。
源码保留上游 Git 历史与必要的 MIT 归属声明。

## 产品

- 产品名：Setpiece / 造境
- 品类：AI Film Workspace / AI 片场
- 桌面应用：`setpiece-desktop`
- CLI 与 npm 包：`@tryworld/setpiece`（命令：`setpiece`）
- 共享包：`setpiece-shared`
- 仓库：https://github.com/TryWorld2026/setpiece
- CLI 与 npm 版本：`0.3.2`
- 桌面 Preview：`0.3.2-preview.4`（macOS Apple Silicon、Intel Mac 与 Windows x64；未签名）

命令只提供 `setpiece`，不再安装旧命令别名。旧 npm 包 `@tryworld/set` 已弃用，并指引用户迁移到
`@tryworld/setpiece`。

## 安装

需要 Node.js `>=22.18`：

```sh
npx -y @tryworld/setpiece@latest open
```

用户可以下载未签名的
[造境 0.3.2 桌面 Preview](https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.2-preview.4)：
Apple Silicon DMG/ZIP、Intel Mac DMG/ZIP 与 Windows x64 EXE。macOS 首次打开请右键选择打开；
如被 Gatekeeper 阻止，可执行 `xattr -cr /Applications/Setpiece.app`。

## 从源码运行

需要 Node.js `>=22.18` 和 pnpm。

```sh
pnpm install
pnpm dev
```

运行桌面应用：

```sh
pnpm dev:desktop
```

运行 CLI：

```sh
pnpm setpiece --help
```

## 验证

```sh
pnpm typecheck
pnpm build
pnpm test
```

## 必要开源归属

Setpiece 是 [OpenFilm](https://github.com/openfilm/openfilm) 的独立衍生项目。OpenFilm 的代码采用 MIT
许可证，原始版权归 OpenFilm contributors。我们保留上游版权声明、许可证和 Git 历史。

Setpiece 使用自己的产品名、标志和界面，不是 OpenFilm 官方产品，与 OpenFilm 项目不存在隶属关系，也不代表获得其背书。

参见 [NOTICE.md](NOTICE.md)、[LICENSES/OpenFilm-MIT.txt](LICENSES/OpenFilm-MIT.txt)，以及上游参考文档：
[English](README.upstream.md) / [简体中文](README.upstream.zh-CN.md)。

## 许可证

本仓库采用 MIT 许可证，参见 [LICENSE](LICENSE)。上游 OpenFilm 声明保留在
[LICENSES/OpenFilm-MIT.txt](LICENSES/OpenFilm-MIT.txt)。
