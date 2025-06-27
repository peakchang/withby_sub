<script>
    import OneImageUpload from "$lib/components/OneImageUpload.svelte";
    import axios from "axios";
    import { back_api, back_api_origin } from "$src/lib/const";
    import SortableImgMovie from "$lib/components/SortableImgMovie.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";

    export let data;

    $: data, setData();

    let getId = "";
    let getDomain = "";

    function setData() {
        console.log(data);

        getId = data.getId;
        getDomain = data.allData.ld_domain;

        if (data.ld_json_header) {
            headerObj = data.ld_json_header;
        }
        if (data.ld_json_menus) {
            menuObj = data.ld_json_menus;
            // e-모델하우스가 있으면 e-모델하우스 추가 버튼 없애기
            for (let i = 0; i < menuObj["menus"].length; i++) {
                const data = menuObj["menus"][i];
                if (data["link"] == "emodel") {
                    eModelBool = true;
                }
            }
        }

        if (data.ld_json_main) mainContents = data.ld_json_main;
        if (data.allData.ld_popup_img) popupImg = data.allData.ld_popup_img;
        if (data.allData.ld_event_img) eventImg = data.allData.ld_event_img;
        if (data.allData.ld_phone_num) phoneNumber = data.allData.ld_phone_num;
        if (data.allData.ld_sms_num) smsNumber = data.allData.ld_sms_num;
        if (data.allData.ld_sms_content)
            smsContent = data.allData.ld_sms_content;
        if (data.allData.ld_personal_info_view)
            personalInfoView = data.allData.ld_personal_info_view;
        if (data.allData.ld_footer) footer = data.allData.ld_footer;

        if (data.allData.ld_card_image) cardImg = data.allData.ld_card_image;
        if (data.allData.ld_invite_image)
            inviteImg = data.allData.ld_invite_image;

        if (data.allData.ld_description)
            siteDescription = data.allData.ld_description;

        if (data.allData.ld_add_scripts)
            addScript = data.allData.ld_add_scripts;

        if (data.allData.ld_invite_message)
            inviteMessage = data.allData.ld_invite_message;

        if (data.allData.ld_name) siteName = data.allData.ld_name;
        if (data.allData.ld_db_input_subject)
            invitationName = data.allData.ld_db_input_subject;

        if (data.allData.ld_mobile_bt_phone_img)
            phoneBottomImg = data.allData.ld_mobile_bt_phone_img;
        if (data.allData.ld_mobile_bt_event_img)
            eventBottomImg = data.allData.ld_mobile_bt_event_img;
    }

    // 섹션 창이 보여지게 하는 변수
    let sectionStatus = false;
    let sectionModifyStatus = false;
    let sectionIdx = 0;

    let contentModifyStatus = false; // 컨텐츠 수정시~
    let contentIdx = 0;

    let addContentStatus = undefined; // 컨텐츠 창이 보여지게 하는 함수 blank, text, image 등 부여되면 보여짐
    let addContentType = undefined; // blank, text, image 등 부여되게 임시 변수

    let toastArea; // toast 영역 변수 (클래스 부여할라고!)
    let toastText = ""; // toast 영역 텍스트
    let visible = false;

    // 헤더 부분!!!
    let headerObj = {
        logo_width: "180",
        header_padding: "15",
        header_color: "black",
    };

    // 메뉴 부분!!

    let menuObj = {
        color: "white",
        padding_y: "15",
        menus: [],
    };
    let menuName = "";
    let menuLink = "";
    let eModelBool = false;
    let eModelType = "";
    let eModelLink = "";

    // 메인 컨텐츠 주요 변수!
    let mainContents = []; // 전체 메인페이지 컨텐츠 총괄! sectionObj 객체가 내부 배열 요소로 들어가야함!!
    let sectionObj = { contentList: [] }; // 각 섹션을 보여줌! contentList 에는 배열 요소로 contentObj 가 들어가야함!
    let contentObj = {}; // 각각의 컨텐츠 요소! 바로바로 삭제하고 보여주고!

    // 컨텐츠 영역 임시 변수!
    let insertIdx = undefined;
    // 여백
    let contentMarginHeight = "";
    // 텍스트
    let contentText = "";
    let contentFontSize = "";
    let contentFontColor = "";
    let contentTextAlign = "";
    let contentTextEffect = "on";
    let contentTextEffectDealy = "100";

    // 이미지
    let contentImagePath = "";
    let contentImageWidth = "";
    let contentImageAlign = "";
    let contentImageEffect = "on";
    let contentImageEffectDealy = "100";
    // 유튜브 관련 변수
    let contentYoutubeLinkTemp = "";
    let contentYoutubeTag = "";

    // 기타 정보 변수!!
    let popupImg = "";
    let phoneNumber = "";
    let smsNumber = "";
    let smsContent = "";
    let eventImg = "";
    let personalInfoView = "on";
    let footer = "";
    let inviteImg = "";

    // 변수 추가!!
    let siteName = "";
    let invitationName = "초대장 발급 확인";
    let phoneBottomImg = "";
    let eventBottomImg = "";
    let cardImg = "";
    let siteDescription = "";
    let addScript = "";

    let inviteMessage = "모델하우스는 초대장이 있으신분만 방문 가능합니다.";

    // ***********************************************

    function showToast(message) {
        toastText = message;
        visible = true;

        setTimeout(() => {
            visible = false;
        }, 2000);
    }

    function logoUpdate(e) {
        const imgPath = e.detail.imgPath;
        headerObj["logo_img"] = imgPath;
    }

    function topPhoneUpdate(e) {
        headerObj["phone_img"] = e.detail.imgPath;
    }
    function popupUpdate(e) {
        popupImg = e.detail.imgPath;
    }
    function eventUpdate(e) {
        eventImg = e.detail.imgPath;
    }
    function phoneBottomImgUpdate(e) {
        phoneBottomImg = e.detail.imgPath;
    }
    function eventBottomImgUpdate(e) {
        eventBottomImg = e.detail.imgPath;
    }
    function cardImgUpdate(e) {
        cardImg = e.detail.imgPath;
    }

    function inviteImgUpdate(e) {
        inviteImg = e.detail.imgPath;
    }

    async function deleteImage() {
        if (!confirm("이미지를 삭제 하시겠습니까?")) {
            return;
        }

        let imgUrlArr = [];

        switch (this.value) {
            case "logo":
                imgUrlArr = headerObj["logo_img"].split("/");
                break;
            case "top-phone":
                imgUrlArr = headerObj["phone_img"].split("/");
                break;
            case "content":
                imgUrlArr = contentImagePath.split("/");
                break;
            case "background":
                imgUrlArr = sectionObj["backgroundImg"].split("/");
                break;
            case "popup":
                imgUrlArr = popupImg.split("/");
                break;
            case "event":
                imgUrlArr = eventImg.split("/");
                break;
            case "ph_bt_img":
                imgUrlArr = phoneBottomImg.split("/");
                break;
            case "event_bt_img":
                imgUrlArr = eventBottomImg.split("/");
                break;
            case "invite":
                imgUrlArr = inviteImg.split("/");
                break;
        }
        const deleteImagePath = `subuploads/img/${imgUrlArr[imgUrlArr.length - 2]}/${imgUrlArr[imgUrlArr.length - 1]}`;

        try {
            const res = await axios.post(
                `${back_api}/delete_single_image_only`,
                {
                    deleteImagePath,
                },
            );

            if (res.status == 200) {
                switch (this.value) {
                    case "logo":
                        headerObj["logo_img"] = "";
                        break;
                    case "top-phone":
                        headerObj["phone_img"] = "";
                        break;
                    case "content":
                        contentImagePath = "";
                        break;
                    case "background":
                        sectionObj["backgroundImg"] = "";
                        break;
                    case "popup":
                        popupImg = "";
                        break;
                    case "event":
                        eventImg = "";
                        break;
                    case "ph_bt_img":
                        phoneBottomImg = "";
                        break;
                    case "event_bt_img":
                        eventBottomImg = "";
                        break;
                    case "card":
                        cardImg = "";
                        break;
                    case "invite":
                        inviteImg = "";
                        break;
                }
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    async function backgroundImageUpload(e) {
        sectionObj["backgroundImg"] = e.detail.imgPath;
        sectionObj["backgroundWidth"] = e.detail.width;
        sectionObj["backgroundHeight"] = e.detail.height;
    }

    function contentImageUpload(e) {
        const imgPath = e.detail.imgPath;
        contentImagePath = imgPath;
    }

    function addContentFunc() {
        contentObj = {};
        if (addContentType == "blank") {
            contentObj["marginHeight"] = contentMarginHeight;
        } else if (addContentType == "text") {
            contentObj["text"] = contentText.replace(/\r\n|\r|\n/g, "\n");
            contentObj["fontSize"] = contentFontSize;
            contentObj["fontColor"] = contentFontColor;
            contentObj["align"] = contentTextAlign;
            contentObj["effect"] = contentTextEffect;
            contentObj["delay"] = contentTextEffectDealy;
        } else if (addContentType == "image") {
            contentObj["imgPath"] = contentImagePath;
            contentObj["width"] = contentImageWidth;
            contentObj["align"] = contentImageAlign;
            contentObj["effect"] = contentImageEffect;
            contentObj["delay"] = contentImageEffectDealy;
        } else if (addContentType == "youtube") {
            contentObj["youtubeTag"] = contentYoutubeTag;
        }

        console.log(contentObj);

        if (contentModifyStatus && insertIdx != undefined) {
            contentModifyStatus = false;
            insertIdx = undefined;
            showToast("수정과 삽입을 동시에 수행할수 없습니다.");
        }

        if (!contentModifyStatus && insertIdx == undefined) {
            let tempArr = [...sectionObj.contentList];
            tempArr.push(contentObj);
            sectionObj.contentList = tempArr;
        } else if (contentModifyStatus && insertIdx == undefined) {
            let tempArr = [...sectionObj.contentList];
            tempArr[contentIdx] = contentObj;
            sectionObj.contentList = tempArr;
            contentModifyStatus = false;
        } else if (insertIdx != undefined) {
            let tempArr = [...sectionObj.contentList];
            tempArr.splice(insertIdx, 0, contentObj);
            sectionObj.contentList = tempArr;
            insertIdx = undefined;
        }

        console.log(sectionObj.contentList);

        addContentStatus = undefined;

        // 임시 변수 전부 초기화!
        contentMarginHeight = "";
        contentText = "";
        contentFontSize = "";
        contentFontColor = "";
        contentTextAlign = "";
        contentTextEffect = "on";
        contentTextEffectDealy = "100";

        contentImagePath = "";
        contentImageWidth = "";
        contentImageAlign = "";
        contentImageEffect = "on";
        contentImageEffectDealy = "100";

        contentYoutubeLinkTemp = "";
        contentYoutubeTag = "";
    }

    function sectionUpdate() {
        console.log(sectionObj);

        if (!sectionModifyStatus) {
            const tempArr = [...mainContents];
            tempArr.push(sectionObj);
            mainContents = tempArr; // 메인 컨텐츠에 내용 담기
        } else {
            const tempArr = [...mainContents];
            tempArr[sectionIdx] = sectionObj; // 수정된 내용으로 교체!
            mainContents = tempArr;
            sectionModifyStatus = false;
        }

        console.log(mainContents);

        sectionObj = { contentList: [] }; // 섹션 초기화
        sectionStatus = false; // 섹션 창 닫기
    }

    function openSectionDetail() {
        sectionModifyStatus = true;

        const idx = this.value;
        sectionIdx = idx;
        if (sectionStatus) {
            showToast("작업중인 섹션을 완료 해주세요");
            return;
        }
        sectionStatus = true;
        sectionObj = mainContents[idx];
    }

    async function deleteSection() {
        if (
            !confirm(
                "삭제하시겠습니까? 이미지는 바로 삭제되므로 삭제 후 반드시 작업 업로드를 해주세요",
            )
        ) {
            return;
        }
        sectionIdx = this.value;

        // deleteImgArr 에 backgroundImg / contentList 돌면서 imgPath 있으면 넣기
        const deleteImgArrTemp = [];
        if (mainContents[sectionIdx]["backgroundImg"]) {
            deleteImgArrTemp.push(mainContents[sectionIdx]["backgroundImg"]);
        }

        for (
            let i = 0;
            i < mainContents[sectionIdx]["contentList"].length;
            i++
        ) {
            const data = mainContents[sectionIdx]["contentList"][i];
            if (data["imgPath"]) {
                deleteImgArrTemp.push(data["imgPath"]);
            }
        }

        if (deleteImgArrTemp.length > 0) {
            const deleteImgArr = deleteImgArrTemp.map((e) => {
                const imgUrlArr = e.split("/");
                return `subuploads/img/${imgUrlArr[4]}/${imgUrlArr[5]}`;
            });

            try {
                const res = await axios.post(`${back_api}/delete_many_image`, {
                    deleteImgArr,
                });
            } catch (error) {}
        }

        const tempArr = [...mainContents];

        tempArr.splice(sectionIdx, 1);
        mainContents = tempArr;

        showToast("섹션이 삭제 되었습니다. 작업 업로드를 해주세요");
    }

    function modifyContentFunc(e) {
        contentIdx = this.value;
        contentModifyStatus = true;

        addContentType = e.target.getAttribute("data-type");
        let getSectionObj = sectionObj.contentList[this.value];
        const contentType = e.target.getAttribute("data-type");
        addContentStatus = contentType;

        switch (contentType) {
            case "blank":
                contentMarginHeight = getSectionObj["marginHeight"];
                break;
            case "text":
                contentText = getSectionObj["text"];
                contentFontSize = getSectionObj["fontSize"];
                contentFontColor = getSectionObj["fontColor"];
                contentTextAlign = getSectionObj["align"];
                contentTextEffect = getSectionObj["effect"];
                contentTextEffectDealy = getSectionObj["delay"];
            case "image":
                contentImagePath = getSectionObj["imgPath"];
                contentImageWidth = getSectionObj["width"];
                contentImageAlign = getSectionObj["align"];
                contentImageEffect = getSectionObj["effect"];
                contentImageEffectDealy = getSectionObj["delay"];
            case "youtube":
                contentYoutubeTag = getSectionObj["youtubeTag"];
                contentYoutubeLinkTemp = iframeToWatchURL(contentYoutubeTag);
        }
    }

    async function deleteContentFunc(e) {
        const dataType = e.target.getAttribute("data-type");
        if (dataType == "image") {
            const imgPath = sectionObj.contentList[this.value]["imgPath"];
            const imgUrlArr = imgPath.split("/");
            const deleteImagePath = `subuploads/img/${imgUrlArr[4]}/${imgUrlArr[5]}`;

            try {
                const res = await axios.post(
                    `${back_api}/delete_single_image_only`,
                    {
                        deleteImagePath,
                    },
                );
            } catch (err) {
                console.error(err.message);
            }
        }
        const tempArr = [...sectionObj.contentList];
        tempArr.splice(this.value, 1);
        sectionObj.contentList = tempArr;
    }

    function updateImgArr(imgArr, idx) {
        const imgList = imgArr.map((e) => e.src);
        menuObj.menus[idx]["imgArr"] = imgList;
    }

    async function updateSiteSet() {
        console.log(menuObj);
        console.log(mainContents);
        console.log(headerObj);

        for (let i = 0; i < menuObj.menus.length; i++) {
            let imgArr = menuObj.menus[i].imgArr;
            if (imgArr) {
                menuObj.menus[i].imgArr = removeNulls(imgArr);
            }
        }

        for (let l = 0; l < mainContents.length; l++) {
            let tempArr = mainContents[l]["contentList"];
            if (tempArr) {
                mainContents[l]["contentList"] = removeNulls(tempArr);
            }
        }

        const ld_json_header = JSON.stringify(headerObj);
        const ld_json_main = JSON.stringify(mainContents);
        const ld_json_menus = JSON.stringify(menuObj);

        const ld_popup_img = popupImg;

        const uploadDataObj = {
            ld_json_header,
            ld_json_main,
            ld_json_menus,
            ld_popup_img: popupImg,
            ld_event_img: eventImg,
            ld_phone_num: phoneNumber,
            ld_sms_num: smsNumber,
            ld_sms_content: smsContent,
            ld_personal_info_view: personalInfoView,
            ld_footer: footer,
            ld_name: siteName,
            ld_mobile_bt_phone_img: phoneBottomImg,
            ld_mobile_bt_event_img: eventBottomImg,
            ld_db_input_subject: invitationName,
            ld_card_image: cardImg,
            ld_description: siteDescription,
            ld_add_scripts: addScript,
            ld_invite_message: inviteMessage,
            ld_invite_image: inviteImg,
        };

        console.log(uploadDataObj);

        try {
            const res = await axios.post(`${back_api}/update_site_set`, {
                get_id: getId,
                uploadDataObj,
            });
            if (res.status == 200) {
                showToast("업데이트가 완료 되었습니다.");
            } else {
                showToast("업데이트에 실패했습니다.");
            }
        } catch {}
    }

    function add_eModel() {
        // eModelBool
        const tempArr = [...menuObj.menus];
        tempArr.push({ name: "e-모델하우스", link: "emodel", emenu: [] });
        menuObj.menus = tempArr;
        eModelBool = true;
    }

    function add_emodel_ele() {
        // menuObj.menus[this.value]['emenu']
        const emodelObj = { type: eModelType, iframe_link: eModelLink };
        const tempArr = [...menuObj.menus[this.value]["emenu"]];
        tempArr.push(emodelObj);
        menuObj.menus[this.value]["emenu"] = tempArr;
        eModelType = "";
        eModelLink = "";
    }

    function removeNulls(arr) {
        return arr.filter((item) => item !== null);
    }

    let instBool = false;

    function siteInstructionFunc() {
        if (!instBool) {
            instBool = true;
            if (browser) {
                const instList = document.querySelectorAll(".site-instruction");
                for (let i = 0; i < instList.length; i++) {
                    const element = instList[i];
                    element.classList.remove("hidden");
                }
            }
        } else {
            instBool = false;
            if (browser) {
                const instList = document.querySelectorAll(".site-instruction");
                for (let i = 0; i < instList.length; i++) {
                    const element = instList[i];
                    element.classList.add("hidden");
                }
            }
        }
    }

    function generateYouTubeIframe(url) {
        const match = url.match(
            /(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/,
        );
        const videoId = match ? match[1] : null;

        if (!videoId) {
            return false;
        }

        return `<iframe class="youtube-iframe" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    function iframeToWatchURL(iframeString) {
        const match = iframeString.match(
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        );
        const videoId = match ? match[1] : null;

        return `https://www.youtube.com/watch?v=${videoId}`;
    }



    // 사이트 복사 기능!!
    let siteCopyAreaShow = false;
    let copyDomain = "";

    async function copySite() {
        if (!copyDomain) {
            alert("복사할 도메인을 입력 해주세요");
            return;
        }

        try {
            const res = await axios.post(`${back_api}/copy_site`, {
                oldDomain: getDomain,
                copyDomain,
            });

            alert('복사 완료! 관리자 페이지에서 확인 해주세요!')
        } catch (err) {
            console.log("에러 들어와야징");

            const m = err.response.data.message;
            alert(m ? m : "사이트 카피 실패 다시 시도해주세요.");
            return;
        }
    }
</script>

{#if visible}
    <div class="toasts pretendard" bind:this={toastArea} transition:fade>
        <div class="alert alert-error">
            <span class="text-white">{toastText}</span>
        </div>
    </div>
{/if}

<div class="fixed top-11 right-6 lg:right-1/4 pretendard">
    <button class="btn btn-primary btn-sm" on:click={updateSiteSet}>
        작업 업로드
    </button>
    <button
        class="btn btn-secondary btn-sm"
        on:click={() => {
            window.open(`https://${getId}.withby.kr`, "width=600,height=800");
        }}
    >
        미리보기
    </button>

    <button class="btn btn-secondary btn-sm" on:click={siteInstructionFunc}>
        설명 보기
    </button>
</div>

<div class="container max-w-[900px] py-10 px-3 mx-auto pretendard">
    <div>
        <table class=" w-[350px]">
            <tr>
                <th class="border p-2.5 w-[80px] text-sm">도메인</th>
                <td class="border p-2.5 pl-5 text-sm">{getId} </td>
                <td class="border p-2.5 pl-5">
                    <button
                        class=" bg-orange-600 px-3 py-1.5 rounded-md text-white text-xs active:bg-orange-700"
                        on:click={() => {
                            siteCopyAreaShow = !siteCopyAreaShow;
                        }}
                    >
                        사이트 복사
                    </button>
                </td>
            </tr>
        </table>

        {#if siteCopyAreaShow}
            <div
                class="w-[350px] border mt-3 flex justify-between items-center p-3"
            >
                <div>
                    <input
                        type="text"
                        class="border w-[250px] px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 rounded-md"
                        placeholder="도메인주소를 입력하세요 (영어 소문자/숫자만)"
                        bind:value={copyDomain}
                    />
                </div>
                <div class="w-[100px] text-center">
                    <button
                        class="text-sm bg-lime-700 text-white px-4 py-1.5 active:bg-lime-800 rounded-lg"
                        on:click={copySite}
                    >
                        적용
                    </button>
                </div>
            </div>
        {/if}
    </div>

    <div class="mt-3">
        <span class="text-sm font-semibold">※ 사이트 설명</span>
        <div class="mt-2">
            <textarea
                rows="3"
                class="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-blue-500 p-2"
                bind:value={siteDescription}
            ></textarea>
        </div>
    </div>

    <div class="mt-3">
        <span class="text-sm font-semibold">※ 추가 스크립트 </span>
        <div class="mt-2">
            <textarea
                rows="3"
                class="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-blue-500 p-2"
                bind:value={addScript}
            ></textarea>
        </div>
    </div>

    <div class="mb-5">
        <table class="w-full text-sm">
            <tr>
                <th class="border px-1 py-2 w-1/6">로고 이미지</th>
                <td class="border px-1 py-2 w-2/6">
                    {#if headerObj["logo_img"]}
                        <div class="m-2 p-2 bg-gray-400">
                            <img
                                src={headerObj["logo_img"].includes("http")
                                    ? headerObj["logo_img"]
                                    : `${back_api_origin}${headerObj["logo_img"]}`}
                                alt=""
                            />
                        </div>
                    {/if}

                    {#if !headerObj["logo_img"]}
                        <OneImageUpload
                            on:sendImgPath={logoUpdate}
                            domainFolder={getDomain}
                        />
                    {/if}

                    {#if headerObj["logo_img"]}
                        <button
                            class="btn btn-error btn-sm text-white"
                            value="logo"
                            on:click={deleteImage}>로고 이미지 삭제</button
                        >
                    {/if}

                    <div class="mt-3">
                        사이즈 : <input
                            type="text"
                            class="border p-1 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="미설정시 30%"
                            bind:value={headerObj["logo_width"]}
                        /> %
                    </div>
                </td>
                <th class="border px-1 py-2 w-1/6">상단 전화번호<br />이미지</th
                >
                <td class="border px-1 py-2 w-2/6">
                    {#if headerObj["phone_img"]}
                        <div class="m-2 p-2 bg-gray-400">
                            <img
                                src={headerObj["phone_img"].includes("http")
                                    ? headerObj["phone_img"]
                                    : `${back_api_origin}${headerObj["phone_img"]}`}
                                alt=""
                            />
                        </div>
                    {/if}

                    {#if !headerObj["phone_img"]}
                        <OneImageUpload
                            on:sendImgPath={topPhoneUpdate}
                            domainFolder={getDomain}
                        />
                    {/if}

                    {#if headerObj["phone_img"]}
                        <button
                            class="btn btn-error btn-sm text-white"
                            value="top-phone"
                            on:click={deleteImage}>이미지 삭제</button
                        >
                    {/if}
                    <div class="mt-3">
                        사이즈 : <input
                            type="text"
                            class="border p-1 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="미설정시 30%"
                            bind:value={headerObj["top_phone_width"]}
                        /> %
                    </div>
                </td>
            </tr>

            <tr>
                <th class="border px-1 py-2 w-1/6">헤더 색상</th>
                <td class="border px-1 py-2 w-2/6">
                    <div class="flex">
                        <label class="mr-3 flex items-center gap-1">
                            <input
                                type="radio"
                                class="radio radio-primary radio-xs"
                                value="black"
                                bind:group={headerObj["header_color"]}
                            />
                            <span>블랙</span>
                        </label>

                        <label class="mr-3 flex items-center gap-1">
                            <input
                                type="radio"
                                class="radio radio-primary radio-xs"
                                value="white"
                                bind:group={headerObj["header_color"]}
                            />
                            <span>화이트</span>
                        </label>
                    </div>
                </td>

                <th class="border px-1 py-2 w-1/6">위아래 여백</th>
                <td class="border px-1 py-2 w-2/6">
                    <input
                        type="text"
                        class="border rounded-md p-1 focus:outline-none focus:border-blue-500"
                        bind:value={headerObj["header_padding"]}
                    />PX
                </td>
            </tr>

            <!-- <tr>
                <th class="border px-1 py-2">로고 위치</th>
                <td class="border px-1 py-2 w-3/4">
                    <label class="mr-3">
                        <input
                            type="radio"
                            class="radio radio-secondary radio-sm"
                            value="left"
                            bind:group={headerObj["logo_location"]}
                        />
                        왼쪽
                    </label>

                    <label>
                        <input
                            type="radio"
                            class="radio radio-secondary radio-sm"
                            value="center"
                            bind:group={headerObj["logo_location"]}
                        />
                        가운데
                    </label>
                </td>
            </tr>
            <tr>
                <th class="border px-1 py-2">로고 이미지 가로 사이즈</th>
                <td class="border px-1 py-2 w-3/4">
                    <input
                        type="text"
                        class="border p-1"
                        bind:value={headerObj["logo_width"]}
                    /> px
                </td>
            </tr> -->

            <!-- <tr>
                <th class="border px-1 py-2">헤더 높이 / 여백 / 배경색</th>
                <td class="border px-1 py-2 w-3/4">
                    위 아래 여백 :
                    <input
                        type="text"
                        class="border p-1 w-24"
                        bind:value={headerObj["header_padding"]}
                    />
                    px /
                    <input
                        type="text"
                        class="border p-1 w-24"
                        bind:value={headerObj["header_color"]}
                    />
                </td>
            </tr> -->
        </table>
    </div>
    <div class="text-xs text-blue-600 site-instruction hidden">
        <p>
            - 로고 이미지는 PNG 권장 (사이즈는 상관 없음, 가로사이즈가 있으니까)
        </p>
        <p>
            - 헤더에 왼쪽 또는 가운데 로고가 들어가고 우측에는 전화번호 이미지
            들어감
        </p>
        <p>
            - PNG로 저장된 로고 이미지는 가로 사이즈로 조정할수 있음, (가로
            사이즈가 줄어들면 동시에 세로 사이즈도 줄어듬)
        </p>
        <p>
            - 편집된 로고 이미지에 맞춰 헤더 높이와 위 아래 여백을 반드시 설정
            해야함 (높이값을 설정해야 메뉴 밑 본문이 제대로 나옴)
        </p>
        <p>
            - 배경색은 네이버 색상표 또는 컬러피터 등으로 지정 가능, 기본적으로
            black 설정
        </p>
    </div>

    <div class="text-xs mt-8 mb-1 text-red-500 site-instruction hidden">
        <p>
            - 섹션 설명! 먼저 섹션 추가를 누른 뒤 모든 기준은 "컨텐츠 선택" 이
            기준임
        </p>
        <p>
            - 아무것도 없거나 수정(자세히 보기)이 아닌 상태에서 "컨텐츠 선택" 을
            클릭하면 컨텐츠를 추가한다는 의미임 (컨텐츠 선택시에는 컨텐츠 종류를
            선택 해야함)
        </p>
        <p>
            - 만들어진 섹션에서 "자세히 보기" 버튼을 클릭하면 그게 수정 이
            되는거임 / 수정 클릭 후 컨텐츠 종류를 선택해서 지정하면 컨텐츠
            내용을 변경 할수 있음
        </p>
        <p>
            - 컨텐츠를 수정 한 뒤에는 반드시 "컨텐츠 수정" > "섹션 수정" 을 클릭
            후 작업 업로드를 해줘야 함
        </p>
    </div>

    <div class="mb-4 border p-3">
        <div class="mb-3">
            ※ 메인 페이지 섹션!! <button
                class="btn btn-info btn-sm text-white ml-5"
                on:click={() => {
                    sectionStatus = true;
                }}
            >
                섹션 추가
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </button>
        </div>

        {#if mainContents.length != 0}
            {#each mainContents as content, idx}
                <div class="border p-2 mb-1">
                    {idx + 1} 번째 섹션

                    {#if sectionModifyStatus == false}
                        <button
                            class="btn btn-soft btn-accent btn-sm"
                            value={idx}
                            on:click={openSectionDetail}
                        >
                            자세히 보기
                        </button>

                        <button
                            class="btn btn-soft btn-error btn-sm"
                            value={idx}
                            on:click={deleteSection}
                        >
                            섹션 삭제
                        </button>
                    {:else if sectionIdx == idx}
                        <button
                            class="btn btn-soft btn-accent btn-sm"
                            on:click={() => {
                                sectionObj = { contentList: [] }; // 섹션 요소 초기화
                                sectionStatus = false; // 섹션 창 닫기
                                sectionModifyStatus = false;
                                addContentStatus = undefined; // 수정 창 닫기
                            }}
                        >
                            닫기
                        </button>
                    {/if}
                </div>
            {/each}
        {/if}

        <div class:hidden={!sectionStatus}>
            <table class="w-full text-sm">
                <tr>
                    <th class="border px-1 py-2">백그라운드 이미지</th>
                    <td class="border px-1 py-2 w-3/4">
                        {#if sectionObj["backgroundImg"]}
                            <img
                                src={sectionObj["backgroundImg"].includes(
                                    "http",
                                )
                                    ? sectionObj["backgroundImg"]
                                    : `${back_api_origin}${sectionObj["backgroundImg"]}`}
                                alt=""
                            />
                        {/if}
                        {#if !sectionObj["backgroundImg"]}
                            <OneImageUpload
                                on:sendImgPath={backgroundImageUpload}
                                domainFolder={getDomain}
                            />
                        {:else}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="background"
                                on:click={deleteImage}>이미지 삭제</button
                            >
                        {/if}
                    </td>
                </tr>
                <tr>
                    <th class="border px-1 py-2">섹션 타입</th>
                    <td class="border px-1 py-2 w-3/4">
                        <div class="p-1.5">
                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="ratio"
                                    class="radio radio-success mr-1 radio-sm"
                                    bind:group={sectionObj["bgType"]}
                                />
                                <span class="text-sm">비율 맞춤</span>
                                <span class="text-xs">(메인 이미지용)</span>
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="height"
                                    class="radio radio-success mr-1 radio-sm"
                                    checked="checked"
                                    bind:group={sectionObj["bgType"]}
                                />
                                <span class="text-sm">높이 맞춤</span>
                                <span class="text-xs">(하부 이미지용)</span>
                            </label>

                            /

                            <span class="text-sm">상단 여백 : </span>
                            <input
                                type="text"
                                class="text-sm border p-1 w-16 focus:outline-none focus:border-blue-600 rounded-md"
                                bind:value={sectionObj["paddingTopVal"]}
                            />

                            <span class="text-sm">하단 여백 : </span>
                            <input
                                type="text"
                                class="text-sm border p-1 w-16 focus:outline-none focus:border-blue-600 rounded-md"
                                bind:value={sectionObj["paddingBottomVal"]}
                            />
                        </div>

                        <div class="text-right text-xs pr-8 text-red-400">
                            ※ 상단 / 하단 여백은 높이 맞춤용이므로, 비율맞춤에선
                            적용 안됨!
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="border px-1 py-2" colspan="2">
                        <!-- 여기가 컨텐츠 리스트 부분! -->
                        {#if sectionObj.contentList.length != 0}
                            {#each sectionObj.contentList as content, idx}
                                {#if content.marginHeight}
                                    <div class="border p-2">
                                        <span>({idx + 1})</span>
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="blank"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="blank"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>
                                        여백 : {content.marginHeight} px
                                    </div>
                                {:else if content.text}
                                    <div class="border p-2">
                                        <span>({idx + 1})</span>
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="text"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="text"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>
                                        <span>텍스트 : {content.text}</span> /
                                        <span>사이즈 : {content.fontSize}</span>
                                        /
                                        <span>정렬 : {content.align}</span> /
                                        <span>효과 : {content.effect}</span>
                                    </div>
                                {:else if content.imgPath}
                                    <div class="border p-2">
                                        <span>({idx + 1})</span>
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="image"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="image"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>
                                        이미지 :

                                        <div class="m-2 p-2 bg-gray-400">
                                            <img
                                                src={content.imgPath.includes(
                                                    "http",
                                                )
                                                    ? content.imgPath
                                                    : `${back_api_origin}${content.imgPath}`}
                                                alt=""
                                                width="150"
                                                height="150"
                                            />
                                        </div>

                                        <span>가로값 : {content.width}</span> /
                                        <span>정렬 : {content.align}</span> /
                                        <span>효과 : {content.effect}</span>
                                    </div>
                                {:else if content.youtubeTag}
                                    <div class="border p-2">
                                        <span>({idx + 1})</span>
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="youtube"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="youtube"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>

                                        <div></div>

                                        <div class=" w-28">
                                            영상 :
                                            {@html content.youtubeTag}
                                        </div>
                                    </div>
                                {:else}
                                    <div class="border p-2">
                                        <span>({idx + 1})</span>
                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="youtube"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                        <div class="p-2">
                            <button
                                class="btn btn-sm btn-success text-white mr-5"
                                on:click={() => {
                                    // showToast
                                    if (!addContentType) {
                                        showToast("컨텐츠 타입을 선택하세요");
                                    }
                                    addContentStatus = addContentType;
                                    console.log(addContentStatus);

                                    console.log(addContentType);
                                }}
                            >
                                컨텐츠 선택
                                <i class="fa fa-plus-circle" aria-hidden="true"
                                ></i>
                            </button>

                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="blank"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">여백</span>
                            </label>

                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="text"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">텍스트</span>
                            </label>

                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="image"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">이미지</span>
                            </label>

                            <label class="mr-5">
                                <input
                                    type="radio"
                                    value="youtube"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">유튜브</span>
                            </label>

                            <input
                                type="text"
                                class="border p-1 w-16"
                                bind:value={insertIdx}
                            />
                            <span class="text-xs"
                                >(중간에 삽입하려면 원하는 부분 - 1 을
                                입력하세요)
                            </span>
                        </div>

                        {#if addContentStatus == "blank"}
                            <div
                                class="my-3 py-2 text-center border border-green-500"
                            >
                                <div class="text-base">
                                    <span>여백 삽입</span>
                                </div>
                                <div class="mb-2">
                                    <span class="text-xs"
                                        >(여백 및 이미지의 합이 섹션 높이보다
                                        낮게 해주세요)</span
                                    >
                                </div>
                                <div>
                                    여백 높이 : <input
                                        type="text"
                                        class="border p-1 w-24 focus:outline-none focus:border-blue-500"
                                        bind:value={contentMarginHeight}
                                    /> px
                                </div>
                            </div>
                        {:else if addContentStatus == "text"}
                            <div
                                class="my-3 py-2 text-center border border-green-500"
                            >
                                <div class="mb-2 text-base">
                                    <span>텍스트 삽입</span>
                                    <span class="text-xs"
                                        >(텍스트 넣을때만 입력 해주세요)</span
                                    >
                                </div>
                                <textarea
                                    class="border w-1/2"
                                    rows="3"
                                    bind:value={contentText}
                                ></textarea>
                                <div>
                                    폰트 사이즈 : <input
                                        type="text"
                                        class="border p-1 w-24 focus:outline-none focus:border-blue-500"
                                        bind:value={contentFontSize}
                                    />

                                    px / 폰트 색상 :
                                    <input
                                        type="text"
                                        class="border p-1 w-24 focus:outline-none focus:border-blue-500"
                                        bind:value={contentFontColor}
                                    />
                                </div>

                                <div class="my-3 text-center">
                                    정렬 기준 :

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="left"
                                            bind:group={contentTextAlign}
                                        />
                                        <span class="ml-0.5">왼쪽</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="center"
                                            bind:group={contentTextAlign}
                                        />
                                        <span class="ml-0.5">가운데</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="right"
                                            bind:group={contentTextAlign}
                                        />
                                        <span class="ml-0.5">오른쪽</span>
                                    </label>
                                </div>

                                <div>
                                    <span>효과 : </span>
                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="on"
                                            bind:group={contentTextEffect}
                                        />
                                        <span>켜기</span>
                                    </label>

                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="off"
                                            bind:group={contentTextEffect}
                                        />
                                        <span>끄기</span>
                                    </label>
                                </div>
                                <div class="mt-3">
                                    딜레이 : <input
                                        type="text"
                                        class="border p-1 w-24 focus:outline-none focus:border-blue-500"
                                        bind:value={contentTextEffectDealy}
                                    /> (100 = 1초)
                                </div>
                            </div>
                        {:else if addContentStatus == "image"}
                            <div
                                class="my-3 py-2 text-center border border-blue-500"
                            >
                                <div class="text-base mb-3">
                                    <span>이미지 삽입</span>
                                    <span class="text-xs"
                                        >(이미지 사이즈는 섹션 높이보다 작게
                                        해주세요)</span
                                    >
                                </div>

                                <div>
                                    {#if contentImagePath}
                                        <div class="m-1 p-1 bg-gray-400">
                                            <img
                                                src={contentImagePath.includes(
                                                    "http",
                                                )
                                                    ? contentImagePath
                                                    : `${back_api_origin}${contentImagePath}`}
                                                alt=""
                                            />
                                        </div>
                                    {/if}

                                    {#if !contentImagePath}
                                        <OneImageUpload
                                            on:sendImgPath={contentImageUpload}
                                            domainFolder={getDomain}
                                        />
                                    {:else}
                                        <button
                                            class="btn btn-error btn-sm text-white"
                                            value="content"
                                            on:click={deleteImage}
                                            >이미지 삭제</button
                                        >
                                    {/if}
                                </div>

                                <div class="mt-3">
                                    이미지 가로 사이즈 : <input
                                        type="text"
                                        class="border p-1 w-24 focus:outline-none focus:border-blue-500"
                                        bind:value={contentImageWidth}
                                    /> %
                                </div>

                                <div class="my-3 text-center">
                                    정렬 기준 :

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="left"
                                            bind:group={contentImageAlign}
                                        />
                                        <span class="ml-0.5">왼쪽</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="center"
                                            bind:group={contentImageAlign}
                                        />
                                        <span class="ml-0.5">가운데</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="right"
                                            bind:group={contentImageAlign}
                                        />
                                        <span class="ml-0.5">오른쪽</span>
                                    </label>
                                </div>

                                <div>
                                    <span>효과 : </span>

                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="on"
                                            bind:group={contentImageEffect}
                                        />
                                        <span>켜기</span>
                                    </label>

                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="off"
                                            bind:group={contentImageEffect}
                                        />
                                        <span>끄기</span>
                                    </label>
                                </div>
                                <div class="mt-3">
                                    딜레이 : <input
                                        type="text"
                                        class="border p-1 w-24 focus:outline-none focus:border-blue-500"
                                        bind:value={contentImageEffectDealy}
                                    /> (100 = 1초)
                                </div>
                            </div>
                        {:else if addContentStatus == "youtube"}
                            <div
                                class="my-3 py-2 text-center border border-blue-500"
                            >
                                <div class="mt-3">
                                    {#if contentYoutubeTag}
                                        <div class="my-5 flex justify-center">
                                            {@html contentYoutubeTag}
                                        </div>
                                    {/if}

                                    <div
                                        class="flex justify-center items-center gap-2"
                                    >
                                        <span>유튜브 링크 :</span>
                                        <input
                                            type="text"
                                            class="border p-1 w-36 focus:outline-none focus:border-blue-500 rounded-md"
                                            bind:value={contentYoutubeLinkTemp}
                                        />
                                        <button
                                            class="btn btn-info btn-sm text-white"
                                            on:click={() => {
                                                const tempTag =
                                                    generateYouTubeIframe(
                                                        contentYoutubeLinkTemp,
                                                    );
                                                if (!tempTag) {
                                                    showToast(
                                                        "유효한 유튜브 링크가 아닙니다.",
                                                    );
                                                } else {
                                                    contentYoutubeTag = tempTag;
                                                }

                                                console.log(mainContents);
                                            }}
                                        >
                                            적용
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/if}

                        <div class="mt-3 text-center">
                            <button
                                class="btn btn-accent text-white"
                                on:click={addContentFunc}
                            >
                                {#if contentModifyStatus}
                                    컨텐츠 수정
                                {:else}
                                    컨텐츠 추가
                                {/if}
                            </button>

                            <button
                                class="btn btn-info text-white"
                                on:click={sectionUpdate}
                            >
                                {#if !sectionModifyStatus}
                                    섹션 완료
                                {:else}
                                    섹션 수정
                                {/if}
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="text-xs text-red-500 site-instruction hidden">
        <p>
            -배경 색상은 메뉴 부분의 배경 색상을 나타냄 마찬가지로 네이버 색상표
            등에서 색상 지정 가능 (기본 white)
        </p>
        <p>
            -위 아래 여백은 메뉴 위 아래 여백을 나타내므로 반드시 작성 (기본
            15px)
        </p>
        <p>
            -메뉴이름(한글) 은 표시되는 메뉴명 / 링크주소를 사이트 주소에
            이동되는 링크 값이므로 반드시 둘 다 넣어줘야함
        </p>
        <p>
            -해당 메뉴 효과를 '켜기' 하면 애니메이션 효과가 나오고 '끄기' 하면
            애니메인션 효과 안나옴 (유튜브 작업 등 할때는 애니메이션 효과가
            없어도 되겠지)
        </p>
        <p>
            -유튜브 주소 입력은 그냥 유튜브 들어가서 주소창에 있는 링크 넣으면
            됨!
        </p>
    </div>

    <div class="border p-3">
        <div>
            ※ 하부 메뉴들!! / <span class="text-sm">배경색상 :</span>
            <input
                type="text"
                class="border p-1 w-24 text-sm"
                bind:value={menuObj["color"]}
            />

            <span class="text-sm">/ 위아래 여백 :</span>
            <input
                type="text"
                class="border p-1 w-24 text-sm"
                bind:value={menuObj["padding_y"]}
            />

            <span class="text-sm">px / 메뉴</span>
            <input
                type="text"
                class="border py-1.5 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                placeholder="메뉴이름(한글)"
                bind:value={menuName}
            />
            <input
                type="text"
                class="border py-1.5 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                placeholder="링크주소(영어)"
                bind:value={menuLink}
            />
            <button
                class="btn btn-outline btn-success btn-sm"
                on:click={() => {
                    const menuSubObj = {
                        name: menuName,
                        link: menuLink,
                    };

                    const tempArr = [...menuObj["menus"]];
                    tempArr.push(menuSubObj);
                    menuObj["menus"] = tempArr;
                    menuName = "";
                    menuLink = "";
                }}
            >
                메뉴 추가
            </button>

            {#if !eModelBool}
                <button
                    class="btn btn-outline btn-secondary btn-sm"
                    on:click={add_eModel}
                >
                    e-모델하우스
                </button>
            {/if}
        </div>

        <div class="mt-4">
            <table class="w-full">
                {#each menuObj["menus"] as menu, idx}
                    <tr>
                        <!-- e모델하우스 관련 -->
                        {#if menu.link == "emodel"}
                            <td
                                class="border w-[120px] p-2 text-center text-sm"
                            >
                                <div>{menu.name}</div>
                                <button
                                    class="btn btn-soft btn-secondary btn-xs"
                                    on:click={() => {
                                        const tempArr = [...menuObj["menus"]];
                                        tempArr.splice(idx, 1);
                                        menuObj["menus"] = tempArr;
                                        eModelBool = false;
                                    }}
                                >
                                    삭제
                                </button>
                            </td>
                            <td class="border p-2">
                                <div class="text-xs flex items-center gap-3">
                                    <label>
                                        타입 :
                                        <input
                                            type="text"
                                            class="py-1 px-2 border focus:outline-none focus:border-blue-500 w-28"
                                            bind:value={eModelType}
                                        />
                                    </label>
                                    /
                                    <label>
                                        링크 :
                                        <input
                                            type="text"
                                            class="py-1 px-2 border focus:outline-none focus:border-blue-500"
                                            bind:value={eModelLink}
                                        />
                                    </label>

                                    <button
                                        class="btn btn-info btn-xs text-white"
                                        value={idx}
                                        on:click={add_emodel_ele}
                                    >
                                        추가하기
                                    </button>
                                </div>

                                <div>
                                    {#each menu["emenu"] as emenu, idx}
                                        <div class="p-1 text-xs">
                                            <span>{idx + 1}</span> -
                                            <span>타입 : {emenu.type}</span>
                                            /
                                            <span
                                                >링크 : {emenu.iframe_link}</span
                                            >
                                        </div>
                                    {/each}
                                </div>
                            </td>
                        {:else}
                            <!-- 기타 일반 -->
                            <td class="border w-[100px] text-center text-sm">
                                <div class="relative">
                                    <div
                                        class=" absolute top-0 left-0 w-full h-full bg-white hidden z-50"
                                    >
                                        <input
                                            type="text"
                                            class="border py-1 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                                            placeholder="메뉴이름(한글)"
                                            bind:value={
                                                menuObj["menus"][idx]["name"]
                                            }
                                        />
                                        <input
                                            type="text"
                                            class="border py-1 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                                            placeholder="링크주소(영어)"
                                            bind:value={
                                                menuObj["menus"][idx]["link"]
                                            }
                                        />
                                        <button
                                            class="btn btn-success btn-xs"
                                            on:click={(e) => {
                                                e.target.parentNode.classList.add(
                                                    "hidden",
                                                );
                                            }}
                                        >
                                            적용
                                        </button>
                                    </div>

                                    <div class="p-2">
                                        <div>{menu.name}</div>
                                        <button
                                            class="btn btn-soft btn-secondary btn-xs"
                                            on:click={() => {
                                                const tempArr = [
                                                    ...menuObj["menus"],
                                                ];
                                                tempArr.splice(idx, 1);
                                                menuObj["menus"] = tempArr;
                                            }}
                                        >
                                            삭제
                                        </button>
                                        <button
                                            class="btn btn-soft btn-success btn-xs"
                                            on:click={(e) => {
                                                e.target.parentNode.parentNode.firstChild.classList.remove(
                                                    "hidden",
                                                );
                                            }}
                                        >
                                            수정
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td class="border">
                                <div
                                    class="p-2 text-xs flex items-center gap-2"
                                >
                                    <span>해당 메뉴 효과 :</span>
                                    <label class="mr-2">
                                        <input
                                            type="radio"
                                            value="on"
                                            class="radio radio-error radio-xs mr-1"
                                            bind:group={
                                                menuObj["menus"][idx]["effect"]
                                            }
                                        />
                                        <span>켜기</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="off"
                                            class="radio radio-error radio-xs mr-1"
                                            bind:group={
                                                menuObj["menus"][idx]["effect"]
                                            }
                                        />
                                        <span>끄기</span>
                                    </label>

                                    <span>(미선택시 자동 켜짐)</span>
                                </div>
                                <div class="p-2">
                                    <SortableImgMovie
                                        on:updateImgeList={(e) => {
                                            const imgArr = e.detail.imgArr;
                                            console.log(imgArr);

                                            updateImgArr(imgArr, idx);
                                        }}
                                        modifyImageList={menuObj["menus"][idx][
                                            "imgArr"
                                        ]}
                                        domainFolder={getDomain}
                                    ></SortableImgMovie>
                                </div>
                            </td>
                        {/if}
                    </tr>
                {/each}
            </table>
        </div>
    </div>

    <div class="border p-3 mt-5">
        <div>※팝업 이미지</div>
        <div class="mt-5">
            <div class="mb-3">
                {#if popupImg}
                    <img
                        src={popupImg.includes("http")
                            ? popupImg
                            : `${back_api_origin}${popupImg}`}
                        alt=""
                        class=" max-w-full"
                    />
                {/if}
            </div>
            {#if popupImg}
                <button
                    class="btn btn-error btn-sm text-white"
                    value="popup"
                    on:click={deleteImage}
                >
                    이미지 삭제
                </button>
            {:else}
                <OneImageUpload
                    on:sendImgPath={popupUpdate}
                    domainFolder={getDomain}
                />
            {/if}
        </div>
    </div>

    <div class="border p-3 mt-5">
        <div>
            ※이벤트 이미지 <span class=" text-xs text-red-600">
                (이벤트 이미지 사이즈는 900 X 900!!!!)</span
            >
        </div>
        <div class="mt-5">
            <div class="mb-3">
                {#if eventImg}
                    <img
                        src={eventImg.includes("http")
                            ? eventImg
                            : `${back_api_origin}${eventImg}`}
                        alt=""
                        class=" max-w-full"
                    />
                {/if}
            </div>
            {#if eventImg}
                <button
                    class="btn btn-error btn-sm text-white"
                    value="event"
                    on:click={deleteImage}
                >
                    이미지 삭제
                </button>
            {:else}
                <OneImageUpload
                    on:sendImgPath={eventUpdate}
                    domainFolder={getDomain}
                />
            {/if}
        </div>
    </div>

    <div class="border p-3 mt-5">
        <div>※기타 정보</div>
        <div>
            <table class="w-full">
                <tr>
                    <th class="border p-2 text-sm" style="width:15%">
                        사이트명
                    </th>
                    <td class="border p-1 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={siteName}
                        />
                    </td>
                    <th class="border p-2 text-sm" style="width:15%">
                        DB 접수 제목
                    </th>
                    <td class="border p-1 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={invitationName}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm" style="width:15%">
                        전화번호
                    </th>
                    <td class="border p-1 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={phoneNumber}
                        />
                    </td>
                    <th class="border p-2 text-sm" style="width:15%">
                        문자 전화번호
                    </th>
                    <td class="border p-1 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={smsNumber}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm" style="width:15%">
                        문자내용
                    </th>
                    <td class="border p-2 text-sm" style="width:35%">
                        <textarea
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={smsContent}
                        ></textarea>
                    </td>
                    <th class="border p-2 text-sm" style="width:15%">
                        개인정보 유무
                    </th>
                    <td class="border p-2 text-sm" style="width:35%">
                        <div class="text-center">
                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="on"
                                    class="radio radio-info"
                                    bind:group={personalInfoView}
                                />
                                있음
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="off"
                                    class="radio radio-info"
                                    bind:group={personalInfoView}
                                />
                                없음
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm" style="width:15%">
                        초대문구
                    </th>
                    <td class="border p-2 text-sm" colspan="3">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={inviteMessage}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="border p-1 text-xs md:text-sm">
                        <span class="font-normal"> 모바일 하단 </span>
                        <br />
                        <span class="font-normal"> 전화번호 이미지 </span>
                        <br />
                        <span class="text-xs text-red-600">
                            (384px X 80px 추천)
                        </span>
                    </th>
                    <td class="border">
                        {#if phoneBottomImg}
                            <img
                                src={phoneBottomImg.includes("http")
                                    ? phoneBottomImg
                                    : `${back_api_origin}${phoneBottomImg}`}
                                alt=""
                            />
                        {/if}

                        {#if phoneBottomImg}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="ph_bt_img"
                                on:click={deleteImage}
                            >
                                이미지 삭제
                            </button>
                        {:else}
                            <OneImageUpload
                                on:sendImgPath={phoneBottomImgUpdate}
                                domainFolder={getDomain}
                            />
                        {/if}
                    </td>
                    <th class="border p-1 text-xs md:text-sm">
                        <span class="font-normal"> 모바일 하단 </span>
                        <br />
                        <span class="font-normal"> 이벤트 이미지 </span>
                        <br />
                        <span class="text-xs text-red-600">
                            (384px X 80px 추천)
                        </span>
                    </th>
                    <td class="border">
                        {#if eventBottomImg}
                            <img
                                src={eventBottomImg.includes("http")
                                    ? eventBottomImg
                                    : `${back_api_origin}${eventBottomImg}`}
                                alt=""
                            />
                        {/if}

                        {#if eventBottomImg}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="event_bt_img"
                                on:click={deleteImage}
                            >
                                이미지 삭제
                            </button>
                        {:else}
                            <OneImageUpload
                                on:sendImgPath={eventBottomImgUpdate}
                                domainFolder={getDomain}
                            />
                        {/if}
                    </td>
                </tr>

                <tr>
                    <th class="border p-2">
                        <p class="text-sm">명함 이미지</p>
                        <p class="text-xs font-normal">
                            (메세지 발송시 이미지)
                        </p>
                    </th>
                    <td class="border">
                        {#if cardImg}
                            <img
                                src={cardImg.includes("http")
                                    ? cardImg
                                    : `${back_api_origin}${cardImg}`}
                                alt=""
                            />
                        {/if}

                        {#if cardImg}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="card"
                                on:click={deleteImage}
                            >
                                이미지 삭제
                            </button>
                        {:else}
                            <OneImageUpload
                                on:sendImgPath={cardImgUpdate}
                                domainFolder={getDomain}
                            />
                        {/if}
                    </td>
                    <th class="border p-2">
                        <p class="text-sm">초대장 이미지</p>
                        <p class="text-xs font-normal">(정사각형 이미지)</p>
                    </th>
                    <td class="border">
                        {#if inviteImg}
                            <div class=" max-w-[150px]">
                                <img
                                    src={inviteImg.includes("http")
                                        ? inviteImg
                                        : `${back_api_origin}${inviteImg}`}
                                    alt=""
                                    class="w-full"
                                />
                            </div>
                        {/if}

                        {#if inviteImg}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="invite"
                                on:click={deleteImage}
                            >
                                이미지 삭제
                            </button>
                        {:else}
                            <OneImageUpload
                                on:sendImgPath={inviteImgUpdate}
                                domainFolder={getDomain}
                            />
                        {/if}
                    </td>
                </tr>
            </table>

            <div class="p-3 border mt-5">
                <div>푸터 내용</div>
                <div>
                    <textarea
                        class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                        rows="4"
                        bind:value={footer}
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .toasts {
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 1000;
    }
</style>
