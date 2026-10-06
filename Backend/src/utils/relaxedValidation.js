const isEmptyValue = (value) => value === '' || value === null;

/**
 * Recursively removes empty strings and nulls from a request payload.
 *
 * This must run BEFORE the payload reaches `new Model(...)`. Mongoose casts
 * values while building the document, so an empty string for a typed field
 * throws immediately, e.g.
 *   courseId: ""     -> "Cast to ObjectId failed for value \"\""
 *   dateOfBirth: ""  -> "Cast to Date failed for value \"\""
 * and a `pre('validate')` hook never gets a chance to run.
 *
 * Dates, Buffers and ObjectIds are preserved as-is.
 */
export const stripEmptyValues = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripEmptyValues(item))
      .filter((item) => item !== undefined);
  }

  if (
    value &&
    typeof value === 'object' &&
    !(value instanceof Date) &&
    !Buffer.isBuffer(value) &&
    !value._bsontype
  ) {
    const result = {};

    for (const [key, item] of Object.entries(value)) {
      const cleaned = stripEmptyValues(item);

      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }

    return result;
  }

  return isEmptyValue(value) ? undefined : value;
};

/**
 * Relaxes Mongoose validation so blank form fields never block a save.
 *
 * Pair this with stripEmptyValues() in the controller: this hook covers values
 * assigned directly on a document, while the sanitizer covers the payload that
 * Mongoose casts at construction time.
 */
export const applyRelaxedValidation = (schema) => {
  schema.pre('validate', function () {
    const doc = this;

    const clear = (path) => {
      let value;

      try {
        value = doc.get(path);
      } catch {
        return;
      }

      // Array of subdocuments (e.g. documents, faqs, requiredDocuments)
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && typeof item === 'object' && !(item instanceof Date) && !item._bsontype) {
            Object.keys(item).forEach((key) => {
              if (key !== '_id' && isEmptyValue(item[key])) {
                item[key] = undefined;
              }
            });
          }
        });

        return;
      }

      if (isEmptyValue(value)) {
        doc.set(path, undefined);
      }
    };

    schema.eachPath((path) => clear(path));
  });
};

export default applyRelaxedValidation;
