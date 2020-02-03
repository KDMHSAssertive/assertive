var pos = 0;
var totalSlides = $('#slider-wrap ul li').length;
var sliderWidth = $('#slider-wrap').width();

$(document).ready(function(){	
	$('#slider-wrap ul#slider').width(sliderWidth*totalSlides);
	
	$('#next').click(function(){
		slideRight();
	});
	
	$('#previous').click(function(){
		slideLeft();
	});
	
	var autoSlider = setInterval(slideRight, 3000);
	
	$.each($('#slider-wrap ul li'), function() { 
	   var li = document.createElement('li');
	   $('#pagination-wrap ul').append(li);	   
	});
		
	pagination();
	
	$('#slider-wrap').hover(
	  function(){ $(this).addClass('active'); clearInterval(autoSlider); }, 
	  function(){ $(this).removeClass('active'); autoSlider = setInterval(slideRight, 3000); }
	);
	
});
	
function slideLeft(){
	pos--;
	if(pos==-1){ pos = totalSlides-1; }
	$('#slider-wrap ul#slider').css('left', -(sliderWidth*pos)); 	
	
	pagination();
}

function slideRight(){
	pos++;
	if(pos==totalSlides){ pos = 0; }
	$('#slider-wrap ul#slider').css('left', -(sliderWidth*pos)); 
	
	pagination();
}

function pagination(){
	$('#pagination-wrap ul li').removeClass('active');
	$('#pagination-wrap ul li:eq('+pos+')').addClass('active');
}

function functionCart(pid, msg, myYes) {

	console.log(pid);

	// add cart session
	axios.post("/add_cart", {
		cart_insert: pid
	})
	.then((res) => {
		console.log(res);

		if (res.data == true) {
			// show message
			var confirmBox = $("#confirm");
			confirmBox.find(".message p").text(msg.substr(0, 3) + "... 장바구니 담기 완료");
			confirmBox.find(".close").unbind().click(function() {
			confirmBox.hide();
			});
			confirmBox.find(".close").click(myYes);
			confirmBox.show();	
		} else {
			// show message
			alert("장바구니 담기 실패");
			var confirmBox = $("#confirm");
			confirmBox.find(".message p").text("장바구니 담기 실패");
			confirmBox.find(".close").unbind().click(function() {
			confirmBox.hide();
			});
			confirmBox.find(".close").click(myYes);
			confirmBox.show();	
		}
	})
	.catch((e) => {
		// show message
		alert("장바구니 담기 실패");
		var confirmBox = $("#confirm");
		confirmBox.find(".message p").text("장바구니 담기 실패");
		confirmBox.find(".close").unbind().click(function() {
		confirmBox.hide();
		});
		confirmBox.find(".close").click(myYes);
		confirmBox.show();
	})
 }


 function payDir(prodid) {
	 let prodArr = [];
	 const num = prompt("구매 수량을 입력해주세요");
	 for (var i = 0; i < num; i++) {
		 prodArr.push(prodid);
	 }
	 location.href = '/payment/direct?prodlist=' + prodArr.toString();
 }