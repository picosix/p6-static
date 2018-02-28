const util = require("util");
const nd = require("nodejs-disks");
const mongoose = require("mongoose");

const db = require("../db");

const findDrives = util.promisify(nd.drives);
const findDriveDetail = util.promisify(nd.drivesDetail);

module.exports = async (req, res, next) => {
  try {
    let storage = {
      total: 0,
      used: 0,
      available: 0,
      usedPercent: 0,
      availablePercent: 0
    };
    const mainDisk = (await findDriveDetail(await findDrives())).filter(
      drive => drive && drive.drive === "/dev/sda1"
    );
    if (mainDisk.length) {
      const {
        total,
        used,
        available,
        usedPer: usedPercent,
        freePer: availablePercent
      } = mainDisk[0];
      storage = { total, used, available, usedPercent, availablePercent };
    }

    const images = await db.model("Image").count();
    const cache = await db.model("Cache").count();

    return res.json({ data: { images, cache, storage } });
  } catch (error) {
    return next(error);
  }
};
