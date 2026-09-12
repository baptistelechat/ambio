# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- 8 new WigggleUI widgets: QR code (Wi-Fi network or custom URL), name day ("fête du jour"),
  Raspberry Pi system status (CPU temperature, memory usage, uptime), and a full air quality
  suite (AQI, UV index, pollen, fine particles, plus a combined view showing all four at once)
- News ticker widget: pick RSS feeds from a curated list of French news sources (checkboxes)
  instead of typing URLs, with an optional keyword filter
- Widget picker now groups WigggleUI widgets into sub-categories (Clocks, Calendars, Weather,
  Air quality, System, Utilities) instead of one long list
- Raspberry Pi screensaver server and Android app: a drag-and-drop editor (weather, clock,
  quote-of-the-day, and agenda widgets) with a fullscreen render page kept in sync live,
  loaded fullscreen on the TV through an Android DreamService
- 17 additional WigggleUI widgets (multi-timezone clocks, weather, calendars), grouped by
  category in the widget picker with a live preview, per-widget settings, and an
  Android-launcher-style grid layout for placing them on screen
- Animated gradient wallpaper option for the background, with 8 curated presets (Aurora,
  Sunset, Nebula, Ocean, Ember, Forest, Midnight, Candy) picked from a color-swatch selector
  in the editor
- Mobile-friendly editor: on phones the canvas shows as a fullscreen, rotated live preview
  you can drag widgets on directly (previously read-only), with the widget picker and
  background settings organized into Widget/Background tabs in a bottom drawer you swipe up
  to open and down to dismiss

### Fixed

- Digital clock widgets (minimalist, digital, clock+day) showed 12-hour time instead of
  24-hour
- Detailed weather widget: wind/feels-like and precipitation/humidity values could end up
  misaligned depending on their text width
- Screensaver now renders fullscreen and at the correct scale on the TV (it used to show
  at half width / wrong viewport size)
- The "Publish" button could be pushed off-screen and unreachable in the mobile settings
  drawer
- Browser translation prompt no longer pops up on the app (page language wasn't declared)
