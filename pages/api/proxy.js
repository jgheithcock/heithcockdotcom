export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  try {
    const response = await fetch(url);
    const text = response.ok ? await response.text() : response.status;
    return new Response(text);
  } catch (e) {
    // Edge fetch throws if URL is bad
    console.error(`${e.name}: ${e.message}`);
    return new Response(`${e.name}: ${e.message}`);
  }
}
