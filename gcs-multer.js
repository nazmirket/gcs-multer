class gcs_multer {
  constructor(handler, uploader) {
    this._handler = handler;
    this.uploader = uploader;
  }

  getSignedURL(gcs_id, promptName) {
    return handler.generateSignedURL(gcs_id, promptName);
  }

  getFileStream() {}

  deleteFile() {}
}

module.exports = function (opts) {
  try {
    let { project_id, key_file, default_bucket } = opts;
    if (project_id && key_file && default_bucket) {
      process.env.MULTERGCS_PROJECT_ID = project_id;
      process.env.MULTERGCS_KEY_FILE = key_file;
      process.env.MULTERGCS_DEFAULT_BUCKET = default_bucket;

      const handler = require("./GCS-Handler");
      const uploader = require("./GCS-Uploader");

      return new gcs_multer(handler, uploader);
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
