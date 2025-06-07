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

export type Key = string | number;

export interface FocusableProps {
  /** Whether the element should receive focus on render. */
  autoFocus?: boolean;
}

export interface FocusableDOMProps extends FocusableProps {
  /** Handler that is called when the element receives focus. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler that is called when the element loses focus. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler that is called when the element's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
}

export interface AriaLabelingProps {
  /** Defines a string value that labels the current element. */
  "aria-label"?: string;
  /** Identifies the element (or elements) that labels the current element. */
  "aria-labelledby"?: string;
  /** Identifies the element (or elements) that describes the object. */
  "aria-describedby"?: string;
  /** Identifies the element (or elements) that provide a detailed, extended description for the object. */
  "aria-details"?: string;
}

export interface PressEvents {
  /** Handler that is called when the press is released over the target. */
  onPress?: (e: PressEvent) => void;
  /** Handler that is called when a press interaction starts. */
  onPressStart?: (e: PressEvent) => void;
  /** Handler that is called when a press interaction ends, either over the target or when the pointer leaves the target. */
  onPressEnd?: (e: PressEvent) => void;
  /** Handler that is called when the press state changes. */
  onPressChange?: (isPressed: boolean) => void;
  /** Handler that is called when a press is released over the target, regardless of whether it started on the target or not. */
  onPressUp?: (e: PressEvent) => void;
}

export interface PressEvent {
  /** The type of press event being fired. */
  type: "pressstart" | "pressend" | "pressup" | "press";
  /** The pointer type that triggered the press event. */
  pointerType: "mouse" | "pen" | "touch" | "keyboard" | "virtual";
  /** The target element of the press event. */
  target: Element;
  /** Whether the shift keyboard modifier was held during the press event. */
  shiftKey: boolean;
  /** Whether the ctrl keyboard modifier was held during the press event. */
  ctrlKey: boolean;
  /** Whether the meta keyboard modifier was held during the press event. */
  metaKey: boolean;
  /** Whether the alt keyboard modifier was held during the press event. */
  altKey: boolean;
}

export interface StyleProps {
  /** The CSS class name for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: string | object;
}

export interface DOMProps extends StyleProps {
  /** The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). */
  id?: string;
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

export interface Node<T> {
  /** The type of the node. */
  type: string;
  /** The object value the node was created from. */
  value: T;
  /** A unique key for the node. */
  key: Key;
  /** Whether the node has children, even if not loaded yet. */
  hasChildNodes: boolean;
  /** The child nodes of this node. */
  childNodes: Iterable<Node<T>>;
  /** A plain text representation of the node's contents, used for features like typeahead. */
  textValue: string;
  /** An accessibility label for the node. */
  "aria-label"?: string;
  /** The index of this node within its parent. */
  index?: number;
  /** Additional properties specific to a particular node type. */
  props?: any;
  /** The key of the parent node. */
  parentKey?: Key | null;
  /** The key of the node before this node. */
  prevKey?: Key | null;
  /** The key of the node after this node. */
  nextKey?: Key | null;
}

export interface CollectionStateBase<
  T,
  C extends Collection<Node<T>> = Collection<Node<T>>
> {
  /** A pre-constructed collection to use instead of constructing one from items and children. */
  collection?: C;
  /** Item objects in the collection. */
  items?: Iterable<T>;
  /** A function that returns a unique key for an item object. */
  getKey?: (item: T) => Key;
  /** A function that returns whether an item should be disabled. */
  disabledKeys?: Iterable<Key>;
}
