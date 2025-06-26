import Cookies from "js-cookie";
import axios from "axios";
import { back_api } from "./const";
import { goto } from "$app/navigation";
import imageCompression from "browser-image-compression";


export const isStrongPassword = (password) => {
    // 비밀번호가 6자리 이상이고, 숫자, 문자, 특수문자가 혼합되었는지 확인하는 정규표현식
    const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{6,}$/;
    return regex.test(password);
}


export const cleanPhoneNumber = (phoneNumber) => {
    // 전화번호에서 하이픈(-)을 제거하여 숫자만 남깁니다.
    const cleanedNumber = phoneNumber.replace(/-/g, "");

    // 010으로 시작하는 11자리 숫자인지 확인합니다.
    const regex = /^010\d{8}$/; // 010으로 시작하고, 뒤에 8자리 숫자가 오는지 확인하는 정규표현식
    const isValidPhoneNumber = regex.test(cleanedNumber);

    // 유효한 전화번호일 경우 숫자만 남긴 값(cleanedNumber)을 반환하고, 그렇지 않을 경우 false를 반환합니다.
    return isValidPhoneNumber ? cleanedNumber : false;
}

export const isEmptyObj = (obj) => {

    let result = true;

    try {
        if (obj.constructor === Object
            && Object.keys(obj).length === 0) {
            result = false;
        }
    } catch (error) {
        result = false;
    }



    return result;
}


export const formatDate = (date, yearBool) => {
    let returnDate;
    const year = date.getFullYear().toString().slice(2); // '23'
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로
    const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로
    const hours = String(date.getHours()).padStart(2, '0'); // 시를 2자리로
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 분을 2자리로
    if (yearBool) {
        returnDate = `${year}.${month}.${day} ${hours}:${minutes}`
    } else {
        returnDate = `${month}.${day} ${hours}:${minutes}`
    }
    return returnDate
}

export const cookiesExpireAtMidnight = (name, value) => {
    var now = new Date();

    // 현재 날짜를 설정
    now.setHours(0, 0, 0, 0);

    // 당일 자정에 만료될 쿠키를 설정하기 위해
    // 날짜를 하루 뒤로 설정
    now.setDate(now.getDate() + 1);
    now.setHours(now.getHours() + 9);

    // 쿠키 설정
    Cookies.set(name, value, { expires: now });
}


export const isValidEmail = (email) => {
    // 이메일 유효성 검사를 위한 정규 표현식
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // 정규 표현식을 사용하여 이메일 주소 검사
    return emailRegex.test(email);
}



export const dataURItoBlob = (dataURI) => {
    const bytes =
        dataURI.split(",")[0].indexOf("base64") >= 0
            ? atob(dataURI.split(",")[1])
            : unescape(dataURI.split(",")[1]);
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};


export const moveToMiddle = (target) => {
    const clientRect = target.getBoundingClientRect();
    const relativeTop = clientRect.top;
    const scrolledTopLength = window.pageYOffset;
    const absoluteTop = scrolledTopLength + relativeTop - 150;
    window.scrollTo({
        top: absoluteTop,
        behavior: "smooth",
    });

    setTimeout(() => {
        target.focus();
    }, 300)
}

export const arrangeJobList = (list) => {
    for (let i = 0; i < list.length; i++) {
        const date = new Date(list[i].st_created_at);
        const year = date.getFullYear().toString().slice(2); // '23'
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // '07'
        const day = date.getDate().toString().padStart(2, "0"); // '14'
        list[i]["date_str"] = `${year}.${month}.${day}`;

        if (list[i]['st_img']) {
            list[i]["img_arr"] = JSON.parse(list[i]['st_img'])
            list[i]['main_img'] = list[i]['img_arr'][0]['baseUrl']
        }

        if (list[i]['st_ad_badge_list']) {
            list[i]['badgeArr'] = list[i]['st_ad_badge_list'].split(',')
        }
    }
}

export const returnObjOtherVal = (obj, inpKey, inpVal, outKey) => {
    // @ts-ignore
    for (const itj of obj) {
        if (itj[inpKey] === inpVal) {
            return itj[outKey]
        }
    }
}


