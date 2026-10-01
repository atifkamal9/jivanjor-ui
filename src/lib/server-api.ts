import { mapTemplateFromBackend } from "@/lib/api";

export async function getServerApiBase() {
  const backendUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://jivanjor-server.onrender.com/api";
  return backendUrl.replace(/\/+$/, "");
}

export async function getServerSettings() {
  const apiBase = await getServerApiBase();

  const response = await fetch(`${apiBase}/settings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Settings API failed with ${response.status}`
    );
  }

  const result = await response.json();

  return result?.data?.settings ?? result?.data ?? result;
}

export async function getServerActiveTemplateForPage(page: string) {
  const apiBase = await getServerApiBase();

  const response = await fetch(
    `${apiBase}/templates/active/page/${encodeURIComponent(page)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Active template API failed with ${response.status}`
    );
  }

  const result = await response.json();

const temp =
  result?.data?.template ||
  result?.data;

return temp
  ? mapTemplateFromBackend(temp)
  : undefined;
}