var globalAcc = {savingsAccount:{type:"savings",balance:200},checkingAccount:{type:"checking",balance:100}};

var refreshBalanceDisplay = function(){
    var accountKeys = Object.keys(globalAcc);
     for(var acc in globalAcc) {
      var accName = globalAcc[acc].type;
      var container = "#" + accName + "BalanceAmountContainer";
      var displayContainer = document.querySelector(container);
      var displayHeader = document.querySelector("."+accName);
      var heading = displayHeader.getElementsByClassName("atmWindowHeader")
      var headingIcon = displayHeader.querySelector('img');
      var headingText = displayHeader.querySelector('.atmWindowText');
      displayContainer.innerHTML = (globalAcc[acc].balance).toFixed(2);
  
      if(globalAcc[acc].balance>0){
      headingText.innerText="$$$$$ You got money in da Bank! $$$$$";
      headingIcon.src = "images/exe.gif";
      positiveBalanceDisplay(accName);
      }else{
      headingText.innerText="____ You got nothing in da Bank! ____";
      headingIcon.src = "images/54.ico";
      noBalanceDisplay(accName);
      }
     }
    clearInputArea();
};

//Attach event listener to withdraw buttons.
var withdrawButton = document.querySelectorAll('.Withdraw-btn');

for(var count = 0; count < withdrawButton.length ; count++){
  withdrawButton[count].addEventListener('click',function(event){
    var transactionAccount = event.target.getAttribute('data-type-account');
    var temp = document.getElementsByClassName(transactionAccount);
    var inputAmount = Number(temp[0].getElementsByTagName('input')[0].value);
    withdrawCash(transactionAccount,inputAmount);
    refreshBalanceDisplay();
  })
}

//Attach event listener to deposit buttons.
var depositButton = document.querySelectorAll('.Deposit-btn');

for(var count = 0; count < depositButton.length ; count++){
  depositButton[count].addEventListener('click',function(event){
  var transactionAccount = event.target.getAttribute('data-type-account');
  var temp = document.getElementsByClassName(transactionAccount);
  var inputAmount = Number(temp[0]. getElementsByTagName('input')[0].value);
  depositCash(transactionAccount,inputAmount);
  refreshBalanceDisplay();
  });
}

var depositCash = function(account,amount){
  var accountTypeName = account+"Account";
  globalAcc[accountTypeName].balance += amount;
};

var withdrawCash = function(account,amount){
  var accountTypeName = account+"Account";

  if(globalAcc[accountTypeName].balance >= amount){
    globalAcc[accountTypeName].balance -= amount;
  }else{

    if(overDraftStatus(amount)){
      overDraftTransact(account,amount);
      console.log("Overdraft Transaction");
    }else{
      console.log("Insufficient Funds");
    }
  }
};

var overDraftStatus = function(withdrawAmount){
  if((globalAcc.savingsAccount.balance + globalAcc.checkingAccount.balance) >= withdrawAmount){
    return true;
  } else{
    return false;
  }
};

var overDraftTransact = function(accountType,amountWithdraw){
  var accountTypeName = accountType +"Account";
  //retrieve the back up account 
  var getFallBackAcc = function(key){
    return key !== accountTypeName;
  };
  var accountKeys = Object.keys(globalAcc);
  var fallBackAccName = accountKeys.filter(getFallBackAcc);
  var overDraftAmount = (amountWithdraw - globalAcc[accountTypeName].balance);
  globalAcc[fallBackAccName].balance -= overDraftAmount;
  globalAcc[accountTypeName].balance = 0;
};

var clearInputArea = function(){
  var inputArea = document.querySelectorAll(".inputAmount");
  for(var counter = 0 ; counter < inputArea.length ; counter++){
    inputArea[counter].value = "";
  }
};

var noBalanceDisplay = function(windowName){
  var accountPane = document.querySelector('.'+windowName);
  accountPane.classList.add("noBalanceAccount");
}

var positiveBalanceDisplay = function(windowName){
  var accountPane = document.querySelector('.'+windowName);
  accountPane.classList.remove("noBalanceAccount");
}

refreshBalanceDisplay();