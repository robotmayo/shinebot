import log from "./util/logger";
import { Ok, Err, Result } from "@robotmayo/result-option";
import * as pg from "pg";
import wrap from "./util/wrap";

export const db = new pg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING
});

export interface queryResult<T> {
  command: string;
  rowCount: number;
  oid: number;
  rows: T[];
}

export default async function run<T>(
  query: string,
  ...args: any[]
): Promise<Result<queryResult<T>, Error>> {
  const startTime = Date.now();
  try {
    const res = (await db.query(query, args)) as queryResult<T>;
    log.info({ query, runtime: Date.now() - startTime, success: true });
    return new Ok(res);
  } catch (err) {
    log.info({ query, runtime: Date.now() - startTime, success: false });
    return new Err(err);
  }
}
