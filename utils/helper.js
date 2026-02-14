const paginate = async (
  Model,
  searchParams,
  filter = {},
  populate = null,
  useCursor = false,
  route = false,
  sortOption = { _id: -1 }
) => {
  let limit, page, cursor;

  if (route) {
    limit = Number(searchParams?.get("limit")) || 10;
    page = Number(searchParams?.get("page")) || 1;
    cursor = searchParams?.get("cursor");
  } else {
    limit = Number(searchParams?.limit) || 10;
    page = Number(searchParams?.page) || 1;
    cursor = searchParams?.cursor;
  }

  if (useCursor) {
    const query = cursor ? { ...filter, _id: { $lt: cursor } } : { ...filter };

    const data = await Model.find(query)
      .sort(sortOption)
      .limit(limit + 1)
      .populate(populate)
      .lean();

    const hasNextPage = data.length > limit;
    if (hasNextPage) data.pop();

    const nextCursor = hasNextPage ? data[data.length - 1]._id.toString() : null;

    return { data, nextCursor, limit };
  } else {
    const skip = (page - 1) * limit;
    const totalCount = await Model.countDocuments(filter);

    const data = await Model.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate(populate)
      .lean();

    const pageCount = Math.ceil(totalCount / limit);
    return { data, totalCount, pageCount, page, limit };
  }
};

module.exports = { paginate };
