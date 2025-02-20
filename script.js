let price = 19.5;
let cid = [
    ["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], 
    ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
];

const cash = document.getElementById("cash");
const change = document.getElementById("change-due");
const sale = document.getElementById("purchase-btn");

let currencyunits = [
    ['PENNY', 0.01], ['NICKEL', 0.05], ['DIME', 0.1], ['QUARTER', 0.25],
    ['ONE', 1], ['FIVE', 5], ['TEN', 10], ['TWENTY', 20], ['ONE HUNDRED', 100]
];

sale.addEventListener("click", () => {
    const cashValue = parseFloat(cash.value);
    const changeDue = parseFloat((cashValue - price).toFixed(2));

    if (cashValue < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cashValue === price) {
        change.innerText = "No change due - customer paid with exact cash";
        return;
    }

    let changeresult = getChange(changeDue, cid);

    if (changeresult.status === "INSUFFICIENT_FUNDS" || changeresult.status === "CLOSED") {
        change.innerText = `Status: ${changeresult.status} ${formatChange(changeresult.change)}`;
    } else {
        change.innerText = `Status: OPEN ${formatChange(changeresult.change)}`;
    }
});

const getChange = (changeDue, cid) => {
    let totalCid = parseFloat(cid.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2));

    if (totalCid < changeDue) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    if (totalCid === changeDue) {
        
        return { status: "CLOSED", change: cid.filter(([_, amount]) => amount > 0).reverse() };
    }

    const changeArr = [];
    let remainingChange = changeDue;

    for (let i = currencyunits.length - 1; i >= 0; i--) {
        let unit = currencyunits[i][0];
        let unitValue = currencyunits[i][1];
        let unitInDrawer = cid[i][1];

        if (unitValue <= remainingChange && unitInDrawer > 0) {
            let amountFromUnit = 0;

            while (remainingChange >= unitValue && unitInDrawer > 0) {
                remainingChange = parseFloat((remainingChange - unitValue).toFixed(2));
                unitInDrawer -= unitValue;
                amountFromUnit += unitValue;
            }

            if (amountFromUnit > 0) {
                changeArr.push([unit, amountFromUnit]);
            }
        }
    }

    if (remainingChange > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return { status: "OPEN", change: changeArr };
};

const formatChange = (changeArr) => 
    changeArr.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join(", ");
