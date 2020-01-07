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

function functionAlert(msg, myYes) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".close").unbind().click(function() {
       confirmBox.hide();
    });
    confirmBox.find(".close").click(myYes);
    confirmBox.show();
 }