import type { Types } from "mongoose";

type ObjectIdLike = Types.ObjectId | string;

type BaseDocumentShape = {
  _id: ObjectIdLike;
  __v?: unknown;
};

type DocumentWithObject<T extends BaseDocumentShape> = {
  toObject(): T;
};

export function sanitizeDocument<T extends BaseDocumentShape>(
  document: DocumentWithObject<T>,
): Omit<T, "_id" | "__v"> & { id: string } {
  const object = document.toObject();
  const { _id, __v: _version, ...rest } = object;

  return {
    id: String(_id),
    ...rest,
  };
}

type UserDocumentShape = BaseDocumentShape & {
  password?: unknown;
};

export function sanitizeUser<T extends UserDocumentShape>(
  document: DocumentWithObject<T>,
): Omit<T, "_id" | "__v" | "password"> & { id: string } {
  const sanitizedDocument = sanitizeDocument(document);
  const { password: _password, ...safeUser } = sanitizedDocument as typeof sanitizedDocument & {
    password?: unknown;
  };

  return safeUser as Omit<T, "_id" | "__v" | "password"> & { id: string };
}
