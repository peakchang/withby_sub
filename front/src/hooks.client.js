export function reroute({ url }) {
    console.log('this is hook!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(url);
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
}