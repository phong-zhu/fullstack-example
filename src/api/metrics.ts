import {Api, Get, Query, useContext} from '@midwayjs/hooks';
import {parse} from "csv-parse"
import * as fs from "node:fs";
import events from "node:events"
import {Context} from "@midwayjs/koa";
import {MetricsSelectItem} from "./proto";

let metricsSelectItems: MetricsSelectItem[] = []

export const getMetricsSelect = Api(
    Get("/api/v1/metrics/select"),
    Query<{
        level: string
        group: string
        oldSchoolName?: string
        keyword?: string
        limit?: string
    }>(),
    async () => {
        const ctx = useContext<Context>();
        const { level, group, oldSchoolName, keyword, limit } = ctx.query;
        const levelStr = level as string
        const groupStr = group as string
        const oldSchoolNameStr = oldSchoolName as string
        const keywordStr = keyword as string
        const limitNum = Number(limit)? Number(limit): 0
        if (metricsSelectItems.length === 0) {
            await loadMetricsSelectItems()
        }
        return selectMetrics(levelStr, groupStr, oldSchoolNameStr, keywordStr, limitNum)
    }
)

export const getMetricsQueryOptions = Api(
    Get("/api/v1/metrics/query-options"),
    async () => {
        if (metricsSelectItems.length === 0) {
            await loadMetricsSelectItems()
        }
        let levels = new Set()
        let groups = new Set()
        for (const item of metricsSelectItems) {
            levels.add(item.level)
            groups.add(item.group)
        }
        return [Array.from(levels).sort(), Array.from(groups).sort()]
    }
)

async function loadMetricsSelectItems() {
    if (metricsSelectItems.length > 0) {
        return
    }
    let data: MetricsSelectItem[] = []
    let rs = fs.createReadStream("public/database/metrics_database.csv")
        .pipe(parse({ delimiter: ","}))
        .on("data", (row) => {
            data.push(new MetricsSelectItem(row as string[]))
        })
        .on("error", (error) => {
            const ctx = useContext<Context>();
            ctx.throw(500, error.message);
        });
    await events.once(rs, 'close');
    metricsSelectItems = data
}

function selectMetrics(level: string, group: string, oldSchoolName: string, keyword: string, limit: number): MetricsSelectItem[] {
    let res: MetricsSelectItem[] = []
    if (oldSchoolName !== "") {
        return metricsSelectItems.filter((v, idx, arr) => {
            return filterContainers(oldSchoolName, v.oldSchool)
        })
    }
    for (const item of metricsSelectItems) {
        if (filterEqual(level, item.level) &&
            filterEqual(group, item.group) &&
            filterContainers(keyword, item.meaning)) {
            res.push(item)
        }
        if (limit > 0 && res.length >= limit) {
            return res
        }
    }
    return res
}

function filterEqual(target: string, str: string): boolean {
    if (target === "") {
        return true
    }
    return target === str
}

function filterContainers(target: string, str: string): boolean {
    if (target === "") {
        return true
    }
    return str.includes(target)
}

