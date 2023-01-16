references = [
  { article_id: 9, number_of_comments: "2" },
  { article_id: 3, number_of_comments: "2" },
  { article_id: 5, number_of_comments: "2" },
  { article_id: 6, number_of_comments: "1" },
  { article_id: 1, number_of_comments: "11" },
];
const createReferenceTable = (references) => {
  if (references.length === 0) return {};
  const referenceTable = {};

  references.forEach((reference) => {
    referenceTable[reference.article_id] = reference.number_of_comments;
  });

  console.log(referenceTable);
  return referenceTable;
};

module.exports = { createReferenceTable };

/* const createReferenceTable = (r) => {
    if (shops.length === 0) return {};
    const shopsRef = {};
  
    shops.forEach((shop) => {
      shopsRef[shop.shop_name] = shop.shop_id;
    });
  
    return shopsRef;
  };
  */
