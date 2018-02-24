module.exports = (req, res, next) => {
  const {
    page = 0,
    limit: _limit = 10,
    sort: _sort = "-createdAt"
  } = req.query;

  let limit = Number(_limit);
  let skip = (Number(page) - 1 < 1 ? 0 : Number(page) - 1) * limit;
  let sort = _sort.split(",").reduce((sorter = {}, field) => {
    if (field[0] === "-") {
      sorter[field.slice(1)] = -1;
    } else {
      sorter[field] = 1;
    }

    return sorter;
  }, {});

  // Check NaN
  if (limit !== limit || skip !== skip) return next(new Error("Bad query"));

  req.limit = limit;
  req.skip = skip;
  req.sort = sort;
  return next();
};
