import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("roadsos.db");

export function getDb() {
  return db;
}

export function initializeOfflineDb() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY NOT NULL, name TEXT, phone TEXT, category TEXT, country TEXT, lat REAL, lng REAL, address TEXT, rating REAL, brand TEXT, lastVerified TEXT, isVerified INTEGER, userCorrectionFlag INTEGER, cachedAt TEXT);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS geofences (id TEXT PRIMARY KEY NOT NULL, fromCountry TEXT, toCountry TEXT, geojson TEXT, cachedAt TEXT);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY NOT NULL, value TEXT);"
        );
      },
      (error) => reject(error),
      () => resolve()
    );
  });
}

export function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function setMeta(key, value) {
  await runSql("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?);", [key, value]);
}

export async function getMeta(key) {
  const result = await runSql("SELECT value FROM meta WHERE key = ?;", [key]);
  return result.rows._array?.[0]?.value || null;
}

export async function getAllMeta() {
  const result = await runSql("SELECT key, value FROM meta;");
  return result.rows._array || [];
}
