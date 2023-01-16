const { createReferenceTable } = require("../utilities");

describe("createReferenceTable", () => {
  it("returns an object when passed an array", () => {
    expect(createReferenceTable([])).toEqual({});
  });
  it("creates a key of article_id", () => {
    const references = [{ article_id: "9", number_of_comments: "2" }];

    expect(createReferenceTable(references)).toHaveProperty("9");
  });
  it("creates a value of number_of_comments ", () => {
    const references = [{ article_id: "9", number_of_comments: "2" }];
    const result = { 9: "2" };

    expect(createReferenceTable(references)).toHaveProperty("9", "2");
    expect(createReferenceTable(references)).toEqual(result);
  });
  it("adds multiple references to the array", () => {
    const references = [
      { article_id: 9, number_of_comments: "2" },
      { article_id: 3, number_of_comments: "2" },
      { article_id: 5, number_of_comments: "2" },
      { article_id: 6, number_of_comments: "1" },
      { article_id: 1, number_of_comments: "11" },
    ];
    const result = { 1: "11", 3: "2", 5: "2", 6: "1", 9: "2" };
    expect(createReferenceTable(references)).toEqual(result);
  });
  it("does not mutate the original array", () => {
    const references = [
      { article_id: 9, number_of_comments: "2" },
      { article_id: 3, number_of_comments: "2" },
      { article_id: 5, number_of_comments: "2" },
      { article_id: 6, number_of_comments: "1" },
      { article_id: 1, number_of_comments: "11" },
    ];
    const referencesCopy = [
      { article_id: 9, number_of_comments: "2" },
      { article_id: 3, number_of_comments: "2" },
      { article_id: 5, number_of_comments: "2" },
      { article_id: 6, number_of_comments: "1" },
      { article_id: 1, number_of_comments: "11" },
    ];
    createReferenceTable(references);
    expect(references).toEqual(referencesCopy);
  });
});
