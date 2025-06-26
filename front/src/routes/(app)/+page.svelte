<script>
    import { browser } from "$app/environment";
    import { back_api_origin } from "$src/lib/const";
    import { page } from "$app/stores";
    import { aosStyleList } from "$lib/const.js";

    import Swiper from "swiper";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";
    // import Swiper and modules styles
    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/pagination";
    import { onMount } from "svelte";
    import { customerSubmit } from "$lib/lib";

    // 공통 변수
    let siteData = {};

    // 구버전 변수
    let mainImgList = [];
    let dataAosList = [];
    let bannerImgList = [];
    let bannerSwiper;
    let customerName = "";
    let customerPhone = "";

    // 신버전 변수
    let observer;
    let elementsToObserve;
    let mainContents = [];
    let x = 0;

    export let data;

    $: data, setData();

    function setData() {
        // 공통
        siteData = data.subView;

        // 구버전 코드
        if (!siteData["ld_view_type"] || siteData["ld_view_type"] == "old") {
            mainImgList = siteData.ld_main_img
                ? siteData.ld_main_img.split(",")
                : [];

            if (siteData.ld_banner_img) {
                bannerImgList = siteData.ld_banner_img.split(",");
            }
        } else {
            // 신버전 코드
            try {
                if (siteData.ld_json_main) {
                    mainContents = JSON.parse(siteData.ld_json_main);
                    console.log("mainContents 리스트 부분!!!!");
                    console.log(mainContents);
                }

                setSectionHeight();
                setYoutubeRatio();

                // 받은 JSON 데이터 처리
            } catch (error) {
                console.log("에러 들어옴?!");
                console.error("JSON 파싱 오류:", error);
            }
        }
    }

    $: x, set_x();
    function set_x() {
        // setContentParentHeight();
        setSectionHeight();
        setYoutubeRatio();
    }

    onMount(() => {
        if (!siteData["ld_view_type"] || siteData["ld_view_type"] == "old") {
        } else {
            if (browser) {
                elementsToObserve =
                    document.querySelectorAll(".observe-fade-up");

                // setContentParentHeight();
                // setContentRatio();
            }
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("observe-hidden");
                        entry.target.classList.add("fade-up-active");
                    } else {
                        entry.target.classList.remove("fade-up-active");
                        entry.target.classList.add("observe-hidden");
                    }
                });
            });

            elementsToObserve.forEach((element) => {
                // 초기 숨김 클래스 추가
                element.classList.add("observe-hidden");
                observer.observe(element);

                // data-delay 속성이 있는 경우 CSS 변수로 전달
                const delay = element.dataset.delay;
                if (delay) {
                    element.style.setProperty("--fade-up-delay", `${delay}ms`);
                }
            });
        }
    });

    function setSectionHeight() {
        if (browser) {
            try {
                const backgroundArea =
                    document.querySelectorAll(".background-area");
                const contentArea = document.querySelectorAll(`.content-area`);
                let ratioNum = -1;
                let heightNum = -1;
                for (let i = 0; i < mainContents.length; i++) {
                    const data = mainContents[i];
                    console.log("메인 컨텐츠 데이터 부분!!!!");

                    console.log(data);

                    if (data.bgType == "ratio") {
                        ratioNum++;

                        console.log(backgroundArea[ratioNum]);

                        const width = data.backgroundWidth;
                        const height = data.backgroundHeight;
                        const aspectRatio = height / width;
                        const elementWidth =
                            backgroundArea[ratioNum].offsetWidth;
                        backgroundArea[ratioNum].style.height =
                            `${elementWidth * aspectRatio}px`;
                    } else if (data.bgType == "height") {
                        heightNum++;
                        const element = contentArea[heightNum];
                        const parent = element.parentElement;
                        const height = element.offsetHeight;

                        try {
                            parent.style.height = `${height + Number(data.paddingTopVal) + Number(data.paddingBottomVal)}px`;
                            parent.style.paddingTop = `${Number(data.paddingTopVal)}px`;
                            parent.style.paddingBottom = `${Number(data.paddingBottomVal)}px`;
                        } catch (error) {
                            console.error(error.message);
                        }
                    }
                }
            } catch (error) {
                console.error(error.message);

                console.log("여기서 에러 나는겨?");
            }
        }
    }

    function setYoutubeRatio() {
        if (browser) {
            const youtubeContents =
                document.querySelectorAll(".youtube-iframe");

            for (let i = 0; i < youtubeContents.length; i++) {
                youtubeContents[i].style.width = "90%";
                const elementWidth = youtubeContents[i].offsetWidth;
                youtubeContents[i].style.height = `${elementWidth / 1.7778}px`;
            }
        }
    }
