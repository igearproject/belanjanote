# Implementation Plan - Catatan Belanja Cerdas

## Phase 1: Project Initialization
- [ ] Initialize Expo project with TypeScript (`npx create-expo-app -t expo-template-blank-typescript`).
- [ ] Install dependencies: `expo-sqlite`, `zustand`, `expo-file-system`, `expo-sharing`, `date-fns`.
- [ ] Setup project structure (src/components, src/screens, src/database, src/store).

## Phase 2: Database & Store Setup
- [ ] Create SQLite database initialization script (create tables: `products`, `purchase_history`).
- [ ] Create Database Service layer (methods: `addProduct`, `addPurchase`, `getProducts`, `getHistory`).
- [ ] Setup Zustand store to manage app state and sync with DB.

## Phase 3: Core Features Implementation
- [ ] **Product Management**: Add/Edit products.
- [ ] **Purchase Recording**: Function to add a purchase and link it to a product.
- [ ] **Algorithm**: Implement `calculateUrgency` and `predictNextPurchase` logic.

## Phase 4: UI Development
- [ ] **Home Screen**: Display list of items sorted by urgency.
- [ ] **Add Item Screen**: Form to add new items.
- [ ] **History Screen**: View past purchases.
- [ ] **Settings Screen**: Export/Import buttons.

## Phase 5: Polish & Testing
- [ ] Add styling and animations.
- [ ] Test offline functionality.
- [ ] Test Export/Import flow.
