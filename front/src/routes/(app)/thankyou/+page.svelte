<script>
    import { onMount } from "svelte";

    let chk_modal;
    onMount(() => {
        // SSR 단계에서는 window가 없으므로 onMount 내부에서만 사용
        

        chk_modal.showModal();

        // // 1번 페이지에서 준 신호가 있으면 알림 → 복귀
        // if (params.get("return") === "true") {
        //     alert("확인 누르면 이전 페이지로 돌아갑니다");

        //     // ① 직전 히스토리로 복귀 (새로고침 포함)
        //     window.history.back();

        //     /* ② 특정 경로로 확실히 보내고 싶다면
        // 	window.location.href = '/page1';
        // 	*/
        // }
    });

    function goToPrevious() {
        console.log('들어는 와?');
        
        const params = new URLSearchParams(window.location.search);
        // 1번 페이지에서 준 신호가 있으면 알림 → 복귀
        if (params.get("return") === "true") {
            // ① 직전 히스토리로 복귀 (새로고침 포함)
            window.history.back();

            /* ② 특정 경로로 확실히 보내고 싶다면
        	window.location.href = '/page1';
        	*/
        }
    }
</script>

<dialog id="chk_modal" class="modal suit-font" bind:this={chk_modal}>
    <div class="modal-box">
        <h3 class="text-lg font-bold">초대장 발급이 확인 되었습니다.</h3>
        <h3 class="text-lg font-bold">배정된 담당자가 연락 드릴 예정입니다.</h3>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn" on:click={goToPrevious}>닫기</button>
            </form>
        </div>
    </div>
</dialog>
