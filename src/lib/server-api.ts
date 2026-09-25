import { headers } from "next/headers";
import { mapTemplateFromBackend } from "@/lib/api";

export async function getServerApiBase() {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ||
    h.get("host");

  const protocol = "https";

  if (!host) {
    throw new Error("Unable to determine request host");
  }

console.log(
  "[server-api]",
  "host:", host,
  "x-forwarded-host:", h.get("x-forwarded-host"),
  "normal-host:", h.get("host"),
  "protocol:", protocol,
  "baseUrl:", `${protocol}://${host}/api`
);
  return `${protocol}://${host}/api`;
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