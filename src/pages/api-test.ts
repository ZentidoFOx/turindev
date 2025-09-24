import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: "Hola desde la API de Astro SSR 🚀" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
