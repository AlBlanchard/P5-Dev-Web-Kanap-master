const urlQuery = window.location.search;
const urlParamSplit = new URLSearchParams(urlQuery);
const orderId = urlParamSplit.get("orderId");
const orderIdElement = document.getElementById("orderId");

orderIdElement.innerHTML = orderId;