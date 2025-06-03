import React from "react";
import {ProCard} from "@ant-design/pro-components";
import ReactJson from 'react-json-view'

export const NewBornDiagnose = () => {
    const testData = {
        hello: "world"
    }

    return (
        <div>
            <JsonCard
                data={testData}
                title={"test"}
            />
        </div>
    )
}

interface jsonViewProps {
    data: any
    title?: string
}

export const JsonCard: React.FC<jsonViewProps> = (props) => {
    const {data, title} = props

    return (
        <ProCard
            collapsible={true}
            title={title}
            boxShadow
        >
            <ReactJson
                src={data}
                theme="monokai"
                name={false}
                displayDataTypes={false}
            />
        </ProCard>
    )
}