</script>

<svelte:window bind:innerWidth={x} />

{#if !siteData["ld_view_type"] || siteData["ld_view_type"] == "old"}
    <!-- 구버전 -->
    {#if siteData.ld_banner_img}
        <section>
            <div class="swiper mb-10 relative" bind:this={bannerSwiper}>
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper relative">
                    {#each bannerImgList as bannerImg}
                        {#if bannerImg}
                            <div class="swiper-slide">
                                <img
                                    src={bannerImg.includes("http")
                                        ? bannerImg
                                        : `${back_api_origin}${bannerImg}`}
                                    alt=""
                                />
                            </div>
                        {/if}
                    {/each}
                </div>
                <!-- If we need pagination -->
                <div class="swiper-pagination"></div>

                <div class="left-btn top-1/2 z-20 left-7">
                    <button
                        class="w-7 h-7 md:w-10 md:h-10 text-sm md:text-base bg-white flex justify-center items-center rounded-full text-gray-500"
                    >
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="right-btn top-1/2 z-20 right-7">
                    <button
                        class="w-7 h-7 md:w-10 md:h-10 text-sm md:text-base bg-white flex justify-center items-center rounded-full text-gray-500"
                    >
                        <i class="fa fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="swiper-scrollbar"></div>
            </div>
        </section>
    {/if}

    {#each mainImgList as mainImg, idx}
        {#if mainImg}
            <div class="mb-5">
                <img
                    src={mainImg.includes("http")
                        ? mainImg
                        : `${back_api_origin}${mainImg}`}
                    alt=""
                    class="w-full"
                />
            </div>
        {/if}
    {/each}
{:else}
    <!-- 신버전 -->
    <div class="mb-5">
        {#each mainContents as mainContent}
            {#if mainContent["backgroundImg"]}
                <div
                    class:background-area={mainContent["bgType"] == "ratio"}
                    style="background-image: url({mainContent[
                        'backgroundImg'
                    ].includes('http')
                        ? mainContent['backgroundImg']
                        : `${back_api_origin}${mainContent['backgroundImg']}`});"
                >
                    <!-- height:{mainContent[
                            'height'
                        ]}px; -->
                    <div class:content-area={mainContent["bgType"] == "height"}>
                        {#each mainContent.contentList as content}
                            {#if content.text}
                                <div
                                    class="px-3 pretendard"
                                    class:observe-hidden={content.effect ==
                                        "on"}
                                    class:observe-fade-up={content.effect ==
                                        "on"}
                                    data-delay={content.delay}
                                    style="text-align : {content.align}; color :{content.fontColor};  font-size : {content.fontSize}px; white-space: pre-line;"
                                >
                                    {content.text}
                                </div>
                            {:else if content.imgPath}
                                {#if content.imgPath}
                                    <div
                                        class="flex"
                                        class:justify-center={content.align ==
                                            "center"}
                                        class:justify-start={content.align ==
                                            "left"}
                                        class:justify-end={content.align ==
                                            "right"}
                                        class:observe-hidden={content.effect ==
                                            "on"}
                                        class:observe-fade-up={content.effect ==
                                            "on"}
                                        data-delay={content.delay}
                                    >
                                        <div style="width:{content.width}%;">
                                            <img
                                                src={content.imgPath.includes(
                                                    "http",
                                                )
                                                    ? content.imgPath
                                                    : `${back_api_origin}${content.imgPath}`}
                                                alt=""
                                                class="w-full"
                                            />
                                        </div>
                                    </div>
                                {/if}
                            {:else if content.marginHeight}
                                <div
                                    style="height: {content.marginHeight}px;"
                                ></div>
                            {:else if content.youtubeTag}
                                <div
                                    class="youtube-container mt-3 flex justify-center"
                                >
                                    {@html content.youtubeTag}
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    /* 구버전 CSS */
    .right-btn {
        position: absolute;
        transform: translate(50%, -50%);
    }

    .left-btn {
        position: absolute;
        transform: translate(-50%, -50%);
    }

    /* 신버전 CSS */
    .observe-hidden {
        opacity: 0;
        transform: translateY(40px); /* 초기 위치를 아래로 10px 이동 */
    }
    .observe-fade-up {
        transition:
            opacity 0.8s ease-out,
            /* opacity 애니메이션 속도 조절 (더 짧게) */ transform 0.8s ease-out; /* transform 애니메이션 속도 조절 (더 짧게) */
        transition-delay: var(--fade-up-delay, 0ms);
    }
    .fade-up-active {
        opacity: 1;
        transform: translateY(0);
    }

    .background-area {
        background-repeat: no-repeat;
        background-size: 100% auto;
    }
</style>
