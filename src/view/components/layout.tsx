import {MenuDataItem, ProLayout} from "@ant-design/pro-components"
import React, {useRef, useState} from "react"
import {Dropdown} from "antd"
import {CrownFilled, LockOutlined, SmileFilled} from "@ant-design/icons";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {postLayoutMenu} from "../../api/admin";
import {RouteHomeNewBornDiagnose, RouteHomeMetricsForm, RouteLogin} from "../../api/routes";

interface layoutProps {
    userID: string
    setUserID: Function
}

export const Layout: React.FC<layoutProps> = (props) => {
    const {userID, setUserID} = props

    const [pathname, setPathname] = useState('/');
    const actionRef = useRef<{
        reload: () => void;
    }>();

    let navigate = useNavigate();
    if (userID === '') {
        return <Navigate to={RouteLogin} />
    }

    return (
        <ProLayout
            title={"NewBorn Helper"}
            location={{
                pathname:pathname,
            }}
            menuItemRender={(item, dom) => (
                <div
                    onClick={() => {
                        navigate(item.path)
                        setPathname(item.path || RouteHomeMetricsForm);
                    }}
                >
                    {dom}
                </div>
            )}
            menuDataRender={(menuData: MenuDataItem[]): MenuDataItem[] => {
                return menuData
            }}
            layout="mix"
            actionRef={actionRef}
            menu={{
                request: async () => {
                    const menuIDs = await postLayoutMenu(userID)
                    return routesAll.filter((v, idx, arr) => {
                        return menuIDs.includes(v.path)
                    })
                },
            }}
            avatarProps={{
                title: userID,
                src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                size: 'small',
                render: (props, dom) => {
                    return (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'logout',
                                        icon: <LockOutlined />,
                                        label: 'logout',
                                    }
                                ],
                                onClick: ({key}) => {
                                    setUserID('')
                                    console.log('click', userID)
                                }
                            }}
                        >
                               {dom}
                        </Dropdown>
                    )
                }
            }}
        >
            <Outlet />

        </ProLayout>
    )
}

const routesAll = [
    {
        path: RouteHomeMetricsForm,
        name: 'newBorn metrics query',
        icon: <SmileFilled />,
    },
    {
        path: RouteHomeNewBornDiagnose,
        name: 'newBorn diagnose',
        icon: <CrownFilled />,
    },
]

