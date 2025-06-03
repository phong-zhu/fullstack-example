
export class MetricsFormModel {
    fullName: string
    uuid: string
    cluster: string
    name: string
    host: string
    sidecar: string
}

export const MetricsFormModelDefault: MetricsFormModel = {
    ...new MetricsFormModel(),
    fullName: "com.cpu",
}

export class MetricsSelectModel {
    level: string
    group: string
    oldSchoolName: string
    keyword: string
}

export const MetricsSelectModelDefault: MetricsSelectModel = {
    ...new MetricsSelectModel(),
    level: 'container',
}

// export const LevelHost = 'host'
// export const LevelContainer = 'container'
//
// export const GroupCPU = 'cpu'
// export const GroupMem = 'memory'
