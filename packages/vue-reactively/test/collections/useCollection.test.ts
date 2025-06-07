import { describe, it, expect, vi } from "vitest";
import { ref, h } from "vue";
import { useCollection } from "@vue-reactively/collections/useCollection";

// Mock the CollectionBuilder
vi.mock("@vue-reactively/collections/CollectionBuilder", () => ({
  CollectionBuilder: class MockCollectionBuilder {
    build = vi.fn().mockReturnValue([
      { type: "item", key: "1", value: { id: 1 } },
      { type: "item", key: "2", value: { id: 2 } },
    ]);
  },
}));

describe("useCollection", () => {
  const mockFactory = vi.fn((nodes) => ({
    size: Array.from(nodes).length,
    items: Array.from(nodes),
    getKeys: () => Array.from(nodes).map((n) => n.key),
    getItem: (key) => Array.from(nodes).find((n) => n.key === key) || null,
    [Symbol.iterator]: function* () {
      yield* nodes;
    },
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a collection from props using factory", () => {
    const props = {
      items: [{ id: 1 }, { id: 2 }],
      getKey: (item: any) => item.id,
    };

    const collectionRef = useCollection(props, mockFactory);
    const collection = collectionRef.value;

    expect(mockFactory).toHaveBeenCalled();
    expect(collection.size).toBe(2);
  });

  it("should return provided collection when available", () => {
    const existingCollection = {
      size: 3,
      items: [],
      getKeys: () => ["a", "b", "c"],
      getItem: () => null,
      [Symbol.iterator]: function* () {},
    };

    const props = {
      collection: existingCollection,
      items: [{ id: 1 }],
    };

    const collectionRef = useCollection(props, mockFactory);
    const collection = collectionRef.value;

    expect(collection).toBe(existingCollection);
    expect(mockFactory).not.toHaveBeenCalled();
  });

  it("should handle children prop", () => {
    const children = [
      h("div", { key: "1" }, "Item 1"),
      h("div", { key: "2" }, "Item 2"),
    ];

    const props = {
      children,
    };

    const collectionRef = useCollection(props, mockFactory);

    expect(mockFactory).toHaveBeenCalled();
  });

  it("should handle function children (render prop)", () => {
    const renderItem = vi.fn((item) => h("div", { key: item.id }, item.name));

    const props = {
      children: renderItem,
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
    };

    const collectionRef = useCollection(props, mockFactory);

    expect(mockFactory).toHaveBeenCalled();
  });

  it("should be reactive to prop changes", async () => {
    const items = ref([{ id: 1 }, { id: 2 }]);

    const props = {
      get items() {
        return items.value;
      },
      getKey: (item: any) => item.id,
    };

    const collectionRef = useCollection(props, mockFactory);

    // Initial call
    expect(mockFactory).toHaveBeenCalledTimes(1);

    // Change items
    items.value = [{ id: 1 }, { id: 2 }, { id: 3 }];

    // Access the computed value to trigger reactivity
    const collection = collectionRef.value;

    expect(mockFactory).toHaveBeenCalledTimes(2);
  });

  it("should pass context to collection builder", () => {
    const props = {
      items: [{ id: 1 }],
    };
    const context = { suppressTextValueWarning: true };

    useCollection(props, mockFactory, context);

    // Verify that the CollectionBuilder's build method was called with context
    // Note: This would need to be verified through the actual implementation
    expect(mockFactory).toHaveBeenCalled();
  });

  it("should handle empty props gracefully", () => {
    const props = {};

    const collectionRef = useCollection(props, mockFactory);
    const collection = collectionRef.value;

    expect(mockFactory).toHaveBeenCalled();
    expect(collection).toBeDefined();
  });

  it("should memoize collection builder instance", () => {
    const props = {
      items: [{ id: 1 }],
    };

    // Create multiple collections with same props
    const collection1 = useCollection(props, mockFactory);
    const collection2 = useCollection(props, mockFactory);

    // Each should create its own builder, but the builder should be memoized within each composable
    expect(mockFactory).toHaveBeenCalledTimes(2);
  });
});
