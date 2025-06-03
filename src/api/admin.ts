import {Api, Get, Params, Post, useContext} from '@midwayjs/hooks';
import {Context} from "@midwayjs/koa";
import { createHmac } from 'node:crypto';
import {usernameAnonymous, userNameNewBorn} from "./proto";
import * as routes from "./routes";
const axios = require('axios');

export const postLogin = Api(
    Post('/api/v1/admin/login'),
    async (username: string, passwd: string) => {
        if (process.env.FC_HAS_BACKEND) {
            return postLoginBackend(username, passwd);
        }
        if (username === usernameAnonymous) {
            return {
                username: username,
                message: "ok",
            }
        }
        for (const userPasswd of validUsers) {
            const passwdHash = createHmac('sha256', 'salt').update(passwd).digest('hex')
            if (username === userPasswd.username && passwdHash === userPasswd.passwd) {
                return {
                    username: username,
                    message: "ok",
                }
            }
        }
        const ctx = useContext<Context>();
        ctx.throw(401, {
            username: username,
            message: "password incorrect",
        });
    }
);

const postLoginBackend = async (username: string, passwd: string) => {
    const result = await axios.post('http://127.0.0.1:8001/api/v1/admin/login',{
            username: username,
            password: passwd,
        }
    );
    return result.data;
}

const validUsers: UserPasswd[] = [
    {username: userNameNewBorn, passwd: '29f55e517739d205352bbd341406e5e1a2f0c313d65176567d476fdb67bdacbe'},
]

type UserPasswd = {
    username: string
    passwd: string
}

export const postLayoutMenu = Api(
    Post("/api/v1/admin/menu"),
    async (username: string) => {
        switch (username) {
            case userNameNewBorn:
                return [routes.RouteHomeMetricsForm, routes.RouteHomeNewBornDiagnose]
            case usernameAnonymous:
            default:
                return [routes.RouteHomeMetricsForm]
        }
        return [routes.RouteHomeMetricsForm]
    }
)

export const getLayoutMenu = Api(
    Get("/api/v1/admin/menu"),
    Params<{ username: string }>(),
    async () => {
        const ctx = useContext<Context>();
        const { username } = ctx.params;
        switch (username) {
            case userNameNewBorn:
                return [routes.RouteHomeMetricsForm, routes.RouteHomeNewBornDiagnose]
            case usernameAnonymous:
            default:
                return [routes.RouteHomeMetricsForm]
        }
    }
)
