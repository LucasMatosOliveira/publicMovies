// import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
// import * as FileSystem from 'expo-file-system';

// enablePromise(true);

// const DATABASE_NAME = 'publicMovies.db';

// export const getDBConnection = async () => {
//     return openDatabase({ name: 'publicMovies.db', location: 'default' });
// };

// export const createTables = async (db: SQLiteDatabase) => {
//     const favoritesTable = `
//         CREATE TABLE IF NOT EXISTS favorites (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             identifier TEXT NOT NULL,
//             title TEXT NOT NULL,
//             description TEXT,
//             creator TEXT,
//             mediatype TEXT,
//             collection TEXT,
//             subject TEXT,
//             date TEXT,
//             downloads INTEGER,
//             publicdate TEXT,
//             imagecount INTEGER
//         )
//     `;
//     const watchlistTable = `
//         CREATE TABLE IF NOT EXISTS watchlist (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             identifier TEXT NOT NULL,
//             title TEXT NOT NULL,
//             description TEXT,
//             creator TEXT,
//             mediatype TEXT,
//             collection TEXT,
//             subject TEXT,
//             date TEXT,
//             downloads INTEGER,
//             publicdate TEXT,
//             imagecount INTEGER
//         )
//     `;

//     try {
//         await db.executeSql(favoritesTable);
//         await db.executeSql(watchlistTable);
//     } catch (error) {
//         console.error('Erro ao criar tabelas:', error);
//         throw error;
//     }
// };

// export const initDatabase = async () => {
//     try {
//         const db = await getDBConnection();
//         await createTables(db);
//         return db;
//     } catch (error) {
//         console.error('Erro ao inicializar banco de dados:', error);
//         throw error;
//     }
// };