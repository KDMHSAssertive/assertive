$(document).ready(() => {
  
})

let selectArray = [];


function selectFromCart(barcode, num) {
  // alert(barcode);
  console.log($("clicker-" + barcode));
  if (selectArray.indexOf(barcode) != -1) {
    selectArray = selectArray.filter((obj) => {
      return obj != barcode
    });
    $(".clicker-" + barcode).removeClass("check");
    setTimeout(() => {
      $(".clicker-" + barcode).css("background-color", "unset");
      $(".clicker-" + barcode + " .checkInn").css("transform", "unset");
    }, 200);
  } else {
    for (var i = 0; i < num; i++) {
      selectArray.push(barcode);
    }
    $(".clicker-" + barcode).css("background-color", "#16cede");
    $(".clicker-" + barcode + " .checkInn").css("transform", "scale(0)");
    setTimeout(() => {
      $(".clicker-" + barcode).addClass("check");
    }, 200);
  }
  // setTimeout(() => {
  //   $(".clicker-" + barcode).toggleClass("check");
  // }, 200);
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
    location.href="/payment/direct?prodlist=" + payobj;
  }
}


function payAll() {
  location.href="/payment/cart";
}

function NumChange(barcode) {
  // alert("srdgf");
  document.getElementsByClassName("listNumAlt-" + barcode)[0].setAttribute("placeholder", $(".listNum-" + barcode).text().replace("개", ""));
  $(".listNum-" + barcode).text("__개");
  $(".listNumAlt-" + barcode).css("display", "unset");
  checkDiff(barcode);
  setTimeout(() => {
    $(".button-change-" + barcode).css("display", "unset");
  }, 200);
}

function checkDiff(barcode) {

  let oldval = $($(".listNum-" + barcode)).val();
  $(".listNum-" + barcode).on("propertychange change keyup paste input", () => {
    var curval = $(this).val();
    if (curval == oldval) {
      return;
    } else {
      // update product number
    }

  })
}
