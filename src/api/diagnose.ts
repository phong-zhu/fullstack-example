import { Api, Post } from '@midwayjs/hooks';

export default Api(
    Post("/api/v1/newBorn-diagnose/submit"), async (msg: string) => {
        console.log(msg)
        return msg
    });


