const { Storage } = require("@google-cloud/storage");

const multer = require("multer");
const shortid = require("shortid");

const GCS_STORAGE = new Storage({
  projectId: process.env.MULTERGCS_PROJECT_ID,
  keyFilename: process.env.MULTERGCS_KEY_FILE,
});

let listener = null;

const setListener = (ls) => {
  listener = ls;
};

const onData = (chunk) => {
  if (listener.onAction === null) {
    return;
  }
  listener.onAction(chunk);
};

const Bucket = GCS_STORAGE.bucket(process.env.MULTERGCS_DEFAULT_BUCKET);

async function _uploadFile(req, file, callback) {
  const gcs_file_id = shortid.generate();
  const createdFile = Bucket.file(gcs_file_id);

  let writeStream = createdFile.createWriteStream({
    resumable: false,
    gzip: true,
  });

  (() => {
    let start = Date.now();
    let total = parseInt(req.headers["content-length"]);

    listener.setStart(start);
    listener.setTotal(total);
  })();

  file.stream.on("data", (chunk) => {
    onData(chunk);
  });

  file.stream.pipe(writeStream);

  writeStream.on("finish", () => {
    req.filename = file.originalname;
    req.gcs_id = gcs_file_id;

    listener.onAction(null, true);
    callback(null);
  });

  writeStream.on("error", (err) => {
    createdFile.delete();
    req.filename = file.originalname;
    req.gcs_id = gcs_file_id;
    callback(err);
  });
}

async function _removeFile(req, file, callback) {}

function StorageEngine() {}

StorageEngine.prototype._handleFile = _uploadFile;

StorageEngine.prototype._removeFile = _removeFile;

module.exports = multer({
  storage: new StorageEngine(),
  limits: { fileSize: process.env.MULTERGCS_MAX_SIZE },
});

module.exports.setListener = setListener;
