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

import { ItemProps } from "@vue-types/collections";
import { PartialNode } from "./types";
import { VNode, defineComponent, isVNode } from "vue";

function Item<T>(props: ItemProps<T>): VNode | null {
  // eslint-disable-line @typescript-eslint/no-unused-vars
  return null;
}

Item.getCollectionNode = function* getCollectionNode<T>(
  props: ItemProps<T>,
  context: any
): Generator<PartialNode<T>> {
  let { childItems, title, children } = props;

  let rendered = props.title || props.children;
  let textValue =
    props.textValue ||
    (typeof rendered === "string" ? rendered : "") ||
    props["aria-label"] ||
    "";

  // suppressTextValueWarning is used in components like Tabs, which don't have type to select support.
  if (
    !textValue &&
    !context?.suppressTextValueWarning &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn(
      "<Item> with non-plain text contents is unsupported by type to select for accessibility. Please add a `textValue` prop."
    );
  }

  yield {
    type: "item",
    props: props,
    rendered,
    textValue,
    "aria-label": props["aria-label"],
    hasChildNodes: hasChildItems(props),
    *childNodes() {
      if (childItems) {
        for (let child of childItems) {
          yield {
            type: "item",
            value: child,
          };
        }
      } else if (title) {
        let items: PartialNode<T>[] = [];

        // Handle Vue children
        if (Array.isArray(children)) {
          children.filter(isVNode).forEach((child) => {
            items.push({
              type: "item",
              element: child,
            });
          });
        } else if (isVNode(children)) {
          items.push({
            type: "item",
            element: children,
          });
        }

        yield* items;
      }
    },
  };
};

function hasChildItems<T>(props: ItemProps<T>) {
  if (props.hasChildItems != null) {
    return props.hasChildItems;
  }

  if (props.childItems) {
    return true;
  }

  if (
    props.title &&
    ((Array.isArray(props.children) &&
      props.children.filter(isVNode).length > 0) ||
      isVNode(props.children))
  ) {
    return true;
  }

  return false;
}

// We don't want getCollectionNode to show up in the type definition
let _Item = Item as <T>(props: ItemProps<T>) => VNode | null;
export { _Item as Item };
