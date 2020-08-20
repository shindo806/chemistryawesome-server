// url be like : /chem10/1 -> query: 1/2

const {
  google
} = require('googleapis');

const connection = require('../connectGD');

const auth = connection.authorize();
const drive = google.drive({
  version: 'v3',
  auth,
});

// Fetch data theo HK1 || HK2
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
      q: `name = '${chemgrade}'`,
    })
    .then((data) => {
      if (data.data.files.length !== 0) {
        return data.data.files[0].id;
      } else {
        return {
          message: 'File not found',
        };
      }
    });
  if (chemgradeId.message)
    return {
      message: 'File not found',
    };
  // 2. looking for semesterID -> HK1 HK2 id
  let semesterId = await drive.files
    .list({
      q: `parents in '${chemgradeId}'`,
    })
    .then((data) => {
      if (data.data.files.length !== 0) {
        let matchedSemester = data.data.files.filter(
          (file) => file.name === `HK${semester}`
        );
        return matchedSemester[0].id;
      } else {
        return {
          message: 'File not found',
        };
      }
    });
  if (semesterId.message)
    return {
      message: 'File not found',
    };

  let allFilesInSemester = await drive.files
    .list({
      q: `parents in "${semesterId}"`,
      fields: 'files(id, name, webContentLink, webViewLink)',
    })
    .then((data) => data.data.files);
  allFilesInSemester = allFilesInSemester.reverse();

  return {
    allFilesInSemester,
  };
};

async function getAllSemesterFiles(queryString) {
  const {
    chemgrade
  } = queryString;

  // 1. Looking for chemgrade folder
  let chemgradeId = await drive.files
    .list({
      q: "mimeType = 'application/vnd.google-apps.folder'",
      q: `name = '${chemgrade}'`,
    })
    .then((data) => {
      if (data.data.files.length !== 0) {
        return data.data.files[0].id;
      } else {
        return {
          message: 'File not found',
        };
      }
    });
  if (chemgradeId.message)
    return {
      message: 'File not found',
    };
  // 2. looking for semesterID -> HK1 HK2 id
  let semesterId = await drive.files
    .list({
      q: `parents in '${chemgradeId}'`,
    })
    .then((data) => {
      if (data.data.files.length !== 0) {
        return data.data.files;
      } else {
        return {
          message: 'File not found',
        };
      }
    });
  if (semesterId.message)
    return {
      message: 'File not found',
    };

  semesterId = semesterId.filter(item => item.name !== 'Chapter').map(item => {
    return {
      id: item.id,
      name: item.name
    }
  });

  let allFilesInSemester = await Promise.all(semesterId.map(semester => {
    return new Promise((resolve) => {
      resolve(drive.files.list({
        q: `parents in '${semester.id}'`
      }))
    })
  }))
  allFilesInSemester = allFilesInSemester.map(data => data.data.files);

  return {
    allFilesInSemester,
  };
}

async function getFilesById({
  chemgrade,
  id
}) {
  const folderID = await drive.files.list({
    q: `name = '${chemgrade}'`
  }).then(data => {
    if (data.data.files.length !== 0) {
      return data.data.files[0].id
    } else {
      return {
        message: 'Files not found !'
      }
    }
  })
  console.log(folderID)
  // if (folderID.message !== '') return {
  //   message: 'Files not found !'
  // }

  let semesterId = await drive.files.list({
    q: `parents in '${folderID}'`
  }).then(data => {
    if (data.data.files.length !== 0) {
      return data.data.files.filter(item => item.name === `HK${id}`)
    }
  })

  let data = await drive.files.list({
    q: `parents in '${semesterId[0].id}'`,
    fields: 'files(id, name, webContentLink, webViewLink)'
  }).then(data => data.data.files);

  return data;
}

module.exports.getSemesterFiles = getSemesterFiles;
module.exports.getAllSemesterFiles = getAllSemesterFiles;
module.exports.getFilesById = getFilesById;