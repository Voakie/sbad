import * as fs from "fs/promises"
import path from "path"

const BACKUP_FILE_REGEX = /^signal-(\d\d\d\d)-(\d\d)-(\d\d)-(\d\d)-(\d\d)-(\d\d).backup$/

const KEEP_FILES = process.env.KEEP ? parseInt(process.env.KEEP) : 5

enum BACKUP_FILE_REGEX_GROUP {
    YEAR = 1,
    MONTH = 2,
    DAY = 3,
    HOUR = 4,
    MINUTE = 5,
    SECOND = 6
}

interface SignalBackupFile {
    filepath: string
    date: Date
}

function sortFilesByDate(f: SignalBackupFile[]) {
    return f.sort((a, b) => {
        return a.date <= b.date ? 1 : -1
    })
}

async function main() {
    if (!process.env.BACKUP_DIR) {
        throw "Env variable DIR must be specified"
    }

    let dir: string[] = []

    try {
        dir = await fs.readdir(process.env.BACKUP_DIR)
    } catch (e) {
        throw `[e] Failed to read backup directory\n -  ${e}`
    }

    const backupFiles: SignalBackupFile[] = []

    for (const file of dir) {
        const regexResult = BACKUP_FILE_REGEX.exec(file)

        if (regexResult) {
            console.log(`[i] Found ${file}`)
            backupFiles.push({
                filepath: file,
                date: new Date(
                    `${regexResult[BACKUP_FILE_REGEX_GROUP.YEAR]}-${
                        regexResult[BACKUP_FILE_REGEX_GROUP.MONTH]
                    }-${regexResult[BACKUP_FILE_REGEX_GROUP.DAY]} ${
                        regexResult[BACKUP_FILE_REGEX_GROUP.HOUR]
                    }:${regexResult[BACKUP_FILE_REGEX_GROUP.MINUTE]}:${
                        regexResult[BACKUP_FILE_REGEX_GROUP.SECOND]
                    }`
                )
            })
        }
    }

    const sortedByDate = sortFilesByDate(backupFiles)
    const deleteFiles = sortedByDate.slice(KEEP_FILES)

    for (const file of deleteFiles) {
        try {
            console.log(`[-] Deleting ${file.filepath}`)
            await fs.rm(path.join(process.env.BACKUP_DIR, file.filepath), {
                maxRetries: 3,
                retryDelay: 1000
            })
        } catch (e) {
            console.log(`[e] Failed to delete ${file.filepath}\n -  Error: ${e}`)
        }
    }

    console.log(
        `[i] Done. Found ${backupFiles.length} files, deleted ${deleteFiles.length} and kept ${
            backupFiles.length - deleteFiles.length
        }`
    )
}

main()
    .then((_) => {})
    .catch((e) => {
        console.error("[e] Execution failed!")
        console.error(e)
    })
