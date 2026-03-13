const DEFAULT_BACKEND_API_URL = "http://localhost:18000";
const allowSelfSignedTls =
  String(process.env.ALLOW_SELF_SIGNED_TLS || "").toLowerCase() === "true";

if (allowSelfSignedTls) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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

  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    if (Array.isArray(value)) {
      value.forEach((item) => target.searchParams.append(key, String(item)));
      continue;
    }
    if (value !== undefined) {
      target.searchParams.append(key, String(value));
    }
  }

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

export default async function handler(req, res) {
  const allowOrigin = req.headers.origin || "*";
  const requestedHeaders = req.headers["access-control-request-headers"];
  const requestedMethod = req.headers["access-control-request-method"];

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin, Access-Control-Request-Headers, Access-Control-Request-Method");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", requestedHeaders || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    requestedMethod || "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const backendBaseUrl =
    process.env.BACKEND_API_URL ||
    process.env.VITE_API_URL ||
    DEFAULT_BACKEND_API_URL;

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
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = sanitizeResponseHeaders(upstream.headers);
    for (const [key, value] of Object.entries(responseHeaders)) {
      res.setHeader(key, value);
    }

    const responseBody = await upstream.text();
    res.status(upstream.status).send(responseBody);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected proxy failure";
    res.status(502).json({
      message: "Failed to reach upstream API",
      detail: message,
      target: targetUrl,
    });
  }
}
