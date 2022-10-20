import "./css/index.css"

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

const creditCard = new CreditCard();
creditCard.setCardType("mastercard");