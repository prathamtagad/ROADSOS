import * as SQLite from "expo-sqlite";

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
