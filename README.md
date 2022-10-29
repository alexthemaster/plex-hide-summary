# plex-hide-summary

(this script works on Linux with the systemd service manager)

## What does it do?

This script shuts off your Plex server and modifies the summary of each movie and episode you haven't watched as so to not spoil you. If the summary was removed in the past and you have since then watched the video, then it will be re-added. After the process completes, the Plex server will be restarted.

## Usage

- Install [Node.js](https://nodejs.org/en/)
- Clone the repository
- Enable yarn using `corepack enable`
- Install dependencies using `yarn`
- Run the script (make sure to use sudo, since it's stopping and starting a service - optimally run it once a day, using cron (like so: `@daily node /home/<user>/plex-hide-summary/src/index.js`))
