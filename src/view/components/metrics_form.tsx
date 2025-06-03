import {
    ProForm,
    ProCard,
    ProFormText,
    PageContainer,
    ProFormSelect,
    ProTable,
    ProColumns,
    TableDropdown
} from '@ant-design/pro-components';
import { Col, message, Row, Space, Input } from 'antd';
import React, {useEffect} from 'react';
import { useState } from 'react';
import {
    MetricsFormModel,
    MetricsFormModelDefault,
    MetricsSelectModel, MetricsSelectModelDefault
} from "../metrics/metrics";
import * as utils from "../utils/utils"
import "./styles.css"
import {getMetricsQueryOptions, getMetricsSelect} from "../../api/metrics";
import {MetricsSelectItem} from "../../api/proto";

const rewriteWarning = "one of uuid or cluster must be set"
const metricsDocURL = "https://www.google.com/"

const tagKeyInfo = 'info'
const tagKeyQuery = 'query'

export const MetricsForm = () => {
    const [tabKey, setTabKey] = useState(tagKeyQuery)
    // const arr: MetricsSelectItem[] = [new MetricsSelectItem(["oldSchool", "newBorn", "meaning", "level", "group"])]

    const [metricsSelects, setMetricsSelects] = useState<MetricsSelectItem[]>([])
    const [levelOptions, setLevelOptions] = useState<string[]>([])
    const [groupOptions, setGroupOptions] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const metricsSelectInit = await getMetricsSelect({query:{ level: "", group: "", limit: "1"}})
            setMetricsSelects(metricsSelectInit)
        }
        fetchData().then(resolve => {})
    },[]);

    useEffect(() => {
        const fetchData = async () => {
            const [levels, groups] = await getMetricsQueryOptions()
            setLevelOptions(levels as string[])
            setGroupOptions(groups as string[])

        }
        fetchData().then(resolve => {})
    },[]);


    // @ts-ignore
    const metricsSelectColumns: ProColumns<MetricsSelectItem> = [
        {
            title: 'oldSchool',
            width: "25%",
            dataIndex: 'oldSchool',
        },
        {
            title: 'newBorn',
            width: "25%",
            dataIndex: 'newBorn',
            copyable: true,
        },
        {
            title: 'meaning',
            width: "25%",
            dataIndex: 'meaning',
        },
        {
            title: 'level',
            width: "12.5%",
            dataIndex: 'level',
        },
        {
            title: 'group',
            width: "12.5%",
            dataIndex: 'group',
        },

    ]

    return (
        <PageContainer
            title={false}
            tabList={[
                {
                    tab: 'newBorn info',
                    key: tagKeyInfo,
                },
                {
                    tab: 'query',
                    key: tagKeyQuery,
                },
            ]}
            tabProps={{
                type: 'card',
                activeKey: tabKey,
                onChange: (key) => {
                    setTabKey(key)
                },
            }}
        >
            {tabKey === tagKeyInfo && <NewBornInfo/>}
            {tabKey === tagKeyQuery &&
            <ProCard key={tagKeyInfo} className={"container"} split="horizontal">
                <ProCard split="vertical">
                    <ProCard colSpan="50%" title={"query"}>
                        <MetricsQuery
                            setMetricsSelects = {setMetricsSelects}
                            groupOptions={groupOptions}
                            levelOptions={levelOptions}
                        />
                    </ProCard>

                    <ProCard colSpan="50%" title={"jump"}>
                        <MetricsJump />
                    </ProCard>
                </ProCard>
                <ProCard title={"query result"}>
                    <ProTable<MetricsSelectItem>
                        dataSource={metricsSelects}
                        rowKey="key"
                        pagination={{
                            showQuickJumper: true,
                            pageSize: 10,
                        }}
                        // @ts-ignore
                        columns={metricsSelectColumns}
                        search={false}
                        options={{reload: false}}
                    >
                    </ProTable>
                </ProCard>

            </ProCard>}
        </PageContainer>
    );
};

const NewBornInfo = () => {
    return (
        <div>newBorn info</div>
    )
}

interface MetricsQueryProps {
    setMetricsSelects: Function,
    groupOptions: string[],
    levelOptions: string[],
}

const MetricsQuery: React.FC<MetricsQueryProps> = (props) => {
    const {
        setMetricsSelects,
        groupOptions,
        levelOptions,
    } = props

    return (
        <ProForm<MetricsSelectModel>
            onFinish={async (value: MetricsSelectModel) => {
                const level = value.level === undefined? "" : value.level
                const group = value.group === undefined? "" : value.group
                const oldSchoolName = value.oldSchoolName === undefined? "" : value.oldSchoolName
                const keyword = value.keyword === undefined? "" : value.keyword
                let resp = await getMetricsSelect(
                    {query: {
                        level: level,
                        group: group,
                        oldSchoolName: oldSchoolName,
                        keyword: keyword,
                        }
                    })
                setMetricsSelects(resp)
            }}
            initialValues={MetricsSelectModelDefault}
            submitter={{
                searchConfig: {
                    submitText: 'Query',
                },
                resetButtonProps: {
                    style: {
                        display: 'none',
                    },
                },
            }}
        >
            <ProFormSelect
                width="md"
                name="level"
                label="level: host or container"
                options={generateFormOptions(levelOptions)}
            />
            <ProFormSelect
                width="md"
                name="group"
                label="group:"
                options={generateFormOptions(groupOptions)}
            />
            <ProFormText
                width="md"
                name="oldSchoolName"
                label="oldSchoolName:"
            />
            <ProFormText
                width="md"
                name="keyword"
                label="keyword:"
            />

        </ProForm>
    )
}

const MetricsJump = () => {
    return (
        <ProForm<MetricsFormModel>
            onFinish={async (value: MetricsFormModel) => {
                if (utils.isStringEmpty(value.uuid) && utils.isStringEmpty(value.cluster)) {
                    message.warning(rewriteWarning)
                    return
                }
                let metricsURL = generateMetricsURL(value)
                console.log(metricsURL);
                window.open(metricsURL)
            }}
            initialValues={MetricsFormModelDefault}
        >

            <ProFormText
                width="md"
                name="fullName"
                label="fullName"
                tooltip={<a href={metricsDocURL} target="_blank" style={{ color: "#FFFFFF" }}>doc</a>}
            />
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="uuid"
                    label="uuid"
                    placeholder={rewriteWarning}
                />
                <ProFormText
                    width="md"
                    name="cluster"
                    label="cluster"
                    placeholder={rewriteWarning}
                />
            </ProForm.Group>
            <ProFormText
                width="md"
                name="name"
                label="name"
            />
            <ProFormText
                width="md"
                name="host"
                label="host"
            />
            <ProFormText
                width="md"
                name="sidecar"
                label="sidecar"
            />
        </ProForm>
    )
}

function generateMetricsURL(data: MetricsFormModel): string {
    return `https://google.com`
}

function generateFormOptions(options: string[]): any {
    let res = []
    for (const opt of options) {
        res.push({value: opt, label: opt})
    }
    return res
}
