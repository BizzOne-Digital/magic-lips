import mongoose, { Model, Schema } from "mongoose";

/** Register or reuse a typed Mongoose model (fixes TS errors with mongoose.models.X). */
export function getModel<T>(name: string, schema: Schema<T>): Model<T> {
  const existing = mongoose.models[name] as Model<T> | undefined;
  return existing ?? mongoose.model<T>(name, schema);
}
