export default async function handler(req, res) {
  const pathArray = req.query.path || [];
  const path = pathArray.join("/");

  let target = "";

  // Mapeamento (igual seu nginx)
  if (path.startsWith("/")) {
    target = "http://163.176.239.220:443";
  } else if (path.startsWith("strack")) {
    target = "http://204.216.155.250:80";
  } else if (path.startsWith("rvsnet")) {
    target = "http://204.216.179.226:80";
  } else {
    return res.status(404).send("Not found");
  }

  // Remove o prefixo (opcional)
  const cleanPath = path.replace(/^[^/]+/, "");
  const url = target + cleanPath;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    });

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (error) {
    res.status(500).send("Proxy error");
  }
}
