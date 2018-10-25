// ==============================
// PUERTO
// ==============================

process.env.PORT = process.env.PORT || 3000;

// ==============================
// ENTORNO(ENV)
// ==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// VENCIMIENTO DEL TOKEN
// ==============================
//60segundos
//60minutos
//24horas
//30dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 300;

// ==============================
// SEED (semilla) DE AUTENTICACION
// ==============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==============================
// BASE DE DATOS
// ==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

// ==============================
// GOOGLE CLIENT ID
// ==============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '707418334963-05klpe5gaavrep66h2tf0ntb1739ig20.apps.googleusercontent.com';