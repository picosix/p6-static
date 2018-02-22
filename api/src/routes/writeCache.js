module.exports = async (req, res, next) => {
  try {
    const { cache } = res.locals.folders;
    await res.locals.image.toFile(cache);
  } catch (error) {
    return next(error);
  }
};
