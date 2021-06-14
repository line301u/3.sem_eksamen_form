import "../../sass/index.scss";
import IMask from "imask";

("use strict");

window.addEventListener("DOMContentLoaded", init);

function init() {
  setCardNumberMask();
  setExpiryDateMask();
  document.querySelector(".pay").addEventListener("click", checkTextValidity);

  checkFormValidity();
  showPaymentAmount();
  removeDefaultValidation();

  //prevent transtion on load
  setTimeout(() => {
    document.querySelector("body").classList.remove("preload");
  }, 1000);
}

function removeDefaultValidation() {
  //remove default validation
  document.querySelector("form").setAttribute("novalidate", true);
}

function showPaymentAmount() {
  let paymentAmount = localStorage.getItem("paymentAmount");

  document.querySelector(".payment_amount").textContent = `${paymentAmount},-`;
}

function checkFormValidity() {
  document.querySelectorAll("form input").forEach((input) => {
    input.addEventListener("keyup", showWhenValid);

    //show button when valid
    function showWhenValid() {
      if (document.querySelector("form").checkValidity()) {
        document.querySelector(".pay").style.opacity = 1;
      } else {
        document.querySelector(".pay").style.opacity = 0.2;
      }

      input.addEventListener("blur", () => {
        //add valid symbol when valid
        if (input.checkValidity()) {
          this.nextElementSibling.classList.add("drawn");
          console.log(this.nextElementSibling);
          //remoce valid symbol when valid
        } else {
          this.nextElementSibling.classList.remove("drawn");
        }
      });
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
    addInvaldidStyling();
    console.log("form is not valid");
  }
}

function addInvaldidStyling() {
  document.querySelectorAll("input").forEach((inputValue) => {
    console.log(inputValue);
    //value missing -> add styling
    if (inputValue.validity.valueMissing) {
      inputValue.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "block";
      inputValue.style.boxShadow = "0 0 0 1px tomato";

      inputValue.addEventListener("keyup", checkInput);
      //value not missing -> remove styling
      function checkInput() {
        if (!inputValue.validity.valueMissing) {
          inputValue.nextElementSibling.nextElementSibling.nextElementSibling.style.display = null;
          inputValue.style.boxShadow = null;
        }
      }
    }
  });
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
