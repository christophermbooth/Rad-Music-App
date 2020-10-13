// DON'T USE THIS MAYBE?
// IS THIS THE SAME AS SERVER/DB/INDEX.JS?
// DON'T USE THIS FILE DON'T EDIT IT 

const Sequelize = require('sequelize');
// const { now } = require('sequelize/types/lib/utils');
const { SEQUEL_PASS } = require('../config');

const db = process.env.ENVIRON === 'dev' ? new Sequelize('radma', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
}) : new Sequelize('radma', 'root', '', {
  host: 'localhost',
  password: SEQUEL_PASS,
  dialect: 'mysql',
  logging: false,
});

const Show = db.define('shows', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  venue: Sequelize.STRING,
  date: Sequelize.STRING,
  lat: Sequelize.STRING,
  lng: Sequelize.STRING,
  details: Sequelize.STRING,
});

const Genre = db.define('genres', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  genreName: Sequelize.STRING,
});

const Band = db.define('bands', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bandName: Sequelize.STRING,
  genreId: Sequelize.INTEGER,
});

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: Sequelize.STRING,
  pictures: Sequelize.STRING,
  profilePic: Sequelize.STRING,
  googleId: Sequelize.STRING,
  genreId: Sequelize.INTEGER,
  profilePrompt: Sequelize.BOOLEAN,
});

const ShowsBands = db.define('shows_bands', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bandId: Sequelize.INTEGER,
  showId: Sequelize.INTEGER,
});

// adds genreId to band
Band.belongsTo(Genre);

// add genreID to user
User.belongsTo(Genre);

// create shows bands join table
Band.belongsToMany(Show, { through: ShowsBands });
Show.belongsToMany(Band, { through: ShowsBands });

Show.sync();
Genre.sync();
User.sync();
Band.sync();
ShowsBands.sync();

db.authenticate()
  .then(() => {
    console.log('connected to database');
  })
  .catch((error) => {
    console.error(error, 'not connected to database');
  });

const authFunc = (profile) => User.findOne({
  where: {
    googleId: profile.id,
  },
});

module.exports = {
  db,
  Show,
  Genre,
  User,
  ShowsBands,
  Band,
  authFunc,
};
