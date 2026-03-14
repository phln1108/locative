function toTargetUrl(req, backendBaseUrl) {
  const queryPath = Array.isArray(req.query.path)
    ? req.query.path
    : req.query.path
      ? [req.query.path]
      : [];
  const pathname = req.url ? req.url.split("?")[0] : "";
  const fallbackPath = pathname.startsWith("/api/")
    ? pathname.slice("/api/".length).split("/").filter(Boolean)
    : [];
  const segments = queryPath.length > 0 ? queryPath : fallbackPath;

  const cleanBase = backendBaseUrl.replace(/\/+$/, "");
  const cleanPath = segments.map((part) => String(part)).join("/");
  const target = new URL(`${cleanBase}/${cleanPath}`);
  const requestUrl = new URL(req.url || "/", "http://localhost");
  requestUrl.searchParams.delete("path");
  requestUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value);
  });

  return target.toString();
}

function sanitizeRequestHeaders(headers) {
  const blocked = new Set([
    "host",
    "connection",
    "content-length",
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-port",
    "x-forwarded-proto",
    "x-real-ip",
    "accept-encoding",
  ]);

  const sanitized = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value || blocked.has(key.toLowerCase())) continue;
    sanitized[key] = value;
  }

  return sanitized;
}

function sanitizeResponseHeaders(headers) {
  const blocked = new Set(["content-length", "transfer-encoding", "connection"]);
  const sanitized = {};

  headers.forEach((value, key) => {
    if (blocked.has(key.toLowerCase())) return;
    sanitized[key] = value;
  });

  return sanitized;
}

<<<<<<< HEAD
=======
function getErrorDetail(error) {
  if (!(error instanceof Error)) {
    return "Unexpected proxy failure";
  }

  const cause =
    error.cause && typeof error.cause === "object" && "message" in error.cause
      ? String(error.cause.message)
      : null;

  return cause ? `${error.message}: ${cause}` : error.message;
}

>>>>>>> parent of ae33cb3 (ajuste para tratamento de cors erro)
export default async function handler(req, res) {
  const backendBaseUrl = process.env.BACKEND_API_URL?.trim();
  if (!backendBaseUrl) {
    res.status(500).json({
      message: "BACKEND_API_URL is not configured",
    });
    return;
  }

  const targetUrl = toTargetUrl(req, backendBaseUrl);
  const headers = sanitizeRequestHeaders(req.headers);
  const method = req.method || "GET";

  let body;
  if (!["GET", "HEAD"].includes(method)) {
    body =
      typeof req.body === "string" || Buffer.isBuffer(req.body)
        ? req.body
        : JSON.stringify(req.body ?? {});

    if (!headers["content-type"]) {
      headers["content-type"] = "application/json";
    }
  }

  try {
<<<<<<< HEAD
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "manual",
    });
=======
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("Upstream request timed out"), 8000);
    let upstream;
    try {
      upstream = await fetch(targetUrl, {
        method,
        headers,
        body,
        signal: controller.signal,
        redirect: "manual",
      });
    } finally {
      clearTimeout(timeout);
    }
>>>>>>> parent of ae33cb3 (ajuste para tratamento de cors erro)

    const responseHeaders = sanitizeResponseHeaders(upstream.headers);
    for (const [key, value] of Object.entries(responseHeaders)) {
      res.setHeader(key, value);
    }

    const responseBody = await upstream.text();
    res.status(upstream.status).send(responseBody);
  } catch (error) {
<<<<<<< HEAD
    const message =
      error instanceof Error ? error.message : "Unexpected proxy failure";
    res.status(502).json({
=======
    const message = getErrorDetail(error);
    const status =
      error instanceof Error && error.name === "AbortError" ? 504 : 502;
    res.status(status).json({
>>>>>>> parent of ae33cb3 (ajuste para tratamento de cors erro)
      message: "Failed to reach upstream API",
      detail: message,
      target: targetUrl,
    });
  }
}
