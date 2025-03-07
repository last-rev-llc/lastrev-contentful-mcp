import { expect } from "vitest";
import { entryHandlers } from "../../src/handlers/entry-handlers.js";
import { server } from "../msw-setup.js";

describe("Entry Handlers Integration Tests", () => {
  // Start MSW Server before tests
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const testSpaceId = "test-space-id";
  const testEntryId = "test-entry-id";
  const testContentTypeId = "test-content-type-id";

  describe("searchEntries", () => {
    it("should search all entries", async () => {
      const result = await entryHandlers.searchEntries({
        spaceId: testSpaceId,
        query: {
          content_type: testContentTypeId
        }
      });

      expect(result).to.have.property("content").that.is.an("array");
      expect(result.content).to.have.lengthOf(1);
      
      const entries = JSON.parse(result.content[0].text);
      expect(entries.items).to.be.an("array");
      expect(entries.items[0]).to.have.nested.property("sys.id", "test-entry-id");
      expect(entries.items[0]).to.have.nested.property("fields.title.en-US", "Test Entry");
    });
  });

  describe("getEntry", () => {
    it("should get details of a specific entry", async () => {
      const result = await entryHandlers.getEntry({
        spaceId: testSpaceId,
        entryId: testEntryId
      });

      expect(result).to.have.property("content");
      const entry = JSON.parse(result.content[0].text);
      expect(entry.sys.id).to.equal(testEntryId);
      expect(entry).to.have.nested.property("fields.title.en-US", "Test Entry");
    });

    it("should throw error for invalid entry ID", async () => {
      try {
        await entryHandlers.getEntry({
          spaceId: testSpaceId,
          entryId: "invalid-entry-id"
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("createEntry", () => {
    it("should create a new entry", async () => {
      const entryData = {
        spaceId: testSpaceId,
        contentTypeId: testContentTypeId,
        fields: {
          title: { "en-US": "New Entry" },
          description: { "en-US": "New Description" }
        }
      };

      const result = await entryHandlers.createEntry(entryData);

      expect(result).to.have.property("content");
      const entry = JSON.parse(result.content[0].text);
      expect(entry).to.have.nested.property("sys.id", "new-entry-id");
      expect(entry).to.have.nested.property("fields.title.en-US", "New Entry");
    });
  });

  describe("updateEntry", () => {
    it("should update an existing entry", async () => {
      const updateData = {
        spaceId: testSpaceId,
        entryId: testEntryId,
        fields: {
          title: { "en-US": "Updated Entry" },
          description: { "en-US": "Updated Description" }
        }
      };

      const result = await entryHandlers.updateEntry(updateData);

      expect(result).to.have.property("content");
      const entry = JSON.parse(result.content[0].text);
      expect(entry.sys.id).to.equal(testEntryId);
      expect(entry).to.have.nested.property("fields.title.en-US", "Updated Entry");
    });
  });

  describe("deleteEntry", () => {
    it("should delete an entry", async () => {
      const result = await entryHandlers.deleteEntry({
        spaceId: testSpaceId,
        entryId: testEntryId
      });

      expect(result).to.have.property("content");
      expect(result.content[0].text).to.include("deleted successfully");
    });

    it("should throw error when deleting non-existent entry", async () => {
      try {
        await entryHandlers.deleteEntry({
          spaceId: testSpaceId,
          entryId: "non-existent-id"
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("publishEntry", () => {
    it("should publish an entry", async () => {
      const result = await entryHandlers.publishEntry({
        spaceId: testSpaceId,
        entryId: testEntryId
      });

      expect(result).to.have.property("content");
      const entry = JSON.parse(result.content[0].text);
      expect(entry.sys.publishedVersion).to.exist;
    });
  });

  describe("unpublishEntry", () => {
    it("should unpublish an entry", async () => {
      const result = await entryHandlers.unpublishEntry({
        spaceId: testSpaceId,
        entryId: testEntryId
      });

      expect(result).to.have.property("content");
      const entry = JSON.parse(result.content[0].text);
      expect(entry.sys.publishedVersion).to.not.exist;
    });
  });
});
