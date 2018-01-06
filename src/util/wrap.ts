import { Result, Ok, Err } from "@robotmayo/result-option";

export default function wrapPromise<T>(p: Promise<T>): Promise<Result<T, any>> {
  return p.then(x => new Ok(x)).catch(err => new Err(err));
}
