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
    input.addEventListener("keyup", checkInputValue);

    //show button when valid
    function showWhenValid() {
      if (document.querySelector("form").checkValidity()) {
        document.querySelector(".pay").style.opacity = 1;
      } else {
        document.querySelector(".pay").style.opacity = 0.2;
      }

      input.addEventListener("blur", () => {
        console.log(input.validity);
        //add valid symbol when valid
        if (input.checkValidity()) {
          console.log(`valid_symbol_${input.id}`);
          document.querySelector(`.invalid_symbol_${input.id}`).classList.remove("drawn");
          document.querySelector(`.valid_symbol_${input.id}`).classList.add("drawn");

          //remove valid symbol when valid
        } else if (!input.checkValidity()) {
          document.querySelector(`.valid_symbol_${input.id}`).classList.remove("drawn");
        }

        if (input.validity.valueMissing) {
          document.querySelector(`.invalid_symbol_${input.id}`).classList.remove("drawn");
        } else if (!input.validity.valueMissing && !input.checkValidity()) {
          document.querySelector(`.invalid_symbol_${input.id}`).classList.add("drawn");
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
    //value missing -> add styling
    if (inputValue.validity.valueMissing) {
      inputValue.nextElementSibling.style.display = "block";
      inputValue.style.boxShadow = "0 0 0 1px #f85229";
      document.querySelector(`.invalid_symbol_${inputValue.id}`).classList.add("drawn");

      inputValue.addEventListener("keyup", checkInput);
      //value not missing -> remove styling
      function checkInput() {
        if (!inputValue.validity.valueMissing) {
          inputValue.nextElementSibling.style.display = null;
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

function checkInputValue() {
  //move focus if valid
  const inputValue = this.value.length;
  const maxLength = parseInt(this.getAttribute("maxlength"));

  if (inputValue === maxLength && this.checkValidity()) {
    switchToNextInput(this);
  }
}

function switchToNextInput(currentInput) {
  if (currentInput.name === "Cardnumber") {
    console.log(currentInput.parentElement.nextElementSibling);
    document.querySelector("#expiry_date").focus();
  } else if (currentInput.name === "Expiry Date") {
    document.querySelector("#cvv").focus();
  } else if (currentInput.name === "CVV") {
    currentInput.blur();
  }
}
