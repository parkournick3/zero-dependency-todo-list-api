import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";
import { csv } from "./middlewares/csv.js";

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const contentType =
    req.headers["content-type"]?.split("; ")?.[0] ||
    req.headers["Content-type"]?.split("; ")?.[0];

  if (
    contentType === "multipart/form-data" ||
    contentType === "application/x-www-form-urlencoded"
  ) {
    await csv(req, res);
  } else {
    await json(req, res);
  }

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(PORT);

console.log(`Server is running on port ${PORT}`);
