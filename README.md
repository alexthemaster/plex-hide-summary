# plex-hide-summary

> **Warning**  
> This script only works on Linux distributions that use the systemd service manager.

## What does it do?

This script shuts down your Plex server and by opening the database used to store the metadata, it modifies the summary of each movie and episode you haven't watched as to not spoil you.

If the summary was removed in the past, and you have since watched a movie/episode, that piece of media's summary will be re-added.

After the process completes, the Plex server will be restarted.

## Usage

- Install [Node.js](https://nodejs.org/en/)
- Clone the repository
- Enable yarn using `corepack enable`
- Install dependencies using `yarn`
- Run the script 
  - Make sure to use sudo, since it's stopping and starting a service 
  - Optimally run it once a day, using cron
  - For example: `@daily node /home/<user>/plex-hide-summary/src/index.js`
