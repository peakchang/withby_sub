<script>
	import { aosStyleList } from "$lib/const.js";
	import { customerSubmit } from "$lib/lib";

	let allSiteData = {};
	let imgList = [];
	let dataAosList = [];
	let customerName = "";
	let customerPhone = "";

	export let data;
	$: data, setData();
	function setData() {
		allSiteData = data.subView;
		if (allSiteData[`ld_pg${data.index}`]) {
			imgList = allSiteData[`ld_pg${data.index}`].split(",");
		} else {
			imgList = [];
		}
	}
</script>

<!-- {#if (allSiteData.ld_site && allSiteData.ld_db_location == "up") || allSiteData.ld_db_location == "both"}
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
							allSiteData.ld_site,
						);
					}}
				>
					접수하기
				</button>
			</div>
		</div>
	</div>
{/if} -->
{#each imgList as img, idx}
	{#if idx == 0}
		<div class="mb-5">
			<img src={img} alt="" class="w-full" />
		</div>
	{:else}
		<div class="mb-5" data-aos={dataAosList[idx]}>
			<img src={img} alt="" class="w-full" />
		</div>
	{/if}
{/each}
