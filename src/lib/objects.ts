export type Field = {
  key: string;
  value: string;
  reference: { id?: string; image?: { url: string } } | null;
};

export function mapFieldsToObject<T = Record<string, string>>(fields: Field[]) {
  return fields.reduce((acc, field) => {
    return {
      ...acc,
      [field.key]: field.reference?.image
        ? field.reference.image?.url
        : field.value,
    };
  }, {}) as T;
}
