import { describe, it, expect, vi } from "vitest";
import { h } from "vue";
import { Item } from "@vue-reactively/collections/Item";

// Mock console.warn to test warning behavior
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn();
});

afterEach(() => {
  console.warn = originalWarn;
});

describe("Item", () => {
  describe("component", () => {
    it("should return null when called as function", () => {
      const props = {
        children: "Test item",
      };

      const result = (Item as any)(props);
      expect(result).toBeNull();
    });
  });

  describe("getCollectionNode", () => {
    it("should generate item node with basic props", () => {
      const props = {
        children: "Test item",
        textValue: "Test item",
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.done).toBe(false);
      expect(result.value).toMatchObject({
        type: "item",
        props: props,
        rendered: "Test item",
        textValue: "Test item",
        hasChildNodes: false,
      });
    });

    it("should use title as rendered content when provided", () => {
      const props = {
        title: "Item Title",
        children: "Child content",
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.rendered).toBe("Item Title");
    });

    it("should generate textValue from string children when not provided", () => {
      const props = {
        children: "String content",
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.textValue).toBe("String content");
    });

    it("should use aria-label as fallback textValue", () => {
      const props = {
        children: h("div", {}, "Complex content"),
        "aria-label": "Accessible label",
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.textValue).toBe("Accessible label");
      expect(result.value["aria-label"]).toBe("Accessible label");
    });

    it("should warn when textValue cannot be determined", () => {
      const props = {
        children: h("div", {}, "Complex content"),
        // No textValue or aria-label
      };

      const context = {}; // No suppressTextValueWarning

      const generator = (Item as any).getCollectionNode(props, context);
      generator.next();

      expect(console.warn).toHaveBeenCalledWith(
        "<Item> with non-plain text contents is unsupported by type to select for accessibility. Please add a `textValue` prop."
      );
    });

    it("should not warn when suppressTextValueWarning is true", () => {
      const props = {
        children: h("div", {}, "Complex content"),
      };

      const context = { suppressTextValueWarning: true };

      const generator = (Item as any).getCollectionNode(props, context);
      generator.next();

      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should not warn in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const props = {
        children: h("div", {}, "Complex content"),
      };

      const generator = (Item as any).getCollectionNode(props, {});
      generator.next();

      expect(console.warn).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("childNodes", () => {
    it("should yield child items when childItems provided", () => {
      const childItems = [
        { id: 1, name: "Child 1" },
        { id: 2, name: "Child 2" },
      ];

      const props = {
        children: "Parent item",
        childItems,
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const parentNode = generator.next().value;

      const childNodes = Array.from(parentNode.childNodes());
      expect(childNodes).toHaveLength(2);
      expect(childNodes[0]).toMatchObject({
        type: "item",
        value: childItems[0],
      });
      expect(childNodes[1]).toMatchObject({
        type: "item",
        value: childItems[1],
      });
    });

    it("should yield Vue node children when title provided", () => {
      const children = [
        h("Item", { key: "1" }, "Child 1"),
        h("Item", { key: "2" }, "Child 2"),
      ];

      const props = {
        title: "Parent title",
        children,
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const parentNode = generator.next().value;

      const childNodes = Array.from(parentNode.childNodes());
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
        title: "Parent title",
        children: child,
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const parentNode = generator.next().value;

      const childNodes = Array.from(parentNode.childNodes());
      expect(childNodes).toHaveLength(1);
      expect(childNodes[0]).toMatchObject({
        type: "item",
        element: child,
      });
    });
  });

  describe("hasChildItems", () => {
    it("should return true when hasChildItems explicitly set", () => {
      const props = {
        children: "Item",
        hasChildItems: true,
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.hasChildNodes).toBe(true);
    });

    it("should return false when hasChildItems explicitly set to false", () => {
      const props = {
        children: "Item",
        childItems: [{ id: 1 }], // Has items but explicit false
        hasChildItems: false,
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.hasChildNodes).toBe(false);
    });

    it("should return true when childItems provided", () => {
      const props = {
        children: "Item",
        childItems: [{ id: 1 }, { id: 2 }],
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.hasChildNodes).toBe(true);
    });

    it("should return true when title and Vue children provided", () => {
      const props = {
        title: "Parent",
        children: [h("Item", {}, "Child")],
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.hasChildNodes).toBe(true);
    });

    it("should return false when no children indicators present", () => {
      const props = {
        children: "Simple item",
      };

      const generator = (Item as any).getCollectionNode(props, {});
      const result = generator.next();

      expect(result.value.hasChildNodes).toBe(false);
    });
  });
});
