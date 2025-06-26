<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    onMount(() => {
        const smsHref = `sms:${$page.url.searchParams.get("smsnum")}?body=${$page.url.searchParams.get("body")}`;
        window.location.href = smsHref;

        setTimeout(() => {
            history.back();
        }, 1500); // 2초 후 이전 페이지로 복귀
    });
</script>
