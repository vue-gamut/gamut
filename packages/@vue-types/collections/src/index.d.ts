/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Key } from "@vue-types/shared";
import { VNode, Component } from "vue";

export interface PartialNode<T> {
  type?: string;
  key?: Key | null;
  value?: T;
  element?: VNode | null;
  wrapper?: (element: VNode) => VNode;
  rendered?: VNode | string | number | null;
  textValue?: string;
  "aria-label"?: string;
  index?: number;
  renderer?: (item: T) => VNode | null;
  hasChildNodes?: boolean;
  childNodes?: () => IterableIterator<PartialNode<T>>;
  props?: any;
  shouldInvalidate?: (context: any) => boolean;
}

export interface CollectionProps<T> {
  /** The contents of the collection. */
  children?: VNode | VNode[] | ((item: T) => VNode | null);
  /** Item objects in the collection. */
  items?: Iterable<T>;
  /** A pre-constructed collection to use instead of constructing one from items and children. */
  collection?: Collection<Node<T>>;
  /** A function that returns a unique key for an item object. */
  getKey?: (item: T) => Key;
  /** A function that returns whether an item should be disabled. */
  disabledKeys?: Iterable<Key>;
}

export interface Node<T> {
  /** The type of the node. */
  type: string;
  /** The object value the node was created from. */
  value: T;
  /** A unique key for the node. */
  key: Key;
  /** The rendered element for the node. */
  element?: VNode | null;
  /** A function that wraps the rendered element for the node. */
  wrapper?: (element: VNode) => VNode;
  /** The rendered children of this node. */
  rendered?: VNode | string | number | null;
  /** A plain text representation of the node's contents, used for features like typeahead. */
  textValue: string;
  /** An accessibility label for the node. */
  "aria-label"?: string;
  /** The level of the node in the hierarchy if this is a heading. */
  level?: number;
  /** Whether the node has children, even if not loaded yet. */
  hasChildNodes: boolean;
  /** The child nodes of this node. */
  childNodes: Iterable<Node<T>>;
  /** The key of the parent node. */
  parentKey?: Key | null;
  /** The key of the node before this node. */
  prevKey?: Key | null;
  /** The key of the node after this node. */
  nextKey?: Key | null;
  /** Additional properties specific to a particular node type. */
  props?: any;
  /** The index of this node within its parent. */
  index?: number;
  /** A function that should return whether a node should be invalidated. */
  shouldInvalidate?: (context: any) => boolean;
}

export interface Collection<T> extends Iterable<T> {
  /** The number of items in the collection. */
  readonly size: number;
  /** Iterate over all keys in the collection. */
  getKeys(): Iterable<Key>;
  /** Get an item by its key. */
  getItem(key: Key): T | null;
  /** Get an item by the index of its key. */
  at(idx: number): T | null;
  /** Get the key that comes before the given key in the collection. */
  getKeyBefore(key: Key): Key | null;
  /** Get the key that comes after the given key in the collection. */
  getKeyAfter(key: Key): Key | null;
  /** Get the first key in the collection. */
  getFirstKey(): Key | null;
  /** Get the last key in the collection. */
  getLastKey(): Key | null;
  /** Iterate over the child nodes of the given key. */
  getChildren?(key: Key): Iterable<T>;
  /** Returns a string representation of the item's contents. */
  getTextValue?(key: Key): string;
}

export interface CollectionStateBase<
  T,
  C extends Collection<Node<T>> = Collection<Node<T>>
> {
  /** A pre-constructed collection to use instead of constructing one from items and children. */
  collection?: C;
  /** The contents of the collection. */
  children?: VNode | VNode[] | ((item: T) => VNode | null);
  /** Item objects in the collection. */
  items?: Iterable<T>;
  /** A function that returns a unique key for an item object. */
  getKey?: (item: T) => Key;
  /** A function that returns whether an item should be disabled. */
  disabledKeys?: Iterable<Key>;
}

export interface ItemProps<T = object> {
  /** Rendered contents of the item or child items. */
  children: VNode | VNode[] | ((item: T) => VNode);
  /** The object value that this item represents. When using dynamic collections, this is set automatically. */
  value?: T;
  /** A string representation of the item's contents, used for features like typeahead. */
  textValue?: string;
  /** An accessibility label for this item. */
  "aria-label"?: string;
  /** A unique key for the item. */
  key?: Key;
}

export interface SectionProps<T = object> {
  /** Rendered contents of the section, e.g. a header. */
  title?: VNode;
  /** An accessibility label for the section. */
  "aria-label"?: string;
  /** Static child items or a function to render children. */
  children: VNode | VNode[] | ((item: T) => VNode);
  /** Item objects in the section. */
  items?: Iterable<T>;
  /** A unique key for the section. */
  key?: Key;
}

export interface CollectionBuilderProps<T> {
  children?: VNode | VNode[] | ((item: T) => VNode | null);
  items?: Iterable<T>;
}
