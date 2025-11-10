import { MikroORM } from "@mikro-orm/mysql"
import { defineConfig } from "@mikro-orm/mysql"
import { SqlHighlighter } from "@mikro-orm/sql-highlighter"

const ormConfig = defineConfig({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "bavbonkjawv7oeb4m7xd",
  user: "u0kpnmkrvzgwlznn",
  password: "o5nauyAVkQA55gRxrRIU",
  host: "bavbonkjawv7oeb4m7xd-mysql.services.clever-cloud.com",
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
