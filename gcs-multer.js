module.exports = function (opts) {
  try {
    let { project_id, key_file, default_bucket } = opts;
    if (project_id && key_file && default_bucket) {
      process.env.MULTERGCS_PROJECT_ID = project_id;
      process.env.MULTERGCS_KEY_FILE = key_file;
      process.env.MULTERGCS_DEFAULT_BUCKET = default_bucket;

      const handler = require("./GCS-Handler");
      const uploader = require("./GCS-Uploader");

      return (multer = {
        handler,
        uploader,
      });
    }
    console.log(
      "The options should include project_id, key_file and default_bucket"
    );
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
