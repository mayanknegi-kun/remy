export async function parseFormData<T = Record<string, string>>(
  req: Request
): Promise<T> {
  const formData = await req.formData();
  return Object.fromEntries(formData.entries()) as T;
}
