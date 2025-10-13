import { PrimaryKey } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  id?: number

  /*
 
  @Property({ Type: DataTimeType })
  createdAt? = new Date();

  @Property({ Type: DateTimeType, onUpdate: () => new Date() })
  updatedAt? = new Date();
  
  */


}