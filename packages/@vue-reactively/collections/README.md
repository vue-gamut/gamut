# @vue-reactively/collections

Vue collection utilities for building accessible, composable collections in Vue applications. This package provides Vue-compatible implementations of Adobe Spectrum's collection management system.

## Features

- **Vue 2 & 3 Support**: Compatible with both Vue 2.6+ and Vue 3
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Composable**: Built using Vue's Composition API for maximum flexibility
- **Accessible**: Designed with accessibility in mind following ARIA patterns

## Installation

```bash
npm install @vue-reactively/collections
```

## Usage

### Basic Collection

```vue
<script setup lang="ts">
import { useCollection, Item, Section } from "@vue-reactively/collections";
import { computed } from "vue";

const items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

const collection = useCollection(
  {
    items,
    getKey: (item) => item.id,
  },
  (nodes) => new MyCollection(nodes)
);
</script>
```

### With Sections

```vue
<template>
  <Section title="Section 1">
    <Item v-for="item in items" :key="item.id">
      {{ item.name }}
    </Item>
  </Section>
</template>
```

## API

### `useCollection(props, factory, context?)`

A Vue composable for creating and managing collections.

### `Item`

A component for representing individual items in a collection.

### `Section`

A component for grouping items into sections.

## Migration from React

This package is designed to be API-compatible with `@react-stately/collections`, making migration straightforward:

- Replace React hooks with Vue composables
- Replace JSX with Vue templates or render functions
- Update import statements

## License

Apache 2.0
