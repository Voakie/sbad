# Signal backups are dumb

This is a very simple application to delete any signal backup files older than a specific amount of days.

## Usage

The following environment variables are used:
 - `BACKUP_DIR` Specifies the directory containing signal backups
 - `KEEP` The number of files to keep (always keeps the newest files)

### Manual

    yarn
    yarn build
    export BACKUP_DIR=<path to your signal backups>
    export KEEP=5
    yarn start

### Docker

Copy `docker-compose.example.yml` to `docker-compose.yml` and adjust the environment variables as needed. Then simply run:

    docker compose up
