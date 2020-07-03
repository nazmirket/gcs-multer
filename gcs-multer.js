const listener = require("./listener");

module.exports = class gcs_multer {
  constructor(opts) {
    this.setOpts(opts);
    this.handler = require("./GCS-Handler");
    this.uploader = require("./GCS-Uploader");
  }

  setOpts(opts) {
    let { project_id, key_file, default_bucket, max_size, is_public } = opts;
    if (project_id && key_file && default_bucket) {
      process.env.MULTERGCS_PROJECT_ID = project_id;
      process.env.MULTERGCS_KEY_FILE = key_file;
      process.env.MULTERGCS_DEFAULT_BUCKET = default_bucket;
      process.env.MULTERGCS_MAX_SIZE = max_size ? max_size : 9999999;
      process.env.MULTERGCS_IS_PUBLIC_DEFAULT = is_public ? is_public : false;
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

  singleFile(action) {
    this.uploader.setListener(new listener(action));
    return this.uploader.single("file");
  }
};
