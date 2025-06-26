import axios from "axios";
import { back_api } from "$lib/const";
// import Cookies from "js-cookie";
// import { user_info } from "$lib/store";


export const load = (async ({ url }) => {

    console.log('에러 부분111111111111');

    const getId = url.host.split('.')[0]
    let visit_list = [];
    console.log(getId);
    try {
        const res = await axios.post(`${back_api}/get_visit_list`, { getId })
        console.log(res.data);
        if (res.data.status) {
            visit_list = res.data.visit_list
        }
    } catch (error) {

    }

    return { getId, visit_list };
}) 