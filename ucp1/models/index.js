'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const configPath = path.join(__dirname, '..', 'config', 'config.json');
if (!fs.existsSync(configPath)) {
  throw new Error(`DB config file not found: ${configPath}`);
}

const allConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = allConfig && allConfig[env];

if (!config) {
  throw new Error(`DB config for env "${env}" not found in ${configPath}`);
}
if (!config.dialect && !config.storage) {
  throw new Error('DB config missing "dialect" (or "storage" for sqlite). Add "dialect": "mysql|sqlite|postgres|mssql" to config.');
}
if (!config.storage && (!config.database || !config.host)) {
  throw new Error('DB config incomplete: ensure "database" and "host" are set in config/config.json (or use sqlite storage).');
}


console.log('DEBUG DB config:', { host: config.host, database: config.database, dialect: config.dialect });

const db = {};

let sequelize;
if (typeof config.use_env_variable === 'string' &&
    config.use_env_variable.trim() !== '' &&
    config.use_env_variable.trim().toLowerCase() !== 'false') {
  const url = process.env[config.use_env_variable];
  if (!url) throw new Error(`Environment variable ${config.use_env_variable} is not set`);
  sequelize = new Sequelize(url, { ...config, logging: false });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, { ...config, logging: false });
}

// ...existing code...

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const modelImport = require(path.join(__dirname, file));
    const model = (typeof modelImport === 'function') ? modelImport(sequelize, Sequelize.DataTypes) : modelImport;
    if (model && model.name) db[model.name] = model;
  });

Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;