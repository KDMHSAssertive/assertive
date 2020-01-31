$(document).ready(() => {
  
})

let selectArray = [];


function selectFromCart(barcode) {
//  alert(barcode);
  if (selectArray.indexOf(barcode) != -1) {
    selectArray = selectArray.filter((obj) => {
      return obj != barcode
    });
  } else {
    selectArray.push(barcode);
  }
//  alert(selectArray.toString());
}


function payItem(prodarr) {
  let payobj = [];
  if (prodarr == undefined || prodarr == null || prodarr == []) {
    payobj = selectArray;
  } else {
    payobj = prodarr;
  }
  
  if (payobj.length == 0) {
    alert("장바구니에 상품이 없거나 선택된 상품이 없어 주문을 할 수 없습니다");
    return false;
  } else {
    
  }
}