# setpiece

Setpiece / 造境 is an AI film workspace. Films are web pages, the manual teaches your coding agent to make them,
the `setpiece` command runs the work, and Studio is the desktop-class editor for changing anything in them.

Ask Codex, Claude Code or another coding agent to make a film. It writes the film as web pages (`film.html` cuts them
together with footage, pictures and sound), and Studio shows it taking shape. Then edit by hand or by asking.

Setpiece is an independent derivative of [OpenFilm](https://github.com/openfilm/openfilm). The upstream MIT license and
copyright notice are preserved; see [NOTICE](../../NOTICE.md) and [TRADEMARK.md](TRADEMARK.md).

## Install

Requires Node.js `>=22.18` and ffmpeg on macOS, Windows or Linux. The first run downloads a headless Chromium.

```sh
npx setpiece
```

The command prints the manual. Then ask your agent for a film.

## Commands

```sh
setpiece                          # the manual: all an agent needs to know
setpiece open   [folder | url]    # show a film in Studio (a GitHub address fetches it first)
setpiece look   [what] [t | a-b]  # check the film, a page or a media file
setpiece render [a-b]             # the MP4; --4k, --blur, --alpha
setpiece get    [what]            # voice-over, music, sound effects, transcripts, images, video, from your services
setpiece doctor                   # what this computer has for Setpiece, to paste into an issue
```

`twset` and `openfilm` remain hidden compatibility aliases. `MANUAL.md` is what `setpiece` tells your agent, and
`SPEC.md` is the film format for anyone building a player, renderer or editor.

Source: [github.com/TryWorld2026/setpiece](https://github.com/TryWorld2026/setpiece).

## License

[MIT](LICENSE). The OpenFilm name and logo are trademarks of their respective owner: see [TRADEMARK.md](TRADEMARK.md).
Setpiece uses its own product name and branding and is not affiliated with or endorsed by the OpenFilm project.
