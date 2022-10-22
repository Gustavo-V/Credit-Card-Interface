import "./css/index.css"
import Imask from "imask"

class CreditCard{
    constructor(){
        this.colors = {
            visa: ["#436D99", "#2D57F2"],
            mastercard: ["#DF6F29", "#C69347"],
            default: ["black", "gray"]
        };
        this.creditCardfills = {
            path01: document.querySelector(".cc-bg svg > g g:nth-child(1) path"),
            path02: document.querySelector(".cc-bg svg > g g:nth-child(2) path")
        };
        this.flagLogoElement = document.querySelector(".cc-logo span:nth-child(2) img");
        this.visaRegex = /^4\d{0,15}/;
        this.mastercardRegex = /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/;
        this.securityCodeElement = document.querySelector("#security-code");
        this.expirationDateElement = document.querySelector("#expiration-date");
        this.cardNumberElement = document.querySelector("#card-number");
        this.securityCodeMasked;
        this.expirationDateMasked;
        this.cardNumberMasked;
    }
  
    setUpLayout(type){
        this.creditCardfills.path01.setAttribute("fill", this.colors[type][0]);
        this.creditCardfills.path02.setAttribute("fill", this.colors[type][1]);
        this.flagLogoElement.setAttribute("src", `cc-${type}.svg`);
    }

    setSecurityCodeMask(mask){
        const securityCodePattern = {mask: mask};
        this.securityCodeMasked = Imask(this.securityCodeElement, securityCodePattern);
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
        this.expirationDateMasked = Imask(this.expirationDateElement, expirationDatePattern);
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
                    return number.match(item.regex)
                })
                return foundMask;
            }
        }

        this.cardNumberMasked = Imask(this.cardNumberElement, cardNumberPattern);
    }

}

const creditCard = new CreditCard();
creditCard.setUpLayout("mastercard");
creditCard.setSecurityCodeMask("0000");
creditCard.setExpirationDateMask("MM{/}YY");
creditCard.setCardNumberMask("0000 0000 0000 0000");

console.log(creditCard.cardNumberMasked.masked.currentMask.cardType + ", " + creditCard.cardNumberMasked.masked.currentMask._value);

console.log(creditCard.cardNumberMasked);

// Visa: /^4\d{0,15}/
// Mastercard: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/