<script>
	import "$src/app.pcss";
	import { page } from "$app/stores";
	import SeoMeta from "$lib/components/SeoMeta.svelte";
	import { onMount } from "svelte";
	import ModalCustom from "$lib/components/ModalCustom.svelte";
	import { customerSubmit } from "$lib/lib";
	import Cookies from "js-cookie";
	import axios from "axios";
	import { back_api } from "$src/lib/const";
	import { goto } from "$app/navigation";

	let seoValue = {};
	let siteData = {};
	let menuList = [];
	let bannerList = [];
	let customerName = "";
	let customerPhone = "";
	let showPopup = false;
	let formModalopen = false;
	let eventEle;

	let rightFixPhone = [];

	export let data;
	$: data, setData();
	function setData() {
		const popupShow = Cookies.get("popup_close");
		if (popupShow == "ok") {
			showPopup = false;
		} else {
			showPopup = true;
		}
		seoValue = data.seoValue;
		siteData = data.subView;
		menuList = JSON.parse(siteData.ld_menu);
		if (siteData.ld_banner_img) {
			bannerList = siteData.ld_banner_img.split(",");
		}

		if (siteData.ld_phone_num) {
			rightFixPhone = siteData.ld_phone_num.split("-");
		}
	}

	function closePopup() {
		Cookies.set("popup_close", "ok", { expires: 1 });
		showPopup = false;
	}

	onMount(async () => {
		const getVisitedCookie = Cookies.get("topby_visited");
		console.log(getVisitedCookie);
		const referrer = document.referrer;
		console.log(referrer);
		if (!getVisitedCookie) {
			console.log("쿠키 없어???");

			const res = await axios.post(`${back_api}/update_visit_count`, {
				ld_id: siteData["ld_id"],
				ld_domain: siteData["ld_domain"],
				ld_visit_count: siteData["ld_visit_count"],
				referrer,
			});

			Cookies.set("topby_visited", "ok", { expires: 1 });
		}
		AOS.init();
	});

	function addCallCount() {
		console.log(siteData["ld_call_clickcount"]);
		if (!siteData["ld_call_clickcount"]) {
			siteData["ld_call_clickcount"] = 0;
		}
		console.log(siteData["ld_call_clickcount"]);

		try {
			const res = axios.post(`${back_api}/add_call_count`, {
				ld_id: siteData["ld_id"],
				callCount: siteData["ld_call_clickcount"],
			});
		} catch (error) {}
	}

	function addSmsCount() {
		console.log(siteData["ld_sms_clickcount"]);
		if (!siteData["ld_sms_clickcount"]) {
			siteData["ld_sms_clickcount"] = 0;
		}
		console.log(siteData["ld_sms_clickcount"]);

		try {
			const res = axios.post(`${back_api}/add_sms_count`, {
				ld_id: siteData["ld_id"],
				smsCount: siteData["ld_sms_clickcount"],
			});
		} catch (error) {}
	}

	let lastScrollY = 0;
	let isMenuVisible = true;
	const handleScroll = () => {
		const currentScrollY = window.scrollY;
		isMenuVisible = currentScrollY < lastScrollY; // 위로 스크롤이면 보임
		lastScrollY = currentScrollY;
	};

	let y = 0;

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

		console.log(y);
	}
</script>

<svelte:window bind:scrollY={y} />

<dialog id="chk_modal" class="modal suit-font">
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