export const getRandomNumbers = (maxCount, count) => {
    const randomNumbers = [];

    if (maxCount < count) {
        // maxCount가 count보다 작을 경우, 가능한 범위 내에서 모든 값을 사용합니다.
        for (let i = 0; i <= count; i++) {
            const randomNumber = Math.floor(Math.random() * (maxCount + 1));
            randomNumbers.push(randomNumber);
        }
    } else {
        // maxCount가 count 이상이면 중복 없이 랜덤 값을 생성합니다.
        while (randomNumbers.length < count) {
            const randomNumber = Math.floor(Math.random() * (maxCount + 1));

            // 중복된 값이 아니면 배열에 추가
            if (!randomNumbers.includes(randomNumber)) {
                randomNumbers.push(randomNumber);
            }
        }
    }
    return randomNumbers;
}

export const customerSubmit = async (name, phone, siteName) => {

    try {
        const res = await axios.post(`${back_api}/update_customer`, {
            name, phone, siteName
        })
        if (res.data.status) {
            return true;
            // alert('초대장 발급이 확인 되었습니다. 배정된 담당자가 연락 드릴 예정입니다.')
        } else {
            alert('에러가 발생했습니다. 관리자에게 문의해주세요')
            return false;
        }
    } catch (error) {
        console.error(error.message);

        alert('에러가 발생했습니다. 관리자에게 문의해주세요')
    }
}

export function validatePhoneNumber(phoneNumber) {
    // 숫자로만 이루어진지 확인하는 정규표현식
    var numericPattern = /^\d+$/;

    // 010으로 시작하고 특수문자를 제외한 총 길이가 11인지 확인하는 정규표현식
    var pattern = /^010\d{8}$/;

    return numericPattern.test(phoneNumber) && pattern.test(phoneNumber);
}


// export const goToBoardViewAddCount = async (data: any) => {
//     try {
//         await axios.post(`${back_api}/board/plus_view_count`, {
//             boId: data.bo_id,
//         });
//     } catch (error) { }

//     goto(`/community/${data.bo_category}/${data.bo_id}`);
// }

// export const goToJobViewAddCount = async (data: any) => {
//     try {
//         await axios.post(`${back_api}/findjob/plus_view_count`, {
//             stId: data.st_id,
//         });
//     } catch (error) { }

//     goto(`/findjob/${data.st_id}`);

// }



/**
 * 이미지 업로드 액션 생성 함수
 *
 * @param {string} back_api - 백엔드 API 주소
 * @param {function} callback - 업로드 후 처리할 콜백 함수 (err, result) => {}
 * @param {object} options - 추가 옵션: { folder: "폴더명", maxWidth: 숫자 }
 * @returns {function} - 업로드 실행 함수
 */
const uploadImageAct = (back_api_url, callback, options = {}) => {

    console.log('함수 진입은 해??');

    const folder = options.folder || "testfolder2";
    // const maxWidthOrHeight = options.maxWidth || 1200;

    const input = document.createElement("input");
    console.log(input);

    input.setAttribute("type", "file");
    input.setAttribute("accept", ".png,.jpg,.jpeg,.webp");
    input.click();

    input.onchange = async (e) => {
        const imageFile = e.target.files[0];
        const options = {
            maxSizeMB: 1, // 최대 파일 크기 (MB)
            // maxWidthOrHeight: 1024, // 최대 너비 또는 높이
            useWebWorker: true, // 웹 워커 사용
        };

        try {
            const compressedFile = await imageCompression(
                imageFile,
                options,
            );

            let imgForm = new FormData();
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}${Math.random()
                .toString(36)
                .substring(2, 11)}.${compressedFile.name.split(".")[1]}`;

            console.log(fileName);

            imgForm.append("folder", folder);
            imgForm.append("onimg", compressedFile, fileName);

            // FormData의 key 값과 value값 찾기
            // let keys = imgForm.keys();
            // for (const pair of keys) {
            //     console.log(`name : ${pair}`);
            // }

            // let values = imgForm.values();
            // for (const pair of values) {
            //     console.log(`value : ${pair}`);
            // }

            const res = await axios.post(
                back_api_url,
                imgForm,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            console.log(res);
            if (typeof callback === "function") {
                callback(null, res.data);
            }
        } catch (err) {
            const m = err.response?.data?.message;
            if (typeof callback === "function") {
                callback(err, null);
            }
        }
    };


}

export default uploadImageAct;