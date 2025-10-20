import { MikroORM } from "@mikro-orm/mysql"
import { defineConfig } from "@mikro-orm/mysql"
import { SqlHighlighter } from "@mikro-orm/sql-highlighter"

const ormConfig = defineConfig({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "tienda_virtual",
  user: "root",
  password: "root",
  host: "localhost",
  port: 3306,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: { 
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema:[],
  },
});

export const orm = await MikroORM.init(ormConfig);

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  /*
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema()
}
