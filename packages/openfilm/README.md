# @tryworld/set

TryWorld Set (试界片场): an open source AI video studio. Films are web pages, the manual teaches your coding agent to
make them, the `twset` command runs the work, and Studio is the editor to change anything in them.

Ask Codex, Claude Code or any coding agent to make a film. It writes the film as web pages (`film.html` cuts them
together with footage, pictures and sound), and Studio, a local editor in your browser (Chrome or Edge: films are drawn
with Chromium), shows it taking shape. Then change anything you like, by hand or by asking.

TryWorld Set is an independent derivative of [OpenFilm](https://github.com/openfilm/openfilm). The upstream MIT license
and copyright notice are preserved; see [NOTICE](../../NOTICE.md) and [TRADEMARK.md](TRADEMARK.md).

## Install

Requires Node 22.2+ and ffmpeg, on macOS, Windows or Linux; the first run downloads a headless Chromium.

```sh
npx @tryworld/set
```

The command prints the manual. Then ask your agent for a film.

## Commands

```sh
twset                          # the manual: all an agent needs to know
twset open   [folder | url]    # show a film in Studio (a GitHub address fetches it first)
twset look   [what] [t | a-b]  # check the film, a page or a media file
twset render [a-b]             # the MP4; --4k, --blur, --alpha
twset get    [what]            # voice-over, music, sound effects, transcripts, images, video, from your services
twset doctor                   # what this computer has for TryWorld Set, to paste into an issue
```

`MANUAL.md` (in this package) is what `twset` tells your agent, and `SPEC.md` is the film format, for anyone building a
player, renderer or editor. Source: [github.com/TryWorld2026/tryworld-set](https://github.com/TryWorld2026/tryworld-set).

## License

[MIT](LICENSE). The OpenFilm name and logo are trademarks of their respective owner: see [TRADEMARK.md](TRADEMARK.md).
TryWorld Set uses its own product name and branding and is not affiliated with or endorsed by the OpenFilm project.
