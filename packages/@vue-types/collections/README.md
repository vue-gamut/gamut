# @vue-types/collections

TypeScript type definitions for Vue collection components. This package provides comprehensive type definitions for building accessible, composable collections in Vue applications.

## Installation

```bash
npm install @vue-types/collections
```

## Usage

```typescript
import type {
  CollectionProps,
  ItemProps,
  SectionProps,
  Node,
  Collection,
} from "@vue-types/collections";
```

## Types

### Core Types

- `Collection<T>` - Interface for collection implementations
- `Node<T>` - Represents a single node in a collection
- `PartialNode<T>` - Partial node used during collection building

### Component Props

- `CollectionProps<T>` - Props for collection components
- `ItemProps<T>` - Props for item components
- `SectionProps<T>` - Props for section components

### State Management

- `CollectionStateBase<T>` - Base interface for collection state

## License

Apache 2.0
