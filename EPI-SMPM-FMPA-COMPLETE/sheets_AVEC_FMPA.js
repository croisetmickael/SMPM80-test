const { google } = require('googleapis');

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

let sheetsAPI = null;

function getAuth() {
  if (!SERVICE_ACCOUNT_KEY) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY manquante');
  }
  
  const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheetsAPI() {
  if (!sheetsAPI) {
    const auth = getAuth();
    sheetsAPI = google.sheets({ version: 'v4', auth });
  }
  return sheetsAPI;
}

async function readSheet(sheetName) {
  const sheets = getSheetsAPI();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:E`,
  });

  const rows = response.data.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0] || [];
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      const key = (header || '').toLowerCase().trim().replace(/\s+/g, '_');
      obj[key] = row[i] || '';
    });
    return obj;
  });

  return data;
}

async function readPersonnelSheet() {
  const sheets = getSheetsAPI();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `EPI PERSONNELS SMPM!A:T`,
  });

  const rows = response.data.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0] || [];
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      const key = (header || '').toLowerCase().trim().replace(/\s+/g, '_');
      obj[key] = row[i] || '';
    });
    return obj;
  });

  return data;
}

async function readFMPASheet() {
  const sheets = getSheetsAPI();
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `FMPA!A:E`,
    });

    const rows = response.data.values || [];
    if (rows.length < 2) return [];

    const headers = rows[0] || [];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        const key = (header || '').toLowerCase().trim().replace(/\s+/g, '_');
        obj[key] = row[i] || '';
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.log('Sheet FMPA not found or error:', error.message);
    return [];
  }
}

async function updatePersonnel(rowIndex, data) {
  const sheets = getSheetsAPI();
  
  const values = [[
    data.nom || '',
    data.prenom || '',
    data.baudrier_type || '',
    data.baudrier_num || '',
    data.baudrier_date || '',
    data.casque_type || '',
    data.casque_num || '',
    data.casque_date || '',
    data.longe_type || '',
    data.longe_num || '',
    data.longe_date || '',
    data.mousq_type || '',
    data.mousq_num1 || '',
    data.mousq_num2 || '',
    data.desc_type || '',
    data.desc_num || '',
    data.desc_date || '',
    data.poig_type || '',
    data.poig_num || '',
    data.poig_date || '',
  ]];

  const startRow = rowIndex + 2;
  const range = `EPI PERSONNELS SMPM!A${startRow}:T${startRow}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    resource: { values },
  });

  return { success: true };
}

async function updateFMPA(rowIndex, data) {
  const sheets = getSheetsAPI();
  
  const values = [[
    data.date || '',
    data.lieu || '',
    data.gps || '',
    data.observation || '',
  ]];

  const startRow = rowIndex + 2;
  const range = `FMPA!A${startRow}:D${startRow}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    resource: { values },
  });

  return { success: true };
}

async function addFMPA(data) {
  const sheets = getSheetsAPI();
  
  const values = [[
    data.date || '',
    data.lieu || '',
    data.gps || '',
    data.observation || '',
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `FMPA!A:D`,
    valueInputOption: 'RAW',
    resource: { values },
  });

  return { success: true };
}

async function deleteFMPA(rowIndex) {
  const sheets = getSheetsAPI();
  
  const startRow = rowIndex + 2;
  const endRow = rowIndex + 2;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // À ajuster selon le sheet ID réel
              dimension: 'ROWS',
              startIndex: startRow - 1,
              endIndex: endRow,
            },
          },
        },
      ],
    },
  });

  return { success: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const type = req.query.type || 'personnel';

      if (type === 'fmpa') {
        const fmpa = await readFMPASheet();
        return res.status(200).json({
          fmpa: fmpa || [],
        });
      } else {
        const personnel = await readPersonnelSheet();
        return res.status(200).json({
          personnel: personnel || [],
        });
      }
    }

    if (req.method === 'POST') {
      const { action, rowIndex, data } = req.body;

      if (action === 'updatePersonnel' && rowIndex !== undefined && data) {
        await updatePersonnel(rowIndex, data);
        return res.status(200).json({ success: true });
      }

      if (action === 'updateFMPA' && rowIndex !== undefined && data) {
        await updateFMPA(rowIndex, data);
        return res.status(200).json({ success: true });
      }

      if (action === 'addFMPA' && data) {
        await addFMPA(data);
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Action non reconnue' });
    }

    if (req.method === 'DELETE') {
      const { action, rowIndex } = req.body;

      if (action === 'deleteFMPA' && rowIndex !== undefined) {
        await deleteFMPA(rowIndex);
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Action non reconnue' });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur:', error.message);
    return res.status(500).json({
      error: error.message || 'Erreur serveur',
    });
  }
}
