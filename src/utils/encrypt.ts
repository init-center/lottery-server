import * as crypto from "crypto";
import { salt } from "../config/config";

export function encrypt(password: string) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 16, "sha1")
    .toString("base64");
}
