import React from "react"
import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Button, message, Space} from 'antd';
import {Navigate} from "react-router-dom";
import {postLogin} from "../../api/admin";
import {usernameAnonymous} from "../../api/proto";
import {RouteHomeMetricsForm} from "../../api/routes";

const nameUsername = 'username'
const namePassword = 'password'

interface loginProps {
    userID: string,
    setUserID: Function,
}

export const Login: React.FC<loginProps> = (props) => {
    const {userID, setUserID} = props

    if (userID !== '') {
        return <Navigate to={RouteHomeMetricsForm} />
    }

    const loginWith = async (username: string, passwd: string) => {
        try {
            const resp = await postLogin(username, passwd)
            setUserID(resp.username)
            console.log(resp)
        } catch (error) {
            message.warning('login failed')
        }
    }

    return (
        <LoginForm
            title="NewBorn Helper"
            subTitle="NewBorn Tool"
            actions={
                <Space>
                    anonymous:
                    <Button type="primary"
                        onClick={async (e) => {
                            await loginWith(usernameAnonymous, '')
                        }
                    }>
                        anonymous login
                    </Button>
                </Space>
            }
            onFinish={async (value) => {
                const username =value[nameUsername]
                const passwd = value[namePassword]
                await loginWith(username, passwd)
            }}
        >
            <ProFormText
                name={nameUsername}
                fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'username: admin or user'}
                rules={[
                    {
                        required: true,
                        message: 'please input username!',
                    },
                ]}
            />
            <ProFormText.Password
                name={namePassword}
                fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'passwd'}
                rules={[
                    {
                        required: true,
                        message: 'please input password!',
                    },
                ]}
            />
        </LoginForm>
    )
}
