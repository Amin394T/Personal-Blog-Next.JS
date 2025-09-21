import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: (await import('sqlite3')),
  storage: './database/database.sqlite',
  //logging: false
});

await sequelize.sync();

export default sequelize;