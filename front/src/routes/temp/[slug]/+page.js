import axios from "axios";
import { back_api } from "$src/lib/const";
import { error } from '@sveltejs/kit';
import moment from "moment-timezone";

export const load = async ({ fetch, url, params }) => {

    const subDomainName = url.hostname.split('.')[0]
    let menuList = []
    const nowPage = params.slug;
    let index = -1;
    try {
        const res = await axios.post(`${back_api}/get_menu`, {
            subDomainName
        })

        if (!res.data.status) {
            return error('404', 'asjfaisjfilasjdf')
        }

        menuList = JSON.parse(res.data.menuList);

        console.log(menuList);
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].pgLink === nowPage) {
                index = i;
                break;
            }
        }

    } catch (error) {
        console.error(error.message);
        return error('404', 'asjfaisjfilasjdf')
    }

    console.log(index);


    return {index}
}


