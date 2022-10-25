const url = window.location.search;
const urlQuery = new URLSearchParams(url);
const orderId = urlQuery.get("orderId");
const orderIdElement = document.getElementById("orderId");

orderIdElement.innerHTML = orderId;