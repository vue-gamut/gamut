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

import { Collection, CollectionStateBase, Node } from "@vue-types/shared";
import { CollectionBuilder } from "./CollectionBuilder";
import { VNode, computed, ref } from "vue";

interface CollectionOptions<T, C extends Collection<Node<T>>>
  extends Omit<CollectionStateBase<T, C>, "children"> {
  children?: VNode | VNode[] | ((item: T) => VNode | null);
}

type CollectionFactory<T, C extends Collection<Node<T>>> = (
  node: Iterable<Node<T>>
) => C;

export function useCollection<
  T extends object,
  C extends Collection<Node<T>> = Collection<Node<T>>
>(
  props: CollectionOptions<T, C>,
  factory: CollectionFactory<T, C>,
  context?: unknown
) {
  const builder = ref(new CollectionBuilder<T>());

  return computed(() => {
    const { children, items, collection } = props;

    if (collection) {
      return collection;
    }

    const nodes = builder.value.build({ children, items }, context);
    return factory(nodes);
  });
}
