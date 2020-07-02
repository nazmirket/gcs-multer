module.exports = class gcs_multer {
  constructor(opts) {
    this.setOpts(opts);
    this.handler = require("./GCS-Handler");
    this.uploader = require("./GCS-Uploader");
  }

  setOpts(opts) {
    let { project_id, key_file, default_bucket } = opts;
    if (project_id && key_file && default_bucket) {
      process.env.MULTERGCS_PROJECT_ID = project_id;
      process.env.MULTERGCS_KEY_FILE = key_file;
      process.env.MULTERGCS_DEFAULT_BUCKET = default_bucket;
    } else {
      console.error(
        "you need to give the specified options to instantiate gcs-multer"
      );
    }
  }

  getSignedURL(gcs_id, promptName, expiresAt) {
    return this.handler.generateSignedURL(gcs_id, promptName, expiresAt);
  }
  getFileStream(gcs_id) {
    return this.handler.getFileStream(gcs_id);
  }

  deleteFile(gcs_id) {
    return this.handler.deleteFile(gcs_id);
  }
};
