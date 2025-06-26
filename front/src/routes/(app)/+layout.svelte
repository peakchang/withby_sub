<script>
    import "$src/app.pcss";
    import { page } from "$app/stores";
    import SeoMeta from "$lib/components/SeoMeta.svelte";
    import { onMount } from "svelte";
    import ModalCustom from "$lib/components/ModalCustom.svelte";
    import { validatePhoneNumber } from "$lib/lib";
    import Cookies from "js-cookie";
    import axios from "axios";
    import { back_api, back_api_origin } from "$src/lib/const";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    let seoValue = {};
    let siteData = {};

    // 구버전 변수!!!
    let menuList = [];
    let bannerList = [];
    let customerName = "";
    let customerPhone = "";

    let formModalopen = false;
    let eventEle;
    let y = 0;
    let lastScrollY = 0;
    let isMenuVisible = true;
    let rightFixPhone = [];

    // 신버전 변수!!!
    let headerData = {};
    let menuData = {};
    let mainPageMarginTop = 0;
    let screenWidth = "860px";
    let callImgWidth = 0;
    let callImgMarginBlank = 0;

    // 공통 변수!!
    let showPopup = false;
    let personalInfo;
    let chk_modal;
    let inviteChk = false;

    // 임시!
    let isDarkMode = false;

    export let data;
    $: data, setData();
    function setData() {
        // 공통 부분!!
        seoValue = data.seoValue;
        siteData = data.subView;
        console.log(siteData);

        const popupShow = Cookies.get("popup_close");
        if (popupShow == "ok") {
            showPopup = false;
        } else {
            showPopup = true;
        }

        // 구버전!!!!
        if (!siteData.ld_view_type || siteData.ld_view_type == "old") {
            menuList = JSON.parse(siteData.ld_menu);
            if (siteData.ld_banner_img) {
                bannerList = siteData.ld_banner_img.split(",");
            }

            if (siteData.ld_phone_num) {
                rightFixPhone = siteData.ld_phone_num.split("-");
            }
        } else {
            // 신버전!!!
            try {
                if (siteData.ld_json_header) {
                    headerData = JSON.parse(siteData.ld_json_header);
                    console.log(headerData);
                }
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
            }

            try {
                if (siteData.ld_json_menus) {
                    menuData = JSON.parse(siteData.ld_json_menus);
                }
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
            }

            if (browser) {
                const element = document.querySelector(".logo-area");
                console.log(element);

                callImgWidth = element.offsetHeight;
                console.log("logo-area height");
                console.log(callImgWidth);

                if (callImgWidth > 35) {
                    callImgMarginBlank = (callImgWidth - 35) / 2;
                    callImgWidth = 35;
                }

                const headerArea = document.querySelector(".header-area");
                const menuArea = document.querySelector(".menu-area");
                const headerHeight = headerArea.offsetHeight;
                const menuHeight = menuArea.offsetHeight;
                console.log(headerHeight);
                console.log(menuHeight);
                mainPageMarginTop = headerHeight + menuHeight;
                console.log(mainPageMarginTop);
            }
        }
    }

    onMount(async () => {
        // 공통 구간!!!
        const getVisitedCookie = Cookies.get("topby_visited");
        const referrer = document.referrer;
        if (!getVisitedCookie) {
            const res = await axios.post(`${back_api}/update_visit_count`, {
                ld_id: siteData["ld_id"],
                ld_domain: siteData["ld_domain"],
                ld_visit_count: siteData["ld_visit_count"],
                referrer,
            });

            Cookies.set("topby_visited", "ok", { expires: 1 });
        }

        // 구버전 onMount 코드!!!
        if (!siteData.ld_view_type || siteData.ld_view_type == "old") {
            AOS.init();
        }

        // 다크모드 처리

        if (browser) {
            isDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
        }
    });

    // 구버전 함수 및 코드들!!!!

    $: y, setScroll();

    function setScroll() {
        if (y > 200) {
            const currentScrollY = y;
            isMenuVisible = currentScrollY < lastScrollY; // 위로 스크롤이면 보임
            lastScrollY = currentScrollY;
        } else {
            isMenuVisible = true; // 아래로 스크��이면 보임
            lastScrollY = 0; // scrollY ���기화
        }
    }

    function closePopup() {
        Cookies.set("popup_close", "ok", { expires: 1 });
        showPopup = false;
    }

    function addCallCount() {
        if (!siteData["ld_call_clickcount"]) {
            siteData["ld_call_clickcount"] = 0;
        }

        try {
            const res = axios.post(`${back_api}/add_call_count`, {
                ld_id: siteData["ld_id"],
                callCount: siteData["ld_call_clickcount"],
            });
        } catch (error) {}
    }

    function addSmsCount() {
        if (!siteData["ld_sms_clickcount"]) {
            siteData["ld_sms_clickcount"] = 0;
        }

        try {
            const res = axios.post(`${back_api}/add_sms_count`, {
                ld_id: siteData["ld_id"],
                smsCount: siteData["ld_sms_clickcount"],
            });
        } catch (error) {}

        // let smsHref = "";

        let smsBody = ""
        if (siteData.ld_sms_content && siteData["ld_event_img"]) {
            // smsHref = `sms:${siteData.ld_sms_num}?body=${siteData.ld_name} ${siteData.ld_sms_content}`;

            smsBody = `${siteData.ld_name} ${siteData.ld_sms_content}`
        } else if (siteData.ld_event_img) {
            // smsHref = `sms:${siteData.ld_sms_num}?body=${siteData.ld_name} 이벤트 참여!`;

            smsBody = `${siteData.ld_name} 이벤트 참여!`
        }

        // window.location.href = smsHref

        window.location.href = `/sms?smsnum=${siteData.ld_sms_num}&body=${smsBody}`;
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        isMenuVisible = currentScrollY < lastScrollY; // 위로 스크롤이면 보임
        lastScrollY = currentScrollY;
    };
    // customerName,
    //                                 customerPhone,
    //                                 siteName,
    async function customerSubmit(name, phone, siteName) {
        try {
            const res = await axios.post(`${back_api}/update_customer`, {
                name,
                phone,
                siteName,
            });

            window.location.href = "/thankyou?return=true";
        } catch (error) {
            console.error(error.message);

            alert("에러가 발생했습니다. 관리자에게 문의해주세요");
        }
    }
