import { describe, it, expect } from "vitest";
import * as Collections from "@vue-reactively/collections";

describe("@vue-reactively/collections exports", () => {
  it("should export all expected functions and components", () => {
    // Check that all main exports are available
    expect(Collections.useCollection).toBeDefined();
    expect(Collections.CollectionBuilder).toBeDefined();
    expect(Collections.Item).toBeDefined();
    expect(Collections.Section).toBeDefined();
    expect(Collections.getChildNodes).toBeDefined();
    expect(Collections.getFirstItem).toBeDefined();
    expect(Collections.getLastItem).toBeDefined();
    expect(Collections.getNthItem).toBeDefined();
    expect(Collections.compareNodeOrder).toBeDefined();
    expect(Collections.getItemCount).toBeDefined();
  });

  it("should export types", () => {
    // Types should be available for import (tested during TypeScript compilation)
    // This test mainly ensures the module loads correctly
    expect(typeof Collections.useCollection).toBe("function");
    expect(typeof Collections.CollectionBuilder).toBe("function");
    expect(typeof Collections.Item).toBe("function");
    expect(typeof Collections.Section).toBe("function");
  });

  it("should have correct function signatures", () => {
    // Verify that functions have expected signatures
    expect(Collections.useCollection.length).toBeGreaterThan(0);
    expect(Collections.getChildNodes.length).toBe(2);
    expect(Collections.getFirstItem.length).toBe(1);
    expect(Collections.getLastItem.length).toBe(1);
    expect(Collections.getNthItem.length).toBe(2);
    expect(Collections.compareNodeOrder.length).toBe(3);
    expect(Collections.getItemCount.length).toBe(1);
  });

  it("should have correct component structure", () => {
    // Verify components have expected getCollectionNode methods
    expect((Collections.Item as any).getCollectionNode).toBeDefined();
    expect((Collections.Section as any).getCollectionNode).toBeDefined();
    expect(typeof (Collections.Item as any).getCollectionNode).toBe("function");
    expect(typeof (Collections.Section as any).getCollectionNode).toBe(
      "function"
    );
  });
});
