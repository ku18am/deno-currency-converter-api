export interface Currency {
  id: string;
  rate: number;
}

const kv = await Deno.openKv();

export async function getAllCurrencies() {
  return (await Array.fromAsync(kv.list({ prefix: ["currency"] }))).map((c) =>
    c.value
  );
}

export async function getCurrencyById(id: string): Promise<Currency> {
  const key = ["currency", id];
  return (await kv.get<Currency>(key)).value!;
}

export async function upsertCurrency(currency: Currency) {
  const key = ["currency", currency.id];
  const ok = await kv.atomic()
    .set(key, currency)
    .commit();
  if (!ok) throw new Error("Something went wrong.");
}
