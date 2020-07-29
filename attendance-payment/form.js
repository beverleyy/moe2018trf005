/* You might not need jQuery, part 2...*/
// Realized we need the .on() and add/remove class functions
[].slice
	.call(document.querySelectorAll('input[type="text"]'))
	.forEach(function (inputEl) {
		// in case the input is already filled..
		if (inputEl.value.trim() !== "") {
			inputEl.parentNode.classList.add("input-filled");
		}

		// events:
		inputEl.addEventListener("focus", onInputFocus);
		inputEl.addEventListener("blur", onInputBlur);
		inputEl.addEventListener("focusin", onInputFocus);
		inputEl.addEventListener("focusout", onInputBlur);
	});

function onInputFocus(ev) {
	ev.target.parentNode.classList.add("input-filled");
}

function onInputBlur(ev) {
	if (ev.target.value.trim() === "") {
		ev.target.parentNode.classList.remove("input-filled");
	}
}