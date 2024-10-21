export const getVariants = (items, desc) => {
  return items.filter((item) => item.description === desc);
};

export const extractIds = (items) => {
  const ids = [];
  const counts = [];
  items.forEach((item) => {
    ids.push(item.id);
    counts.push(item.quantity);
  });
  return [ids, counts];
};

export const productTotal = (products, desc) => {
  const prod = getVariants(products, desc);
  let total = 0;
  prod.forEach((element) => {
    total += element.quantity;
  });
  return total;
};

export const unique = (items) => {
  return items.filter(
    (elem, index) =>
      items.findIndex((obj) => obj.description === elem.description) === index
  );
};
