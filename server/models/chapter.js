const {
  google,
  drive_v3
} = require('googleapis');
const async = require('async');
const connection = require('../connectGD');

const auth = connection.authorize();
const drive = google.drive({
  version: 'v3',
  auth,
});

// const getChapterFiles = async (grade) => {
//   // Get ID cua thu muc : Chem10, Chem11, Chem12
//   const folderID = await drive.files
//     .list({
//       q: "mimeType = 'application/vnd.google-apps.folder'",
//       q: `name = '${grade}'`,
//       fields: ' files(id)',
//     })
//     .then((data) => data.data.files[0].id);
//   // Get Chapter ID folder
//   const chapterID = await drive.files
//     .list({
//       q: "mimeType = 'application/vnd.google-apps.folder'",
//       q: `parents in '${folderID}'`,
//       q: "name = 'Chapter'",
//     })
//     .then((data) => data.data.files[0].id);
//   // Get all files ID in chapter
//   const allFilesIdInChapter = await drive.files
//     .list({
//       q: "mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
//       q: `parents in '${chapterID}'`,
//     })
//     .then((data) => data.data.files);
//   // Get docx extension file ID | type = Array[]
//   const wordIdFiles = allFilesIdInChapter
//     .filter(
//       (file) =>
//       file.mimeType ===
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     )
//     .map((file) => file.id);
//   // Get docx extension file ID | type = Array[]
//   const pdfIdFiles = allFilesIdInChapter
//     .filter((file) => file.mimeType === 'application/pdf')
//     .map((file) => file.id);

//   // Get all infomation of all files in word file type
//   const allWordFiles = [];
//   for (let id of wordIdFiles) {
//     let result = await drive.files
//       .get({
//         fileId: `${id}`,
//         fields: 'id, name, webViewLink, webContentLink',
//       })
//       .then((data) => data.data);
//     allWordFiles.push(result);
//   }

//   // Get all infomation of all files in pdf file type
//   const allPDFFiles = [];
//   for (let id of pdfIdFiles) {
//     let result = await drive.files
//       .get({
//         fileId: `${id}`,
//         fields: 'id, name, webViewLink, webContentLink',
//       })
//       .then((data) => data.data);
//     allPDFFiles.push(result);
//   }

//   return {
//     wordFilesArray: allWordFiles,
//     pdfFilesArray: allPDFFiles,
//   };
// };

const getChapterFiles = async (semester) => {
  let semesterId = await drive.files
    .list({
      q: "mimeType = 'application/vnd.google-apps.folder'",
      q: `name = '${semester}'`
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
  if (semesterId.message) return {
    message: 'File not found'
  }

  let chapterId = await drive.files.list({
    q: `parents in '${semesterId}'`
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

module.exports.getChapterFiles = getChapterFiles;