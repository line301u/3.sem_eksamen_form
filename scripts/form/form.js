import "../../sass/index.scss";
import IMask from "imask";

("use strict");

window.addEventListener("DOMContentLoaded", init);

function init() {
  setCardNumberMask();
  setExpiryDateMask();
  document.querySelector(".pay").addEventListener("click", checkTextValidity);

  showButtonWhenValid();
  showPaymentAmount();
  removeDefaultValidation();
  setValidityRules();
}

function removeDefaultValidation() {
  document.querySelector("form").setAttribute("novalidate", true);
}

function setValidityRules() {
  const cardholder = document.querySelector("#cardholder_name");
  const cardnumber = document.querySelector("#cardnumber");
  const expiry_date = document.querySelector("#expiry_date");
  const cvv = document.querySelector("#cvv");

  cardnumber.onblur = function () {
    if (cardnumber.validity.tooShort) {
      console.log("is too short");
    }
  };

  console.log(cardholder);
  console.log(cardnumber);
}

function showPaymentAmount() {
  let paymentAmount = localStorage.getItem("paymentAmount");

  document.querySelector(".payment_amount").textContent = `${paymentAmount},-`;
}

function showButtonWhenValid() {
  document.querySelectorAll("form input").forEach((input) => {
    input.addEventListener("keyup", checkFormValidity);

    function checkFormValidity() {
      if (document.querySelector("form").checkValidity()) {
        document.querySelector(".pay").style.opacity = 1;
      }
    }
  });
}

async function checkTextValidity() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  if (form.checkValidity()) {
    console.log("form is valid");
    const orderid = await postOrder();

    window.location.href = `process.html?id=${orderid}`;
  } else {
    console.log("form is not valid");
  }
}

async function postOrder() {
  let order = localStorage.getItem("itemsArray");
  console.log(order);

  let jsonData = await fetch("https://hold-kaeft-vi-har-det-godt.herokuapp.com/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: order,
  });
  const data = await jsonData.json();
  return data.id;
}

function setCardNumberMask() {
  const cardnumber = document.querySelector("#cardnumber");
  const cardnumberOption = {
    mask: "0000 0000 0000 0000",
  };
  const cardnumberMask = IMask(cardnumber, cardnumberOption);
}

function setExpiryDateMask() {
  const expiry_date = document.querySelector("#expiry_date");
  const expiryDateOption = {
    mask: "00/00",
  };
  const expiry_dateMask = IMask(expiry_date, expiryDateOption);
}
