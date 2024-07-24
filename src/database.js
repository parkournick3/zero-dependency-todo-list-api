import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist;
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  find(table, id) {
    const data = this.#database[table] ?? [];

    return data.find((record) => record.id === id);
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search && JSON.stringify(search) !== "{}") {
      data = data.filter((row) =>
        Object.entries(search).some(([key, value]) =>
          row[key].toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    return data;
  }

  insert(table, data) {
    data = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    } else {
      throw new Error(`Record not found: ${table},${id}`);
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const oldData = this.#database[table][rowIndex];
      const newData = {
        ...oldData,
        ...data,
        id,
        updated_at: new Date().toISOString(),
      };

      this.#database[table][rowIndex] = newData;
      this.#persist();
    } else {
      throw new Error(`Record not found: ${table},${id}`);
    }
  }
}
