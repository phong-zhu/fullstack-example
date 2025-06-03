

export const usernameAnonymous = 'anonymous'
export const userNameNewBorn = "newBorn"

export class MetricsSelectItem {
    oldSchool: string
    newBorn: string
    meaning: string
    level: string
    group: string

    constructor(line: string[]) {
        this.oldSchool = line[0]
        this.newBorn = line[1]
        this.meaning = line[2]
        this.level = line[3]
        this.group = line[4]
    }
}
