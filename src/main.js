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

        this.flagLogo = document.querySelector(".cc-logo span:nth-child(2) img");
    }
  
    setCardType(type){
        this.creditCardfills.path01.setAttribute("fill", this.colors[type][0]);
        this.creditCardfills.path02.setAttribute("fill", this.colors[type][1]);
        this.flagLogo.setAttribute("src", `cc-${type}.svg`);
    }
}

class MaskCreditCard{
    constructor(){
        this.securityCodeElement = document.querySelector("#security-code");
        this.expirationDateElement = document.querySelector("#expiration-date");
        this.securityCodeMasked;
        this.expirationDateMasked;        
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


}

const creditCard = new CreditCard();
creditCard.setCardType("mastercard");

const maskCreditCard = new MaskCreditCard();
maskCreditCard.setSecurityCodeMask("0000");
maskCreditCard.setExpirationDateMask("MM{/}YY");