import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const users = database.select("tasks", {
        title: search,
        description: search,
      });

      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end();
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/import_csv"),
    handler: (req, res) => {
      req.body.csv.forEach((row) => {
        const [title, description] = row;

        if (!title || !description) {
          // TODO: Create a response to this
          return;
        }

        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
        };

        database.insert("tasks", task);
      });

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.find("tasks", id);

      if (!task) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end();
      }

      const task = database.find("tasks", id);

      if (!task) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, { title, description });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.find("tasks", id);

      if (!task) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, {
        completed_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
];
