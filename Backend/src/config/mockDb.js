const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../uploads/mock_db.json');

// Ensure directory and file exists
const initDb = () => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({
        users: [],
        deliveryPartners: [],
        technicians: [],
        executives: [],
        wallets: [],
        orders: [],
        bookings: [],
        trips: []
      }, null, 2)
    );
  }
};

const readDb = () => {
  initDb();
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      users: [],
      deliveryPartners: [],
      technicians: [],
      executives: [],
      wallets: [],
      orders: [],
      bookings: [],
      trips: []
    };
  }
};

const writeDb = (data) => {
  initDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const mockDb = {
  // Collection general helpers
  find: (collection, filterFn) => {
    const db = readDb();
    const list = db[collection] || [];
    return filterFn ? list.filter(filterFn) : list;
  },

  findOne: (collection, filterFn) => {
    const db = readDb();
    const list = db[collection] || [];
    return list.find(filterFn);
  },

  findById: (collection, id) => {
    const db = readDb();
    const list = db[collection] || [];
    return list.find(item => item._id === String(id));
  },

  create: (collection, data) => {
    const db = readDb();
    if (!db[collection]) db[collection] = [];
    const newRecord = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    db[collection].push(newRecord);
    writeDb(db);
    return newRecord;
  },

  updateById: (collection, id, updates) => {
    const db = readDb();
    const list = db[collection] || [];
    const idx = list.findIndex(item => item._id === String(id));
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
      return list[idx];
    }
    return null;
  },

  save: (collection, record) => {
    if (!record._id) {
      return mockDb.create(collection, record);
    }
    return mockDb.updateById(collection, record._id, record);
  }
};

module.exports = mockDb;
