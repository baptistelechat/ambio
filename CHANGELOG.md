# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Raspberry Pi screensaver server and Android app: a drag-and-drop editor (weather, clock,
  quote-of-the-day, and agenda widgets) with a fullscreen render page kept in sync live,
  loaded fullscreen on the TV through an Android DreamService
- 17 additional WigggleUI widgets (multi-timezone clocks, weather, calendars), grouped by
  category in the widget picker with a live preview, per-widget settings, and an
  Android-launcher-style grid layout for placing them on screen
- Animated gradient wallpaper option for the background, with 8 curated presets (Aurora,
  Sunset, Nebula, Ocean, Ember, Forest, Midnight, Candy) picked from a color-swatch selector
  in the editor

### Fixed

- Screensaver now renders fullscreen and at the correct scale on the TV (it used to show
  at half width / wrong viewport size)
