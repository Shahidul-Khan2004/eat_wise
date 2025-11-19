document.addEventListener('DOMContentLoaded', init);

function init() {
	const url = getApiUrl();
	loadData(url);
}

function getApiUrl() {
	return document.body.getAttribute('data-api-url') || 'http://127.0.0.1:8000/api/test/';
}

async function loadData(url) {
	const response = await fetch(url);
	const data = await response.json();
	renderData(data);
}

function renderData(data) {
	const pre = document.createElement('pre');
	pre.textContent = JSON.stringify(data, null, 2);
	document.body.appendChild(pre);
}
