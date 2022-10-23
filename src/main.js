import "./css/index.css"
import Imask from "imask"

document.querySelector("form", (event)=>{
    event.preventDefaut();
})

class CreditCard{
    constructor(){
        this.colors = {
            visa: ["#436D99", "#2D57F2"],
            mastercard: ["#DF6F29", "#C69347"],
            default: ["black", "gray"]
        };
        this.visaRegex = /^4\d{0,15}/;
        this.mastercardRegex = /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/;
        this.cardSecurityCodeElement = document.querySelector("#security-code");
        this.cardExpirationDateElement = document.querySelector("#expiration-date");
        this.cardNumberElement = document.querySelector("#card-number");
        this.cardHolderElement = document.querySelector("#card-holder");
        this.cardSecurityCodeMasked;
        this.cardExpirationDateMasked;
        this.cardNumberMasked;
    }
  
    setUpLayoutOfCardType(type){
        const creditCardfills = {
            path01: document.querySelector(".cc-bg svg > g g:nth-child(1) path"),
            path02: document.querySelector(".cc-bg svg > g g:nth-child(2) path")
        };
        const flagLogoElement = document.querySelector(".cc-logo span:nth-child(2) img");

        creditCardfills.path01.setAttribute("fill", this.colors[type][0]);
        creditCardfills.path02.setAttribute("fill", this.colors[type][1]);
        flagLogoElement.setAttribute("src", `cc-${type}.svg`);
    }

    setSecurityCodeMask(mask){
        const securityCodePattern = {mask: mask};
        this.cardSecurityCodeMasked = Imask(this.cardSecurityCodeElement, securityCodePattern);
    }

    setExpirationDateMask(mask){
        const currentYear = String(new Date().getFullYear()).slice(2);
        const expirationYear = String(new Date().getFullYear() + 10).slice(2);
        const expirationDatePattern = {
            mask: mask,
            blocks:{
                MM:{
                    mask: Imask.MaskedRange,
                    from: 1,
                    to: 12
                },
                YY:{
                    mask: Imask.MaskedRange,
                    from: currentYear,
                    to: expirationYear
                }
            }            
        }
        this.cardExpirationDateMasked = Imask(this.cardExpirationDateElement, expirationDatePattern);
    }

    setCardNumberMask(defaultMask){
        const cardNumberPattern = {
            mask: [
                {
                    mask: defaultMask,
                    regex: this.visaRegex,
                    cardType: "visa"
                },
                {
                    mask: defaultMask,
                    regex: this.mastercardRegex,
                    cardType: "mastercard"
                },
                {
                    mask: defaultMask,
                    cardType: "default"
                }
            ],
            dispatch: function(appended, dynamicMasked){
                const number = (dynamicMasked.value + appended).replace(/\D/g, "");
                const foundMask = dynamicMasked.compiledMasks.find(item =>{
                    return number.match(item.regex);
                })
                return foundMask;
            }
        }

        this.cardNumberMasked = Imask(this.cardNumberElement, cardNumberPattern);
    }

    registerCard(){        
        const registerButton = document.querySelector("#register-card");

        registerButton.addEventListener("click", ()=>{
            alert("Cartão adicionado");
        })
    }

    updateInformationsInCardView(sourceElement, destionatioElement){
        const defaultValue = destionatioElement.textContent;
        sourceElement.addEventListener("input", ()=>{
            destionatioElement.innerText = sourceElement.value.length === 0 ? defaultValue : sourceElement.value;
        });
    }

    updateMaskedInformationsInCardView(maskedElement, destionatioElement){
        const defaultValue = destionatioElement.textContent;        
        maskedElement.on("accept", ()=>{
            destionatioElement.innerText = maskedElement.value.length === 0 ? defaultValue : maskedElement.value;
            if(maskedElement.masked.currentMask){
                this.setUpLayoutOfCardType(maskedElement.masked.currentMask.cardType);
            }
        });
    }

}

const cardHolderView = document.querySelector(".cc-holder .value");
const cardSecutiryCodeView = document.querySelector(".cc-security .value");
const cardExpirationDateView = document.querySelector(".cc-expiration .value");
const cardNumberView = document.querySelector(".cc-number");

const creditCard = new CreditCard();
creditCard.setSecurityCodeMask("0000");
creditCard.setExpirationDateMask("MM{/}YY");
creditCard.setCardNumberMask("0000 0000 0000 0000");
creditCard.registerCard();
creditCard.updateInformationsInCardView(creditCard.cardHolderElement, cardHolderView);
creditCard.updateMaskedInformationsInCardView(creditCard.cardSecurityCodeMasked, cardSecutiryCodeView);
creditCard.updateMaskedInformationsInCardView(creditCard.cardExpirationDateMasked, cardExpirationDateView);
creditCard.updateMaskedInformationsInCardView(creditCard.cardNumberMasked, cardNumberView);