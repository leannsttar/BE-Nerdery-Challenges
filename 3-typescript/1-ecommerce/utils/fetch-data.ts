import path from "path";
import { readJsonFile } from "./read-json.util";

export async function fetchData<T>(fileName: string): Promise<T[]> {
  const data = await readJsonFile(path.join(__dirname, "..", "data", fileName));
  return data as T[];
}