export default () => ({
  database: {
    type: 'postgres',
    host: process.env.PG_DATABASE_HOST,
    port: parseInt(process.env.PG_DATABASE_PORT, 10) || 5432,
    username: process.env.PG_DATABASE_USER,
    password: process.env.PG_DATABASE_PASSWORD,
    database: process.env.PG_DATABASE_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
});
