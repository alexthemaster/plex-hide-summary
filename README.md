# plex-hide-summary

⚠️ this script only works on Linux with the systemd service manager

## What does it do?

This script shuts off your Plex server and by opening the database used to store the metadata it modifies the summary of each movie and episode you haven't watched as so to not spoil you.

If the summary was removed in the past and you have since watched a movie/episode, that piece of media's summary will be re-added.

After the process completes, the Plex server will be restarted.

## Usage

- Install [Node.js](https://nodejs.org/en/)
- Clone the repository
- Enable yarn using `corepack enable`
- Install dependencies using `yarn`
- Run the script (make sure to use sudo, since it's stopping and starting a service - optimally run it once a day, using cron (like so: `@daily node /home/<user>/plex-hide-summary/src/index.js`))
