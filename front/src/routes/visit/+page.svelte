<script>
    import moment from "moment-timezone";
    let visitList = [];
    export let data;

    let startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let endDate = moment().format('YYYY-MM-DD');

    $: data, setData();

    function setData() {
        visitList = data.visit_list;
        console.log(visitList);
    }
</script>

<div class="container max-w-[1200px] py-5 px-3 mx-auto pretendard">
    <div class="mb-3">
        <input type="date" class="border p-2 text-sm" bind:value={startDate} />
        <span>~</span>
        <input type="date" class="border p-2 text-sm" bind:value={endDate} />
        <button class="py-1 text-white rounded-md bg-blue-500 active:bg-blue-600" style="width:60px;">검색</button>
    </div>

    <div class="">
        <table class="w-full">
            <tr>
                <th class="border p-1.5">IP</th>
                <th class="border p-1.5">이전주소</th>
                <th class="border p-1.5">UserAgent</th>
                <th class="border p-1.5">날짜</th>
            </tr>
            {#each visitList as visit}
                <tr>
                    <td class="border py-2 p-1.5 text-center text-xs">
                        {visit.sv_ip}
                    </td>
                    <td class="border py-2 p-1.5 text-center text-xs">
                        {visit.sv_referrer}
                    </td>
                    <td
                        class="border py-2 p-1.5 text-center text-xs"
                        style="width:400px"
                    >
                        <div style="width:350px;" class="mx-auto">
                            {visit.sv_ua}
                        </div>
                    </td>
                    <td class="border py-2 p-1.5 text-center text-xs">
                        {moment(visit.sv_created_at).format(
                            "YYYY-MM-DD HH:mm:ss",
                        )}
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</div>
