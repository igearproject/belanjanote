# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-21

### Added
- Initial release of Catatan Belanja Cerdas
- Smart shopping list with urgency-based prioritization
- Product management (CRUD operations)
- Purchase history tracking
- Automatic consumption rate calculation
- Predicted runout date calculation
- Export/Import functionality for data portability
- Offline-first architecture with SQLite
- Bottom tab navigation with 4 main screens:
  - Home (Shopping List)
  - Products
  - History
  - Settings
- Modern UI with urgency color coding:
  - 🔴 Critical (≤1 day)
  - 🟠 High (≤3 days)
  - 🟡 Medium (≤7 days)
  - 🟢 Low (>7 days)
- TypeScript support for type safety
- Comprehensive documentation (README, TECH_SPEC, ARCHITECTURE, API)

### Technical Details
- Built with Expo SDK 54
- React Native 0.81.5
- TypeScript 5.9
- Zustand for state management
- expo-sqlite for local database
- React Navigation for routing
- date-fns for date manipulation

## [Unreleased]

### Planned Features
- Cloud sync with encryption
- Barcode scanner for quick product addition
- Shopping list sharing
- Price tracking over time
- Budget management
- Push notifications for low stock items
- Multi-language support
- Dark mode
- Widget support
