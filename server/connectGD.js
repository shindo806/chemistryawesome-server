const fs = require('fs');
const readline = require('readline');
const {
  google
} = require('googleapis');
const async = require('async');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize() {
  const client_secret = process.env.CLIENT_SECRET || 'gzXzvbiIAFSf1iSBV97_-HW2';
  const client_id =
    process.env.CLIENT_ID ||
    '595784808090-k9djc0ii31ujd9o54igmrs48n936mn65.apps.googleusercontent.com';
  const redirect_uris = process.env.REDIRECT_URIS || 'http://localhost:3000';

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
  );

  // Check if we have previously stored a token.
  const token = JSON.stringify({
    access_token: 'ya29.a0AfH6SMDuPKMABRuGJb6CnOUNX1NSqZWslSk6HK4uBOpnpwg2jrW8sfYnfNeraEWEjWM7oJRDyyVXSC21z6bW2dK1eMciMmLNvwuf7U3H8rztLyXDadVhXLCh4xdTEqY_O-qT9tlGypwQh2XpQrW3WYdXk8NrqSjKrsc',
    refresh_token: '1//0gGBb3HcAi0pFCgYIARAAGBASNwF-L9IrehsXmovy2rN1w9KomYHw_TxAWp0m0TzBYxDDyt8gWBraSGb2HT5l4v-Zj6vuWbRm0fE',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    token_type: 'Bearer',
    expiry_date: 1597401550756,
  });
  if (!token) return getAccessToken(oAuth2Client);

  oAuth2Client.setCredentials(JSON.parse(token));

  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listFiles(auth) {
  const drive = google.drive({
    version: 'v3',
    auth,
  });
  return drive.files
    .list({
      q: "mimeType ='application/pdf'",
      fields: 'nextPageToken, files(id, name, webContentLink, webViewLink)',
    })
    .then((data) => data.data.files);
}

const getAllFile = async function () {
  try {
    const auth = authorize();
    const data = await listFiles(auth);

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

function getFileByName(auth, fileName) {
  const data = [];
  const drive = google.drive({
    version: 'v3',
    auth,
  });
  var pageToken = null;
  // Using the NPM module 'async'
  async.doWhilst(
    function () {
      drive.files.list({
          q: "mimeType != 'application/vnd.google-apps.folder'",
          fields: 'nextPageToken, files(id, name, webContentLink, webViewLink)',
          spaces: 'drive',
          pageToken: pageToken,
        },
        function (err, res) {
          if (err) {
            // Handle error
            console.error(err);
          } else {
            if (fileName === undefined || fileName === null)
              return (data = res.data.files);
            let nonVietnameseKeyword = nonAccentVietnamese(fileName);
            let matchedItems = res.data.files.filter((file) =>
              nonAccentVietnamese(file.name.toLowerCase()).includes(
                nonVietnameseKeyword
              )
            );
            // data = matchedItems;
            console.log(matchedItems);
            pageToken = res.nextPageToken;
          }
        }
      );
    },
    function () {
      return !!pageToken;
    },
    function (err) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        // All pages fetched
      }
    }
  );
}

module.exports.authorize = authorize;
module.exports.getAllFile = getAllFile;