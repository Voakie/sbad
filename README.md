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

    docker compose up

Make sure to adjust the `docker-compose.yml` for your specific setup