module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.TYPEORM_LOCAL_CLI_DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  entities: ['**/**.entity.js'],
  migrations: ['**/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/**/**.entity.js',
  },
  synchronize: true,
  migrationsRun: false,
};
