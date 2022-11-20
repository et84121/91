import { openDB, DBSchema } from "idb";

interface MyDB extends DBSchema {
  users: {
    value: {
      account: string;
      hasedPassword: string;
    };
    key: string;
    indexes: { "by-price": number };
  };
}

const setupDB = async () => {
  const db = await openDB<MyDB>("main", 1, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      db.createObjectStore("users", {
        keyPath: "account"
      });
    }
  });

  return db;
};

export { setupDB };
