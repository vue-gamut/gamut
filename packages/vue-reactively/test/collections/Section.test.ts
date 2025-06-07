import { describe, it, expect } from "vitest";
import { h } from "vue";
import { Section } from "@vue-reactively/collections/Section";

describe("Section", () => {
  describe("component", () => {
    it("should return null when called as function", () => {
      const props = {
        children: "Test section",
      };

      const result = (Section as any)(props);
      expect(result).toBeNull();
    });
  });

  describe("getCollectionNode", () => {
    it("should generate section node with basic props", () => {
      const props = {
        title: "Section Title",
        children: "Section content",
      };

      const generator = (Section as any).getCollectionNode(props);
      const result = generator.next();

      expect(result.done).toBe(false);
      expect(result.value).toMatchObject({
        type: "section",
        props: props,
        hasChildNodes: true,
        rendered: "Section Title",
      });
    });

    it("should include aria-label when provided", () => {
      const props = {
        title: "Section Title",
        children: "Content",
        "aria-label": "Accessible section label",
      };

      const generator = (Section as any).getCollectionNode(props);
      const result = generator.next();

      expect(result.value["aria-label"]).toBe("Accessible section label");
    });

    it("should always have hasChildNodes as true", () => {
      const props = {
        children: "Content",
      };

      const generator = (Section as any).getCollectionNode(props);
      const result = generator.next();

      expect(result.value.hasChildNodes).toBe(true);
    });
  });

  describe("childNodes", () => {
    it("should yield items from function children with items", () => {
      const items = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];

      const renderItem = (item: any) => h("div", { key: item.id }, item.name);

      const props = {
        children: renderItem,
        items,
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      const childNodes = Array.from(sectionNode.childNodes());
      expect(childNodes).toHaveLength(2);

      expect(childNodes[0]).toMatchObject({
        type: "item",
        value: items[0],
        renderer: renderItem,
      });

      expect(childNodes[1]).toMatchObject({
        type: "item",
        value: items[1],
        renderer: renderItem,
      });
    });

    it("should throw error when children is function but items missing", () => {
      const props = {
        children: (item: any) => h("div", item.name),
        // Missing items
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      expect(() => Array.from(sectionNode.childNodes())).toThrow(
        "props.children was a function but props.items is missing"
      );
    });

    it("should yield Vue node children when not a function", () => {
      const children = [
        h("Item", { key: "1" }, "Child 1"),
        h("Item", { key: "2" }, "Child 2"),
      ];

      const props = {
        children,
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      const childNodes = Array.from(sectionNode.childNodes());
      expect(childNodes).toHaveLength(2);

      expect(childNodes[0]).toMatchObject({
        type: "item",
        element: children[0],
      });

      expect(childNodes[1]).toMatchObject({
        type: "item",
        element: children[1],
      });
    });

    it("should handle single VNode child", () => {
      const child = h("Item", { key: "1" }, "Single child");

      const props = {
        children: child,
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      const childNodes = Array.from(sectionNode.childNodes());
      expect(childNodes).toHaveLength(1);

      expect(childNodes[0]).toMatchObject({
        type: "item",
        element: child,
      });
    });

    it("should handle empty children array", () => {
      const props = {
        children: [],
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      const childNodes = Array.from(sectionNode.childNodes());
      expect(childNodes).toHaveLength(0);
    });

    it("should filter out non-VNode children", () => {
      const children = [
        h("Item", { key: "1" }, "Valid child"),
        "string child", // Should be filtered out
        null, // Should be filtered out
        h("Item", { key: "2" }, "Another valid child"),
      ];

      const props = {
        children,
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      const childNodes = Array.from(sectionNode.childNodes());
      expect(childNodes).toHaveLength(2);

      expect(childNodes[0].element).toBe(children[0]);
      expect(childNodes[1].element).toBe(children[3]);
    });

    it("should work with mixed static and dynamic content", () => {
      const staticItems = [
        h("Item", { key: "static-1" }, "Static Item 1"),
        h("Item", { key: "static-2" }, "Static Item 2"),
      ];

      const props = {
        title: "Mixed Section",
        children: staticItems,
      };

      const generator = (Section as any).getCollectionNode(props);
      const sectionNode = generator.next().value;

      expect(sectionNode.rendered).toBe("Mixed Section");

      const childNodes = Array.from(sectionNode.childNodes());
      expect(childNodes).toHaveLength(2);
    });
  });
});
