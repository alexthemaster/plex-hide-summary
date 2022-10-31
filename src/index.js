// @ts-check
import Database from "better-sqlite3";
import { exec } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execPromise = promisify(exec);

const dbDir =
  "/var/lib/plexmediaserver/Library/Application Support/Plex Media Server/Plug-in Support/Databases";
const dbName = "com.plexapp.plugins.library.db";

await execPromise("systemctl stop plexmediaserver");

let summaries =
  (await readFile(`${homedir()}/hiddenSummaries.json`)
    .then((buffer) => JSON.parse(buffer.toString()))
    .catch(() => null)) || {};

const db = new Database(join(dbDir, dbName));

const items = db
  .prepare(`SELECT * FROM metadata_items`)
  .all()
  .filter(
    (item) =>
      item.guid.startsWith("plex://movie") ||
      item.guid.startsWith("plex://episode")
  );

const watched = db
  .prepare(`SELECT * FROM metadata_item_views`)
  .all()
  .filter(
    (item) =>
      item.guid.startsWith("plex://movie") ||
      item.guid.startsWith("plex://episode")
  );

// Delete the summary from the old summaries if the movie/episode was delete
for (const guid in summaries) {
  if (items.find((item) => item.guid == guid)) continue;
  else delete summaries[guid];
}

for (const item of items) {
  if (watched.some((watch) => watch.guid == item.guid)) {
    // If the summary was hidden but the user has since then watched this episode then update the summary to the initial one.
    if (item.summary.startsWith("Summary hidden")) {
      const oldSummary = summaries[item.guid].replaceAll("'", "");
      delete summaries[item.guid];

      await executeQuery(
        `UPDATE metadata_items SET summary = '${oldSummary}' WHERE guid = '${item.guid}'`
      );
    }
  } else {
    if (item.summary.startsWith("Summary hidden")) continue;
    // Save summary to restore later
    summaries[item.guid] = item.summary;

    await executeQuery(
      `UPDATE metadata_items SET summary = 'Summary hidden since you have not watched this yet. https://github.com/alexthemaster/plex-hide-summary' WHERE guid = '${item.guid}'`
    );
  }
}

db.close();

await writeFile(
  `${homedir()}/hiddenSummaries.json`,
  JSON.stringify(summaries),
  "utf-8"
);

await execPromise("systemctl start plexmediaserver");

function executeQuery(query) {
  return execPromise(
    `/usr/lib/plexmediaserver/Plex\\ Media\\ Server --sqlite ${join(
      "/var/lib/plexmediaserver/Library/Application\\ Support/Plex\\ Media\\ Server/Plug-in\\ Support/Databases",
      dbName
    )} "${query}"`
  );
}
