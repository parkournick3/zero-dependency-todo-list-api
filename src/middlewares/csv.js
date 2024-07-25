export const csv = async (req, res) => {
  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
      const arrayOfCsvRows = Buffer.from(chunk)
        .toString()
        .split("\n")
        .filter((row) => {
          // TODO: Check this with regex
          // remove useless lines
          if (row.includes("--PieBoundary")) return false;
          if (row.includes("Content-Disposition: ")) return false;
          if (row.includes("Content-Type: ")) return false;
          if (!row) return false;
          if (row === "\r") return false;
          if (row.includes("--------------------------")) return false;

          return true;
        })
        .map((row) => row.replace("\r", ""))
        // remove header row
        .filter((_, index) => index !== 0)
        // split colums
        .map((row) => row.split(","));

      req.body = { csv: arrayOfCsvRows };
    }
  } catch (error) {
    req.body = null;
  }

  res.setHeader("Content-Type", "application/json");
};
