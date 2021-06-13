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
  // const cardholder = document.querySelector("#cardholder_name");
  // const cardnumber = document.querySelector("#cardnumber");
  // const expiry_date = document.querySelector("#expiry_date");
  // const cvv = document.querySelector("#cvv");
  // cardnumber.onblur = function () {
  //   if (cardnumber.validity.tooShort) {
  //     cardnumber.nextElementSibling.textContent = "too short";
  //   } else {
  //     cardnumber.nextElementSibling.textContent = "Please fill out the correct information";
  //   }
  // };
  // expiry_date.onblur = function () {
  //   console.log(expiry_date.validity);
  //   if (expiry_date.validity.tooShort) {
  //     expiry_date.nextElementSibling.textContent = "too short";
  //   }
  // };
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
    document.querySelectorAll("input").forEach((element) => {
      console.log(element.validity);

      if (element.validity.valueMissing) {
        element.nextElementSibling.style.display = "block";

        element.addEventListener("keyup", checkInput);

        function checkInput() {
          if (!element.validity.valueMissing) {
            element.nextElementSibling.style.display = null;
          }
        }
      }
    });

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