</script>

<svelte:head>
    {#if siteData.ld_add_scripts}
        {@html siteData.ld_add_scripts}
    {/if}
    <SeoMeta bind:seoValue />
    <!-- SUIT 폰트 CSS -->
    <link
        href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
        rel="stylesheet"
    />
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
</svelte:head>
<svelte:window bind:scrollY={y} />

<!-- 공통!! (팝업) -->
{#if siteData.ld_popup_img && showPopup}
    <div
        class="fixed border left-5 md:left-56 top-44 z-[99] max-w-[450px] w-2/3 bg-white suit-font"
    >
        <div class="p-1 text-xs flex justify-end items-center gap-2">
            <span>24시간 동안 보지 않기</span>
            <button
                class="text-lg flex justify-center items-center"
                on:click={closePopup}
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>
        </div>
        <img
            src={siteData["ld_popup_img"].includes("http")
                ? siteData["ld_popup_img"]
                : `${back_api_origin}${siteData["ld_popup_img"]}`}
            alt=""
        />
    </div>
{/if}

<dialog id="chk_modal" class="modal suit-font" bind:this={chk_modal}>
    <div class="modal-box">
        <h3 class="text-lg font-bold">초대장 발급이 확인 되었습니다.</h3>
        <h3 class="text-lg font-bold">배정된 담당자가 연락 드릴 예정입니다.</h3>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">닫기</button>
            </form>
        </div>
    </div>
</dialog>

<!-- 구버전 상단!! -->
{#if !siteData.ld_view_type || siteData.ld_view_type == "old"}
    <div class="menu {isMenuVisible ? 'visible' : 'hidden'} z-[999]">
        <div
            class="max-w-[896px] w-full mx-auto p-3 pretendard"
            data-sveltekit-preload-data="tap"
        >
            <div
                class="text-center flex justify-between items-center mb-3 gap-8"
            >
                {#if siteData.ld_logo}
                    <a href="/">
                        <img
                            src={siteData["ld_logo"].includes("http")
                                ? siteData["ld_logo"]
                                : `${back_api_origin}${siteData["ld_logo"]}`}
                            alt=""
                            class="w-full max-w-72"
                        />
                    </a>
                {:else}
                    <a href="/">logo</a>
                {/if}

                {#if siteData.ld_ph_img && siteData.ld_phone_num}
                    <a href="TEL:{siteData.ld_phone_num}">
                        <img
                            src={siteData["ld_ph_img"].includes("http")
                                ? siteData["ld_ph_img"]
                                : `${back_api_origin}${siteData["ld_ph_img"]}`}
                            alt=""
                            class="w-full max-w-72"
                        />
                    </a>
                {/if}
            </div>

            <ul
                class="flex justify-around items-center font-semibold text-base md:text-lg"
            >
                {#each menuList as menu}
                    {#if menu.pgLink && menu.pgName}
                        <a href="/{menu.pgLink}">
                            <li style="color:black !important;">
                                {menu.pgName}
                            </li>
                        </a>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
    <div
        class="hidden md:block fixed bottom-52 right-0 z-[999] rounded-l overflow-hidden bg-[#f7f4ec]"
    >
        <div
            class="text-center leading-none font-semibold text-xl pt-3"
            style="color:#595959;"
        >
            {#each rightFixPhone as num}
                <p>{num}</p>
            {/each}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="p-1 cursor-pointer"
            on:click={() => {
                goto("/");
            }}
        >
            <img src="/right-fix/fix-1.jpg" alt="" />
        </div>
        <!-- <div class="p-1">
		<img src="/right-fix/fix-2.jpg" alt="" />
	</div> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="p-1 cursor-pointer"
            on:click={() => {
                eventEle.scrollIntoView({ behavior: "smooth" });
            }}
        >
            <img src="/right-fix/fix-3.jpg" alt="" />
        </div>
    </div>
{:else}
    <!-- 신버전 상단!!! -->

    <!-- 우측 따라다니는 버튼!! -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed bottom-16 md:bottom-1/3 right-5 z-[999] cursor-pointer"
        on:click={() => {
            if (browser) {
                const y =
                    eventEle.getBoundingClientRect().top +
                    window.pageYOffset -
                    135;

                console.log(y);

                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }}
    >
        <div class="w-20 md:w-24 animate-pulse rounded-full overflow-hidden">
            {#if siteData.ld_invite_image}
                <img
                    src={siteData.ld_invite_image.includes("http")
                        ? siteData.ld_invite_image
                        : `${back_api_origin}${siteData.ld_invite_image}`}
                    alt=""
                />
            {:else}
                <img src="/move-icon.png" alt="" />
            {/if}
        </div>
    </div>

    <!-- 헤더 전화하기 버튼!! -->

    <!-- 리얼 헤더!! -->
    <div class="fixed top-0 left-0 w-full z-50">
        <div
            class="header-area"
            style="background-color: {headerData.header_color}; padding: {headerData.header_padding}px"
        >
            <!-- <div
                class="flex logo-area mx-auto relative"
                class:justify-start={headerData.logo_location == "left"}
                class:justify-center={headerData.logo_location == "center"}
                style="max-width:860px;"
                data-sveltekit-reload
            >
                <div
                    class="absolute top-0 right-0 rounded-full"
                    style="z-index=999999;"
                >
                    <div
                        class="cursor-pointer bg-white rounded-full"
                        style="margin-top: {callImgMarginBlank}px;"
                    >
                        <a
                            href="TEL:{siteData.ld_phone_num}"
                            on:click={addCallCount}
                        >
                            <img
                                src="/call-icon.png"
                                alt=""
                                width={callImgWidth}
                            />
                        </a>
                    </div>
                </div>

                <a href="/">
                    <img
                        src={headerData.logo_img}
                        alt=""
                        width={headerData.logo_width}
                    />
                </a>
            </div> -->

            <div
                class="flex items-center justify-between logo-area mx-auto max-w-[860px] relative text-white"
                data-sveltekit-reload
            >
                <div
                    style="width: {headerData.logo_width
                        ? `${headerData.logo_width}%`
                        : '30%'}"
                >
                    {#if headerData.logo_img}
                        <a href="/">
                            <img
                                src={headerData.logo_img.includes("http")
                                    ? headerData.logo_img
                                    : `${back_api_origin}${headerData.logo_img}`}
                                alt=""
                                style="width:100%"
                            />
                        </a>
                    {/if}
                </div>

                <div
                    style="width: {headerData.top_phone_width
                        ? `${headerData.top_phone_width}%`
                        : '30%'}"
                >
                    {#if siteData.ld_phone_num && headerData.phone_img}
                        <a
                            href="TEL:{siteData.ld_phone_num}"
                            on:click={addCallCount}
                        >
                            <img
                                src={headerData.phone_img.includes("http")
                                    ? headerData.phone_img
                                    : `${back_api_origin}${headerData.phone_img}`}
                                alt=""
                                style="width:100%"
                            />
                        </a>
                    {/if}
                </div>
            </div>

            <!-- <div
                class="flex logo-area relative max-w-[860px]"
                class:justify-start={headerData.logo_location == "left"}
                class:justify-center={headerData.logo_location == "center"}
                data-sveltekit-reload
            >
                <div
                    class="absolute top-5 right-5 rounded-full bg-white"
                    style="z-index=999999;"
                >
                    <img src="/call-icon.png" alt="" width="35" />
                </div>


                <a href="/">
                    <img
                        src={headerData.logo_img}
                        alt=""
                        width={headerData.logo_width}
                    />
                </a>
            </div> -->
        </div>

        <!-- 메뉴 부분!!! -->
        <div
            class="pretendard border-b mx-auto menu-area"
            style="padding: {menuData.padding_y}px; pretendard; max-width:{screenWidth}; background-color:white !important;"
        >
            <ul
                class="flex justify-around"
                data-sveltekit-preload-data="tap"
                data-sveltekit-reload
            >
                {#if menuData.menus}
                    {#each menuData.menus as menu}
                        <a
                            href="/{menu.link}"
                            class=" dark:text-white"
                            style="color: black !important;"
                        >
                            <li
                                class="menu-list"
                                style="color: black !important;"
                            >
                                {menu.name}
                            </li>
                        </a>
                    {/each}
                {/if}
            </ul>
        </div>
    </div>
{/if}

{#if !siteData.ld_view_type || siteData.ld_view_type == "old"}
    <div class="mt-40 md:mt-48 max-w-[960px] mx-auto">
        <slot />
    </div>
{:else}
    <div
        class="mx-auto"
        style="margin-top: {mainPageMarginTop + 10}px; max-width:{screenWidth};"
    >
        <slot />
    </div>
{/if}

<!-- 공통으로 들어가는 이미지!! -->
<div
    class="max-w-[860px] mx-auto md:flex md:justify-center md:items-stretch"
    bind:this={eventEle}
>
    {#if siteData.ld_event_img}
        <div class="md:w-1/2">
            <a href="sms:" on:click|preventDefault={addSmsCount}>
                <img
                    src={siteData["ld_event_img"].includes("http")
                        ? siteData["ld_event_img"]
                        : `${back_api_origin}${siteData["ld_event_img"]}`}
                    alt=""
                />
            </a>
        </div>
    {/if}

    <div class="md:w-1/2 md:px-5 suit-font flex items-stretch pretendard">
        <div
            class="w-full p-5 flex flex-col justify-center gap-8 rounded-md"
            style="background-color: #f7f4ec !important;"
        >
            <div>
                <div
                    class="text-3xl font-bold mb-2 text-center"
                    style="color : black !important;"
                >
                    {siteData.ld_db_input_subject
                        ? siteData.ld_db_input_subject
                        : "초대장 발급 확인"}
                </div>
                <!-- <div class="text-xs">
					관심고객 등록을 통하여 이름, 전화번호만을 수집하며, 정보 및
					이벤트 등의 안내를 위해서만 사용됩니다. 회사는 상담후
					해당정보를 지체없이 파기합니다. 양식 제출 시
					개인정보수집이용에 동의한 것으로 간주됩니다.
				</div> -->
            </div>
            <div>
                <div class="mb-3">
                    <input
                        type="text"
                        class="w-full text-lg p-2.5 rounded-xl"
                        placeholder="이름"
                        bind:value={customerName}
                    />
                </div>
                <div class="mb-3">
                    <input
                        type="text"
                        class="w-full text-lg p-2.5 rounded-xl"
                        placeholder="전화번호"
                        bind:value={customerPhone}
                    />
                </div>

                <div class="my-6">
                    {#if siteData.ld_personal_info_view == "on"}
                        <div
                            class="flex items-center justify-between mb-2 text-sm pr-3"
                        >
                            <div>
                                <label class="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-neutral checkbox-sm"
                                        bind:checked={inviteChk}
                                    />
                                    <span style="color:black !important;"
                                        >개인정보 보호동의</span
                                    >
                                </label>
                            </div>
                            <button
                                class=" text-blue-600"
                                on:click={() => {
                                    personalInfo.showModal();
                                }}
                            >
                                [보기]
                            </button>
                        </div>
                    {/if}

                    <div class="flex items-center gap-3 mb-2 text-sm">
                        <div>
                            <img
                                src="/megaphone.png"
                                alt=""
                                width="20"
                                height="20"
                            />
                        </div>
                        <div style="color:black !important;">
                            {#if siteData.ld_invite_message}
                                {siteData.ld_invite_message}
                            {:else}
                                <span>
                                    모델하우스는 초대장이 있으신분만 방문
                                    가능합니다.
                                </span>
                            {/if}
                        </div>
                    </div>

                    <div class="flex items-center gap-3 text-sm">
                        <div>
                            <img
                                src="/megaphone.png"
                                alt=""
                                width="20"
                                height="20"
                            />
                        </div>
                        <div style="color:red !important;">
                            미 예약시 관람을 제한하는 점 양해 부탁드립니다.
                        </div>
                    </div>
                </div>

                <div class="w-full">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a
                        href="book:"
                        on:click|preventDefault={() => {
                            const siteName = siteData.ld_site;

                            if (!customerName) {
                                alert("성함을 입력 해주세요.");
                                return;
                            }

                            if (!customerPhone) {
                                alert("전화번호를 입력 해주세요.");
                                return;
                            }

                            if (
                                !inviteChk &&
                                siteData.ld_personal_info_view == "on"
                            ) {
                                alert(
                                    "개인정보 보호동의에 체크해주셔야 합니다.",
                                );
                                return;
                            }

                            if (!validatePhoneNumber(customerPhone)) {
                                alert("정상적인 휴대폰 번호만 가능합니다.");
                                return false;
                            }
                            const resSend = customerSubmit(
                                customerName,
                                customerPhone,
                                siteName,
                            );

                            if (resSend) {
                                customerName = "";
                                customerPhone = "";
                                inviteChk = false;
                            }
                        }}
                    >
                        <button
                            class="w-full bg-[#ff5f11] text-white p-3 text-lg rounded-lg cursor-pointer"
                        >
                            예약 확인
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="fixed bottom-0 left-0 w-full z-[999] block md:hidden">
    <div class="flex">
        {#if siteData.ld_phone_num && siteData["ld_mobile_bt_phone_img"]}
            <a href="TEL:{siteData.ld_phone_num}" on:click={addCallCount}>
                {#if siteData.ld_mobile_bt_phone_img}
                    <div>
                        <img
                            src={siteData["ld_mobile_bt_phone_img"].includes(
                                "http",
                            )
                                ? siteData["ld_mobile_bt_phone_img"]
                                : `${back_api_origin}${siteData["ld_mobile_bt_phone_img"]}`}
                            alt=""
                        />
                    </div>
                {:else}
                    <div>
                        <img src="/bottom-fix/left-phone.jpg" alt="" />
                    </div>
                {/if}
            </a>
        {:else}
            <a href="TEL:1644-9714" on:click={addCallCount}>
                {#if siteData.ld_mobile_bt_phone_img}
                    <div>
                        <img
                            src={siteData["ld_mobile_bt_phone_img"].includes(
                                "http",
                            )
                                ? siteData["ld_mobile_bt_phone_img"]
                                : `${back_api_origin}${siteData["ld_mobile_bt_phone_img"]}`}
                            alt=""
                        />
                    </div>
                {:else}
                    <div>
                        <img src="/bottom-fix/left-phone.jpg" alt="" />
                    </div>
                {/if}
            </a>
        {/if}

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="cursor-pointer"
            on:click={() => {
                if (browser) {
                    const y =
                        eventEle.getBoundingClientRect().top +
                        window.pageYOffset -
                        135;

                    console.log(y);

                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            }}
        >
            {#if siteData.ld_mobile_bt_event_img}
                <img
                    src={siteData["ld_mobile_bt_event_img"].includes("http")
                        ? siteData["ld_mobile_bt_event_img"]
                        : `${back_api_origin}${siteData["ld_mobile_bt_event_img"]}`}
                    alt=""
                />
            {:else}
                <img src="/bottom-fix/right-form.jpg" alt="" />
            {/if}
        </div>
    </div>
</div>

<div
    class="max-w-[860px] mx-auto md:flex md:justify-center md:items-stretch pb-5 pt-3 mt-3 border-t px-3 pretendard"
>
    {#if siteData.ld_footer}
        {siteData.ld_footer}
    {/if}
</div>

<dialog class="modal" bind:this={personalInfo}>
    <div class="modal-box pretendard">
        <h3 class="text-lg font-bold">개인 정보 보호 동의 전문</h3>
        <div>
            <p class="py-4">- 개인정보수집주체 : 애드피크</p>
            <p>- 수집 목적 및 항목</p>
            <p>&nbsp;1) 수집목적 : 홍보 및 분양정보 안내</p>
            <p>&nbsp;2) 수집항목 : 이름, 연락처, 거주지</p>
            <p>&nbsp;3) 수집기간 : 1년 또는 분양 완료 시까지</p>
            <br />
            <p>정보 제공을 위한 목적이 소멸되면 자료를 파기합니다.</p>
            <br />
            <p>
                개인정보의 수집 및 이용에 대한 동의를 거부할 수 있으며, 이 경우
                신청에 제한이 될 수 있음을 알려드립니다.
            </p>
            <br />
            <p>동의하시려면 체크박스에 체크해주세요</p>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button
                    class="btn"
                    on:click={() => {
                        inviteChk = true;
                    }}
                >
                    확인 및 닫기
                </button>
            </form>
        </div>
    </div>
</dialog>

<button
    on:click={() => {
        console.log(siteData);
    }}>....</button
>

<style>
    @media (prefers-color-scheme: dark) {
        .dark .menu-list {
            color: white !important;
        }
    }

    @font-face {
        font-family: "OKDDUNG";
        src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/OKDDUNG.woff2")
            format("woff2");
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: "KBO-Dia-Gothic_bold";
        src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/KBO-Dia-Gothic_bold.woff")
            format("woff");
        font-weight: 700;
        font-style: normal;
    }

    :global(.kbo-font) {
        font-family: "KBO-Dia-Gothic_bold";
    }

    :global(.title-font) {
        font-family: "OKDDUNG";
    }

    :global(.suit-font) {
        font-family: "SUIT";
    }

    :global(.max_screen) {
        max-width: 868px;
    }

    :global(.max_screen_inner) {
        max-width: 616px;
    }

    :global(.main_img h1) {
        text-align: center;
        font-size: 40px;
        font-weight: bolder;
        position: relative;
    }

    .menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }

    .menu.hidden {
        transform: translateY(-100%);
    }

    .menu.visible {
        transform: translateY(0);
    }
</style>
