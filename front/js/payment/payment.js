
function card_pay(){
    document.getElementsByClassName('card_pay')[0].style.display='block';
    document.getElementsByClassName('cash_pay')[0].style.display='none';
  }
  function cash_pay(){
    document.getElementsByClassName('card_pay')[0].style.display='none';
    document.getElementsByClassName('cash_pay')[0].style.display='block';
  }
  
  function no_bill(){
    document.getElementsByClassName('bill_use')[0].style.display='none';
    document.getElementsByClassName('phone')[0].style.display='none';
    document.getElementsByClassName('cash_ship')[0].style.marginBottom='17px';
  }
  function use_bill(){
    document.getElementsByClassName('bill_use')[0].style.display='flex';
    document.getElementsByClassName('phone')[0].style.display='block';
  }
  
  function ceo_only(){
    document.getElementsByClassName('phone')[0].style.display='none';
    document.getElementsByClassName('ceo_number')[0].style.display='flex';
  }
  function person_only(){
    document.getElementsByClassName('ceo_number')[0].style.display='none';
    document.getElementsByClassName('phone')[0].style.display='block';
  }
  