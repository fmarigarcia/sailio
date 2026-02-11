require('dotenv').config();

module.exports = {
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        'postgresql://postgres:dev_password@localhost:5432/sailio?schema=public',
    },
  },
};
