import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { getAllCurrencies, getCurrencyById, upsertCurrency } from "./db.ts";

const router = new Router();
router
  .get("/", async (context) => {
    context.response.body = await getAllCurrencies();
  })
  .get("/:id", async (context) => {
    context.response.body = await getCurrencyById(context?.params?.id);
  })
  .get("/:id/:amt", async (context) => {
    const { rate } = await getCurrencyById(context?.params?.id);
    context.response.body = parseFloat(context?.params?.amt) / rate;
  })
  .post("/:id", async (context) => {
    const body = context.request.body;
    const currency = await body.json();
    await upsertCurrency(currency);
    context.response.body = `Updated ${JSON.stringify(currency)}`;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });