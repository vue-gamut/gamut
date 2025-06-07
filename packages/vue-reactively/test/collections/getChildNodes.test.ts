import { describe, it, expect } from "vitest";
import {
  getChildNodes,
  getFirstItem,
  getLastItem,
  getNthItem,
  compareNodeOrder,
} from "@vue-reactively/collections/getChildNodes";

// Mock types for testing
interface MockNode {
  type: string;
  key: string;
  value: any;
  textValue: string;
  hasChildNodes: boolean;
  childNodes: MockNode[];
  props: any;
  index: number;
  parentKey: string | null;
}

interface MockCollection {
  size: number;
  getKeys: () => string[];
  getItem: (key: string) => MockNode | null;
  at: (idx: number) => MockNode | null;
  getKeyBefore: (key: string) => string | null;
  getKeyAfter: (key: string) => string | null;
  getFirstKey: () => string | null;
  getLastKey: () => string | null;
  getChildren?: (key: string) => MockNode[];
  [Symbol.iterator]: () => Iterator<MockNode>;
}

describe("getChildNodes", () => {
  const createMockNode = (
    key: string,
    index: number,
    parentKey?: string
  ): MockNode => ({
    type: "item",
    key,
    value: { id: key },
    textValue: `Item ${key}`,
    hasChildNodes: false,
    childNodes: [],
    props: {},
    index,
    parentKey: parentKey || null,
  });

  const createMockCollection = (nodes: MockNode[]): MockCollection => {
    const nodeMap = new Map(nodes.map((node) => [node.key, node]));

    return {
      size: nodes.length,
      getKeys: () => nodes.map((n) => n.key),
      getItem: (key) => nodeMap.get(key) || null,
      at: (idx) => nodes[idx] || null,
      getKeyBefore: (key) => {
        const idx = nodes.findIndex((n) => n.key === key);
        return idx > 0 ? nodes[idx - 1].key : null;
      },
      getKeyAfter: (key) => {
        const idx = nodes.findIndex((n) => n.key === key);
        return idx < nodes.length - 1 ? nodes[idx + 1].key : null;
      },
      getFirstKey: () => nodes[0]?.key || null,
      getLastKey: () => nodes[nodes.length - 1]?.key || null,
      getChildren: (key) => nodes.filter((n) => n.parentKey === key),
      [Symbol.iterator]: function* () {
        yield* nodes;
      },
    };
  };

  it("should return child nodes from collection.getChildren when available", () => {
    const childNodes = [
      createMockNode("child1", 0, "parent"),
      createMockNode("child2", 1, "parent"),
    ];
    const parentNode = createMockNode("parent", 0);
    const collection = createMockCollection([parentNode, ...childNodes]);

    const result = Array.from(
      getChildNodes(parentNode as any, collection as any)
    );
    expect(result).toEqual(childNodes);
  });

  it("should return node.childNodes when collection.getChildren is not available", () => {
    const childNodes = [
      createMockNode("child1", 0),
      createMockNode("child2", 1),
    ];
    const parentNode = { ...createMockNode("parent", 0), childNodes };
    const collection = {
      ...createMockCollection([parentNode]),
      getChildren: undefined,
    };

    const result = Array.from(
      getChildNodes(parentNode as any, collection as any)
    );
    expect(result).toEqual(childNodes);
  });

  it("should handle empty child nodes", () => {
    const parentNode = createMockNode("parent", 0);
    const collection = createMockCollection([parentNode]);

    const result = Array.from(
      getChildNodes(parentNode as any, collection as any)
    );
    expect(result).toEqual([]);
  });
});

describe("getFirstItem", () => {
  it("should return first item from iterable", () => {
    const items = ["a", "b", "c"];
    expect(getFirstItem(items)).toBe("a");
  });

  it("should return undefined for empty iterable", () => {
    expect(getFirstItem([])).toBeUndefined();
  });

  it("should work with generator", () => {
    function* generator() {
      yield "first";
      yield "second";
    }
    expect(getFirstItem(generator())).toBe("first");
  });
});

describe("getLastItem", () => {
  it("should return last item from iterable", () => {
    const items = ["a", "b", "c"];
    expect(getLastItem(items)).toBe("c");
  });

  it("should return undefined for empty iterable", () => {
    expect(getLastItem([])).toBeUndefined();
  });

  it("should work with generator", () => {
    function* generator() {
      yield "first";
      yield "second";
      yield "last";
    }
    expect(getLastItem(generator())).toBe("last");
  });
});

describe("getNthItem", () => {
  it("should return nth item from iterable", () => {
    const items = ["a", "b", "c"];
    expect(getNthItem(items, 0)).toBe("a");
    expect(getNthItem(items, 1)).toBe("b");
    expect(getNthItem(items, 2)).toBe("c");
  });

  it("should return undefined for out of bounds index", () => {
    const items = ["a", "b", "c"];
    expect(getNthItem(items, 5)).toBeUndefined();
    expect(getNthItem(items, -1)).toBeUndefined();
  });

  it("should work with generator", () => {
    function* generator() {
      yield "zero";
      yield "one";
      yield "two";
    }
    expect(getNthItem(generator(), 1)).toBe("one");
  });
});

describe("compareNodeOrder", () => {
  const createMockNode = (
    key: string,
    index: number,
    parentKey?: string
  ): MockNode => ({
    type: "item",
    key,
    value: { id: key },
    textValue: `Item ${key}`,
    hasChildNodes: false,
    childNodes: [],
    props: {},
    index,
    parentKey: parentKey || null,
  });

  const createMockCollection = (nodes: MockNode[]): MockCollection => {
    const nodeMap = new Map(nodes.map((node) => [node.key, node]));

    return {
      size: nodes.length,
      getKeys: () => nodes.map((n) => n.key),
      getItem: (key) => nodeMap.get(key) || null,
      at: (idx) => nodes[idx] || null,
      getKeyBefore: () => null,
      getKeyAfter: () => null,
      getFirstKey: () => nodes[0]?.key || null,
      getLastKey: () => nodes[nodes.length - 1]?.key || null,
      [Symbol.iterator]: function* () {
        yield* nodes;
      },
    };
  };

  it("should compare nodes with same parent by index", () => {
    const nodeA = createMockNode("a", 0, "parent");
    const nodeB = createMockNode("b", 1, "parent");
    const collection = createMockCollection([nodeA, nodeB]);

    expect(
      compareNodeOrder(collection as any, nodeA as any, nodeB as any)
    ).toBeLessThan(0);
    expect(
      compareNodeOrder(collection as any, nodeB as any, nodeA as any)
    ).toBeGreaterThan(0);
  });

  it("should handle nodes with different parents", () => {
    const nodeA = createMockNode("a", 0, "parent1");
    const nodeB = createMockNode("b", 0, "parent2");
    const parent1 = createMockNode("parent1", 0);
    const parent2 = createMockNode("parent2", 1);
    const collection = createMockCollection([parent1, parent2, nodeA, nodeB]);

    const result = compareNodeOrder(
      collection as any,
      nodeA as any,
      nodeB as any
    );
    expect(result).toBeLessThan(0);
  });

  it("should handle nodes at same index with same parent", () => {
    const nodeA = createMockNode("a", 0, "parent");
    const nodeB = createMockNode("b", 0, "parent");
    const collection = createMockCollection([nodeA, nodeB]);

    const result = compareNodeOrder(
      collection as any,
      nodeA as any,
      nodeB as any
    );
    expect(result).toBe(0);
  });
});
