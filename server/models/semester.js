// url be like : /chem10/1 -> query: 1/2

const {
  google,

} = require('googleapis');

const connection = require('../connectGD');

const auth = connection.authorize();
const drive = google.drive({
  version: 'v3',
  auth,
});

const getSemesterFiles = async (queryString) => {
  const {
    chemgrade
  } = queryString;
  const {
    semester
  } = queryString;
  // 1. Looking for chemgrade folder
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
  // 2. looking for semesterID -> HK1 HK2 id
  let semesterId = await drive.files.list({
    q: `parents in '${chemgradeId}'`
  }).then(data => {
    if (data.data.files.length !== 0) {
      let matchedSemester = data.data.files.filter(file => file.name === `HK${semester}`);
      return matchedSemester[0].id
    } else {
      return {
        message: 'File not found'
      }
    }
  })
  if (semesterId.message) return {
    message: 'File not found'
  }

  let allFilesInSemester = await drive.files.list({
    q: `parents in "${semesterId}"`,
    fields: 'files(id, name, webContentLink, webViewLink)'
  }).then(data => (data.data.files))
  allFilesInSemester = allFilesInSemester.reverse();

  return {
    allFilesInSemester
  };
};

module.exports = getSemesterFiles;