# @vue-types/shared

Shared TypeScript type definitions for Vue Spectrum components. This package provides common types used across all Vue Spectrum packages.

## Installation

```bash
npm install @vue-types/shared
```

## Usage

```typescript
import type {
  Key,
  Collection,
  Node,
  FocusableProps,
  AriaLabelingProps,
  PressEvents,
} from "@vue-types/shared";
```

## Types

### Core Types

- `Key` - Unique identifier type (string | number)
- `Collection<T>` - Interface for iterable collections
- `Node<T>` - Represents a node in a tree structure

### Accessibility

- `AriaLabelingProps` - ARIA labeling properties
- `FocusableProps` - Focus management properties
- `FocusableDOMProps` - DOM focus event handlers

### Interaction

- `PressEvents` - Press interaction event handlers
- `PressEvent` - Press event object

### Styling

- `StyleProps` - CSS styling properties
- `DOMProps` - DOM element properties

## License

Apache 2.0
