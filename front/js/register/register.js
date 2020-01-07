$(document).ready(function() {
    // animation_start

    // id_check function

    const server_link = "sfam.shop";

    const id = document.getElementById("id").value;
    const pw = document.getElementById("pw");
    const pw_re = document.getElementById("pw_re");

    $("#id").change(function() {
        var result = axios.post(server_link + "/id_check", {
            id: id
        }).data;

        if (result == true) {
            // can use this id

        } else if (result == false){
            // cannot use this id

        } else {
            // have trouble in serverside
            
        }
    })

    // pw==pw_re_check function
    
    $("#pw_re").change(function() { 
        // console.log(pw.value);
        // console.log(pw_re.value);
        if (pw.value == pw_re.value) {
            // correct pw
            // console.log("correct");
            // console.log(document.getElementById("pw_re_bottom").style);
            $(".line_bottom_before").css("opacity", 0);
            $(".line_bottom_after").css("opacity", 1);
            $(".err_message").css("opacity", 0);
        } else {
            // not correct pw
            // console.log("not correct");
            $(".line_bottom_before").css("opacity", 1);
            $(".line_bottom_after").css("opacity", 0);
            $(".err_message").css("opacity", 1);
        }
    });

    // pw_check function
    $("#pw").on("textchange", function() {
        // var pattern1 = /[0-9]/;
        // var pattern2 = /[a-zA-Z]/;
        // var pattern3 = /[~!@\#$%<>^&*]/;     // 원하는 특수문자 추가 제거
        // var pw_msg = "";
    })

    $("#pn").on("textchange", check_allinput());


    function check_allinput() {
        const name_input = document.getElementById("name").value;
        const id_input = document.getElementById("id").value;
        const pw_input = document.getElementById("pw").value;
        const pw_re_input = document.getElementById("pw_re").value;
        const pn_input = document.getElementById("pn").value;

        if (name_input != "" && id_input != "" && pw_input != "" && pw_re_input != "" && pn_input != "") {
            
        }
    }



    // 근데 전화번호 인증 안받을건가..?
    

})

function change_placeholder(object, contents, color) {
    var placeholder = document.getElementById(object).placeholder
}