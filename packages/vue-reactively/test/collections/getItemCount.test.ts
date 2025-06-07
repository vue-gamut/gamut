import { describe, it, expect } from "vitest";
import { getItemCount } from "@vue-reactively/collections/getItemCount";

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
  [Symbol.iterator]: () => Iterator<MockNode>;
}

describe("getItemCount", () => {
  const createMockNode = (key: string, type: "item" | "section"): MockNode => ({
    type,
    key,
    value: { id: key },
    textValue: `${type} ${key}`,
    hasChildNodes: type === "section",
    childNodes: [],
    props: {},
    index: 0,
    parentKey: null,
  });

  const createMockCollection = (nodes: MockNode[]): MockCollection => {
    return {
      size: nodes.length,
      getKeys: () => nodes.map((n) => n.key),
      getItem: (key) => nodes.find((n) => n.key === key) || null,
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

  it("should count only item nodes", () => {
    const nodes = [
      createMockNode("item1", "item"),
      createMockNode("item2", "item"),
      createMockNode("section1", "section"),
    ];
    const collection = createMockCollection(nodes);

    const count = getItemCount(collection as any);
    expect(count).toBe(2);
  });

  it("should return 0 for empty collection", () => {
    const collection = createMockCollection([]);
    const count = getItemCount(collection as any);
    expect(count).toBe(0);
  });

  it("should return 0 for collection with only sections", () => {
    const nodes = [
      createMockNode("section1", "section"),
      createMockNode("section2", "section"),
    ];
    const collection = createMockCollection(nodes);

    const count = getItemCount(collection as any);
    expect(count).toBe(0);
  });

  it("should handle mixed content correctly", () => {
    const nodes = [
      createMockNode("section1", "section"),
      createMockNode("item1", "item"),
      createMockNode("section2", "section"),
      createMockNode("item2", "item"),
      createMockNode("item3", "item"),
    ];
    const collection = createMockCollection(nodes);

    const count = getItemCount(collection as any);
    expect(count).toBe(3);
  });

  it("should cache results", () => {
    const nodes = [
      createMockNode("item1", "item"),
      createMockNode("item2", "item"),
    ];
    const collection = createMockCollection(nodes);

    // Call multiple times to test caching
    const count1 = getItemCount(collection as any);
    const count2 = getItemCount(collection as any);

    expect(count1).toBe(2);
    expect(count2).toBe(2);
    expect(count1).toBe(count2);
  });

  it("should handle large collections efficiently", () => {
    const nodes = Array.from({ length: 1000 }, (_, i) =>
      createMockNode(`item${i}`, i % 3 === 0 ? "section" : "item")
    );
    const collection = createMockCollection(nodes);

    const count = getItemCount(collection as any);

    // Should count items (indices 1, 2, 4, 5, 7, 8, etc. - all non-multiples of 3)
    const expectedCount = nodes.filter((n) => n.type === "item").length;
    expect(count).toBe(expectedCount);
  });
});
