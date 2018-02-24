module.exports = async (req, res, next) => {
  try {
    const { cache } = req.folders;
    await req.image.toFile(cache);
    
    return next()
  } catch (error) {
    return next(error);
  }
};
