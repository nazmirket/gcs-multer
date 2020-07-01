const { Storage } = require("@google-cloud/storage");

const GCS_STORAGE = new Storage({
  projectId: process.env.MULTERGCS_PROJECT_ID,
  keyFilename: process.env.MULTERGCS_KEY_FILE,
});

const Bucket = GCS_STORAGE.bucket(process.env.MULTERGCS_DEFAULT_BUCKET);

function deleteFile(gcs_id) {
  return Bucket.file(gcs_id).delete();
}

function generateSignedURL(gcs_id, saveAs) {
  return Bucket.file(gcs_id).getSignedUrl({
    action: "read",
    expires: Date.now() + 2 * 24 * 1000 * 60 * 60,
    promptSaveAs: saveAs,
  });
}

function getFileStream(gcs_id) {}

module.exports = {
  deleteFile,
  generateSignedURL,
};
