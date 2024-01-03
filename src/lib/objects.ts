export type Field = {
  key: string;
  value: string;
  reference?: {} | null;
  references?: any | null;
};

export function mapFieldsToObject<T = Record<string, string>>(fields: Field[]) {
  return fields.reduce((acc, field) => {
    return {
      ...acc,
      [field.key]:
        field.reference && Object.keys(field.reference).length > 0
          ? field.reference
          : field.references || field.value,
    };
  }, {}) as T;
}
