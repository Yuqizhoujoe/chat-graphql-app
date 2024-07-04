import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.POSTGRE_DB,
  process.env.POSTGRE_USERNAME,
  process.env.POSTGRE_PASSWORD,
  {
    host: process.env.POSTGRE_HOST,
    dialect: process.env.POSTGRE_DIALECT,
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.sync();
    console.log("CONNECT_WITH_POSTGRES!");
  } catch (error) {
    console.error("CONNECT_WITH_POSTGRES_ERROR: ", error);
  }
};

connectPostgres();

export default sequelize;
