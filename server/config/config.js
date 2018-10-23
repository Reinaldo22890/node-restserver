// ==============================
// PUERTO
// ==============================

process.env.PORT = process.env.PORT || 3000;

// ==============================
// ENTORNO(ENV)
// ==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// BASE DE DATOS
// ==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = 'mongodb://cafe-user:a123456@ds139243.mlab.com:39243/cafe';

}

process.env.URLDB = urlDB;