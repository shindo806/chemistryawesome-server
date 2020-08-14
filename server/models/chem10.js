const {
  google
} = require('googleapis');
const async = require('async');
const connection = require('../connectGD');

const getChapterFilesChem10 = async () => {
  const auth = connection.authorize();
  const drive = google.drive({
    version: 'v3',
    auth,
  });
  drive.files.list({});
  // Get ID cua thu muc Chem10
  const folderID = await drive.files
    .list({
      q: "mimeType = 'application/vnd.google-apps.folder'",
      q: "name ='Chem10'",
      // fields: 'nextPageToken, files(id, name, webContentLink, webViewLink)',
    })
    .then((data) => data.data.files[0].id);
  // Get ID cua thu muc HK1, HK2
  const semasterFolderID = await drive.files
    .list({
      q: "mimeType = 'application/vnd.google-apps.folder'",
      q: `parents in '${folderID}'`,
      q: "name = 'Chapter'",
    })
    .then((data) => data.data.files[0].id);

  console.log(semasterFolderID);
};

module.exports.getAllChem10Files = getAllChem10Files;