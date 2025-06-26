<script>
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

    let siteData = {};
    let mainImgList = [];
    let dataAosList = [];
    let bannerImgList = [];
    let bannerSwiper;
    let customerName = "";
	let customerPhone = "";

    export let data;

    onMount(() => {

        // HERO SLIDER
        var menu = [];
        const swiper = new Swiper(bannerSwiper, {
            // configure Swiper to use modules

            modules: [Autoplay, Navigation, Pagination],
            // centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },

            navigation: {
                nextEl: ".right-btn",
                prevEl: ".left-btn",
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });
    });

    $: data, setData();

    function setData() {
        siteData = data.subView;
        mainImgList = siteData.ld_main_img
            ? siteData.ld_main_img.split(",")
            : [];
            
        if (siteData.ld_banner_img) {
            bannerImgList = siteData.ld_banner_img.split(",");
        }
    }
</script>

<svelte:head></svelte:head>
{#if siteData.ld_banner_img}
    <section>
        <div class="swiper mb-10 relative" bind:this={bannerSwiper}>
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper relative">
                {#each bannerImgList as bannerImg}
                    <div class="swiper-slide">
                        <img src="{bannerImg}" alt="" />
                    </div>
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

<!-- {#if siteData.ld_site && siteData.ld_db_location == "up" || siteData.ld_db_location == "both"}
	<div class="p-3">
		<div
			class="shadow-sm border p-4 md:pr-10 rounded-md suit-font block md:flex md:justify-around"
		>
			<div class="mb-3 md:mb-0">
				<p class="text-sm text-red-500">무엇이 궁금하세요?</p>
				<p class="text-2xl font-bold">빠른 상담 요청</p>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					class="p-2 border focus:outline-none focus:border-yellow-600 rounded-sm w-2/5"
					placeholder="이름"
                    bind:value={customerName}
				/>
				<input
					type="text"
					class="p-2 border focus:outline-none focus:border-yellow-600 rounded-sm w-2/5"
					placeholder="연락처"
                    bind:value={customerPhone}
				/>
				<button
					class=" bg-yellow-600 py-2 rounded-lg text-white text-sm md:text-base active:bg-yellow-700 w-1/5"
                    on:click={() => {
						customerSubmit(
							customerName,
							customerPhone,
							siteData.ld_site,
						);
					}}
				>
					접수하기
				</button>
			</div>
		</div>
	</div>
{/if} -->

{#each mainImgList as mainImg, idx}
    <div class="mb-5">
        <img src={mainImg} alt="" class="w-full" />
    </div>
{/each}

<style>
    .right-btn {
        position: absolute;
        transform: translate(50%, -50%);
    }

    .left-btn {
        position: absolute;
        transform: translate(-50%, -50%);
    }
</style>
