import { getProducts, getProduct } from "@/lib/marketplace-catalog";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id         = searchParams.get("id");
  const industry   = searchParams.get("industry")   || undefined;
  const department = searchParams.get("department") || undefined;
  const type       = searchParams.get("type")       || undefined;
  const search     = searchParams.get("search")     || undefined;

  if (id) {
    const product = getProduct(id);
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ product });
  }

  const products = getProducts({ industry, department, type, search });
  return Response.json({ products, total: products.length });
}
