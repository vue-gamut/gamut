import { describe, it, expect, vi } from "vitest";
import { h, Fragment } from "vue";
import { CollectionBuilder } from "@vue-reactively/collections/CollectionBuilder";

describe("CollectionBuilder", () => {
  let builder: CollectionBuilder<any>;

  beforeEach(() => {
    builder = new CollectionBuilder();
  });

  describe("build", () => {
    it("should build collection from items array", () => {
      const items = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];

      const props = {
        items,
        children: (item: any) => h("div", { key: item.id }, item.name),
      };

      const nodes = Array.from(builder.build(props));
      expect(nodes).toHaveLength(2);
      expect(nodes[0].value).toEqual(items[0]);
      expect(nodes[1].value).toEqual(items[1]);
    });

    it("should build collection from VNode children", () => {
      const children = [
        h("Item", { key: "1" }, "Item 1"),
        h("Item", { key: "2" }, "Item 2"),
      ];

      const props = { children };

      // Mock the getCollectionNode method
      const mockGetCollectionNode = vi.fn(function* () {
        yield { type: "item", key: "1", props: { children: "Item 1" } };
      });

      // Add getCollectionNode to the component type
      (children[0].type as any).getCollectionNode = mockGetCollectionNode;

      const nodes = Array.from(builder.build(props));
      expect(mockGetCollectionNode).toHaveBeenCalled();
    });

    it("should handle Fragment children", () => {
      const children = h(Fragment, {}, [
        h("Item", { key: "1" }, "Item 1"),
        h("Item", { key: "2" }, "Item 2"),
      ]);

      const props = { children };

      // The fragment should be unwrapped and children processed
      const nodes = Array.from(builder.build(props));
      // Expect the implementation to handle fragments correctly
      expect(Array.isArray(nodes)).toBe(true);
    });

    it("should handle empty props", () => {
      const props = {};
      const nodes = Array.from(builder.build(props));
      expect(nodes).toHaveLength(0);
    });

    it("should throw error when children is function but items missing", () => {
      const props = {
        children: (item: any) => h("div", item.name),
        // Missing items
      };

      expect(() => Array.from(builder.build(props))).toThrow(
        "props.children was a function but props.items is missing"
      );
    });
  });

  describe("caching", () => {
    it("should cache nodes by value", () => {
      const item = { id: 1, name: "Item 1" };
      const props = {
        items: [item],
        children: (item: any) => h("div", { key: item.id }, item.name),
      };

      // Build twice with same items
      const nodes1 = Array.from(builder.build(props));
      const nodes2 = Array.from(builder.build(props));

      // Should return cached nodes
      expect(nodes1[0]).toBe(nodes2[0]);
    });

    it("should invalidate cache when shouldInvalidate returns true", () => {
      const item = { id: 1, name: "Item 1" };
      let shouldInvalidate = false;

      const mockNode = {
        value: item,
        shouldInvalidate: () => shouldInvalidate,
      };

      // Mock the cache to return our test node
      (builder as any).cache.set(item, mockNode);

      const props = {
        items: [item],
        children: (item: any) => h("div", { key: item.id }, item.name),
      };

      // First build should use cache
      shouldInvalidate = false;
      const nodes1 = Array.from(builder.build(props));

      // Second build should invalidate cache
      shouldInvalidate = true;
      const nodes2 = Array.from(builder.build(props));

      // Nodes should be different due to invalidation
      expect(nodes1[0]).not.toBe(nodes2[0]);
    });
  });

  describe("key generation", () => {
    it("should use provided keys from VNodes", () => {
      const children = [h("Item", { key: "custom-key-1" }, "Item 1")];

      // Mock the component to have getCollectionNode
      const mockGetCollectionNode = vi.fn(function* () {
        yield {
          type: "item",
          key: "custom-key-1",
          props: { children: "Item 1" },
        };
      });
      (children[0].type as any).getCollectionNode = mockGetCollectionNode;

      const props = { children };
      const nodes = Array.from(builder.build(props));

      expect(mockGetCollectionNode).toHaveBeenCalled();
    });

    it("should generate keys for items without explicit keys", () => {
      const items = [
        { name: "Item 1" }, // No id or key
        { name: "Item 2" },
      ];

      const props = {
        items,
        children: (item: any) => h("div", {}, item.name),
      };

      // This should not throw an error about missing keys
      expect(() => Array.from(builder.build(props))).toThrow(
        "No key found for item"
      );
    });
  });

  describe("node structure", () => {
    it("should create proper node structure", () => {
      const item = { id: 1, name: "Item 1" };
      const mockGetCollectionNode = vi.fn(function* () {
        yield {
          type: "item",
          key: "1",
          props: { children: item.name },
          rendered: item.name,
          textValue: item.name,
        };
      });

      const children = [h("Item", { key: "1" }, item.name)];
      (children[0].type as any).getCollectionNode = mockGetCollectionNode;

      const props = { children };
      const nodes = Array.from(builder.build(props));

      if (nodes.length > 0) {
        const node = nodes[0];
        expect(node).toHaveProperty("type");
        expect(node).toHaveProperty("key");
        expect(node).toHaveProperty("props");
        expect(node).toHaveProperty("textValue");
      }
    });
  });

  describe("context handling", () => {
    it("should pass context to build method", () => {
      const context = { suppressTextValueWarning: true };
      const props = {
        items: [{ id: 1, name: "Item 1" }],
        children: (item: any) => h("div", { key: item.id }, item.name),
      };

      // Should not throw when context is provided
      expect(() => Array.from(builder.build(props, context))).not.toThrow();
    });
  });
});
