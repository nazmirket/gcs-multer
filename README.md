## gcs-multer

This module can be used to add file-upload funcionality to your app.

#### Creating an Instance of gcs-multer

For creating an instance of gcs-multer, you need to provide following three properties. These three properties must be given to enable gcs-multer to access google cloud storage

````
const gcs_multer = require("gcs-multer");

const gcsm = new gcs_multer({
  project_id: "wired-height-276615",
  key_file: "./wired-height-276615-c511781c0400.json",
  default_bucket: "oncoev_resources",
});
````

#### File uploading

For this operation, gcs-multer works as a middleware. After the uploading operation finished, the original file name and google-cloud-storage_id of the file will be attached to the request object. Later, this file can be reached by using this gcs_id.

Since these files are uploaded to the cloud with automatically generated unique ids, the original name of the file can be needed when reaching the file. For a clearer explanation, read the downloading part as well.

Also, the request should be a multipart request which includes a file with the field name 'file'

````
 app.post("/", gcsm.uploader.single("file"), (req, res, next) => {
  const name = req.filename;
  const id = req.gcs_id;

  console.log(name, id);
});

````

#### File Downloading

* [ ] The following is the download operation. gcs-multer generates a signed url for the file which can be used before the expiration date. In the following example, the url will redirect user to the download link and when the user downloads the file the file name will be prompted as the "original_file_name" to the user. User can use this url for the following 1 hour

````
app.get("/:id", (req, res, next) => {

  let expiresAt = Date.now() + 1000*60*60
  gcsm
    .getSignedURL(req.params.id, "original_file_name", expiresAt)
    .then((url) => {
      //the request is redirected to the download link
      res.redirect(url);
    })
    .catch((err) => {
      //handle error
    });
});
````

#### File Stream

#### Removing Files