<div class="menu {isMenuVisible ? 'visible' : 'hidden'} z-[999]">
	<div
		class="max-w-[896px] w-full mx-auto p-3 suit-font"
		data-sveltekit-preload-data="tap"
	>
		<div class="text-center flex justify-between items-center mb-3 gap-8">
			{#if siteData.ld_logo}
				<a href="/">
					<img
						src={siteData.ld_logo}
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
						src={siteData.ld_ph_img}
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
						<li>{menu.pgName}</li>
					</a>
				{/if}
			{/each}
		</ul>
	</div>
</div>

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
		<img src={siteData.ld_popup_img} alt="" />
	</div>
{/if}

<!-- <ModalCustom bind:open={formModalopen}>
	<div class="suit-font">
		<div class="text-center font-bold text-xl mb-5">
			{siteData.ld_name} 관심고객 등록
		</div>
		<div class="bg-gray-300 rounded-lg p-3">
			<div class="mb-3">
				<input
					type="text"
					class="w-full rounded-md p-2.5 focus:outline-none focus:border-gray-500"
					placeholder="이름을 입력하세요 (필수)"
				/>
			</div>

			<div class="mb-3">
				<input
					type="text"
					class="w-full rounded-md p-2.5 focus:outline-none"
					placeholder="전화번호를 입력하세요 (필수)"
				/>
			</div>

			<div
				class="bg-white p-3 h-32 overflow-auto rounded-md text-sm mb-3"
			>
				<p>개인정보 수집동의</p>
				<p>
					​1. 수집하는 개인정보 내용 상담, 문의신청 등을 위해 아래와
					같은 개인정보를 수집하고 있습니다.
				</p>
				<p>- 수집항목 : 이름, 연락처</p>
				<p>
					- 수집방법 : http://adpeak.kr을 통한 수집 (온라인 상담 예약)
				</p>
				<p><br /></p>
				<p>
					2. 개인정보의 수집 및 이용방법 수집한 개인정보를 다음의
					목적을 위해 활용합니다.
				</p>
				<p>- 모델하우스 예약 및 온라인 상담</p>
				<p><br /></p>
				<p>
					3. 개인정보의 보유 및 이용기간 개인정보 수집 및 이용목적이
					달성된 후에는 해당 정보를 지체 없이 파기합니다.
				</p>
			</div>
			<div>
				<button
					class=" bg-blue-500 active:bg-blue-600 w-full rounded-md p-3 text-white"
					>신청 완료 하기</button
				>
			</div>
		</div>
	</div>
</ModalCustom> -->

<!-- <div class="fixed bottom-52 right-1 md:right-6 z-[999]">
	<ul>
		{#if siteData.ld_phone_num}
			<li
				class="rounded-full border md:border-2 p-3 md:p-4 bg-white mb-3"
			>
				<a href="TEL:{siteData.ld_phone_num}" on:click={addCallCount}>
					<img src="/call_icon.png" alt="" class="w-10 md:w-14" />
				</a>
			</li>
		{/if}
		{#if siteData.ld_sms_num}
			<li
				class="rounded-full border md:border-2 p-3 md:p-4 bg-white mb-3"
			>
				<a
					href="SMS:{siteData.ld_sms_num}?body={siteData.ld_name} 문의드립니다. 분양가 / 모델하우스위치가 어떻게 되나요?"
					on:click={addSmsCount}
				>
					<img src="/sms_icon.png" alt="" class="w-10 md:w-14" />
				</a>
			</li>
		{/if}
		<li class="rounded-full border md:border-2 p-3 md:p-4 bg-white">
			<button
				on:click={() => {
					formModalopen = true;
				}}
			>
				<img src="/form_icon.png" alt="" class="w-10 md:w-14" />
			</button>
		</li>
	</ul>
</div> -->

<!-- <div
	class="fixed left-0 top-0 w-full suit-font border-b border-gray-400 bg-white z-50 transition_menu"
	class:visible={fixedMenuHiddenBool}
	class:hidden={!fixedMenuHiddenBool}
>
	<div class="max-w-[896px] mx-auto p-3">
		<div class="text-center flex justify-between items-center mb-3">
			{#if siteData.ld_logo}
				<a href="/">
					<img
						src={siteData.ld_logo}
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
						src={siteData.ld_ph_img}
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
						<li>{menu.pgName}</li>
					</a>
				{/if}
			{/each}
		</ul>
	</div>
</div> -->

<div class="fixed bottom-0 left-0 w-full z-[999] block md:hidden">
	<div class="flex">
		{#if siteData.ld_phone_num}
			<a href="TEL:{siteData.ld_phone_num}" on:click={addCallCount}>
				{#if siteData.ld_mobile_bt_phone_img}
					<div>
						<img src={siteData.ld_mobile_bt_phone_img} alt="" />
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
						<img src={siteData.ld_mobile_bt_phone_img} alt="" />
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
				console.log(eventEle);
				eventEle.scrollIntoView({ behavior: "smooth" });
			}}
		>
			{#if siteData.ld_mobile_bt_event_img}
				<img src={siteData.ld_mobile_bt_event_img} alt="" />
			{:else}
				<img src="/bottom-fix/right-form.jpg" alt="" />
			{/if}
		</div>
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
			console.log(eventEle);
			eventEle.scrollIntoView({ behavior: "smooth" });
		}}
	>
		<img src="/right-fix/fix-3.jpg" alt="" />
	</div>
</div>

<div class="mt-40 md:mt-48 max-w-[960px] mx-auto">
	<slot />
</div>

<div
	class="max-w-[960px] mx-auto md:flex md:justify-center md:items-stretch"
	bind:this={eventEle}
>
	{#if siteData.ld_event_img}
		<div class="md:w-1/2">
			{#if siteData.ld_sms_content}
				<a
					href="SMS:{siteData.ld_sms_num}?body={siteData.ld_name} {siteData.ld_sms_content}"
					on:click={addSmsCount}
				>
					<img src={siteData.ld_event_img} alt="" />
				</a>
			{:else}
				<a
					href="SMS:{siteData.ld_sms_num}?body={siteData.ld_name} 이벤트 참여!"
					on:click={addSmsCount}
				>
					<img src={siteData.ld_event_img} alt="" />
				</a>
			{/if}
		</div>
	{/if}

	<div class="md:w-1/2 md:px-5 suit-font flex items-stretch">
		<div class="w-full p-5 bg-[#f7f4ec] flex flex-col justify-center gap-8">
			<div>
				<div class="text-3xl font-bold mb-2 text-center">
					초대장 발급 확인
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
					<div class="flex items-center gap-3 mb-2">
						<div>
							<img
								src="/megaphone.png"
								alt=""
								width="20"
								height="20"
							/>
						</div>
						<div>
							모델하우스는 초대장이 있으신분만 방문 가능합니다.
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div>
							<img
								src="/megaphone.png"
								alt=""
								width="20"
								height="20"
							/>
						</div>
						<div class="text-red-500">
							미 예약시 관람을 제한하는 점 양해 부탁드립니다.
						</div>
					</div>
				</div>

				<div>
					<button
						class="w-full bg-[#ff5f11] text-white p-3 text-lg rounded-lg"
						on:click={() => {
							customerSubmit(
								customerName,
								customerPhone,
								siteData.ld_site,
							);
						}}
					>
						예약 확인
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- {#if (siteData.ld_site && siteData.ld_db_location == "down") || siteData.ld_db_location == "both"}
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

<hr class="mt-6" />
<div class="container mx-auto max-w-4xl mb-10 p-4 suit-font">
	<div class="text-sm">
		<span class="inline-block mr-3">{siteData.ld_name}</span>
	</div>

	{#if siteData.ld_footer}
		<div class="text-sm py-3">
			<span class="inline-block mr-3">
				{siteData.ld_footer}
			</span>
		</div>
	{/if}
	<div class="text-sm mt-1">
		copyright@ {$page.url.origin}
	</div>
</div>

<style>
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
