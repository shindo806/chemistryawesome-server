const {
  google,

} = require('googleapis');

const connection = require('../connectGD');

const auth = connection.authorize();
const drive = google.drive({
  version: 'v3',
  auth,
});


const getChemGradeFiles = async (chemgrade) => {
  let chemgradeId = await drive.files
    .list({
      q: "mimeType = 'application/vnd.google-apps.folder'",
      q: `name = '${chemgrade}'`
    })
    .then(data => {
      if (data.data.files.length !== 0) {
        return (data.data.files[0].id)
      } else {
        return {
          message: 'File not found'
        }
      }
    });
  if (chemgradeId.message) return {
    message: 'File not found'
  }

  let chapterId = await drive.files.list({
    q: `parents in '${chemgradeId}'`
  }).then(data => {
    if (data.data.files.length !== 0) {
      return (data.data.files[0].id)
    } else {
      return {
        message: 'File not found'
      }
    }
  })
  if (chapterId.message) return {
    message: 'File not found'
  }

  let allFilesInChapter = await drive.files.list({
    q: `parents in "${chapterId}"`,
    fields: 'files(id, name, webContentLink, webViewLink)'
  }).then(data => (data.data.files))
  allFilesInChapter = allFilesInChapter.reverse();
  return {
    allFilesInChapter
  };
};

module.exports = getChemGradeFiles;