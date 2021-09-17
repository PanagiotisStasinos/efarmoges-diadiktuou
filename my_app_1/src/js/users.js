import $ from 'jquery'; 



// $(function newUser() {
//     // $("#adduser").click(function () {
//     //     alert("Fuckkkkkkkkkkkkkkk!!!!.");
//     // });



//     $("#adduser").click(function(){
//         $("#table2").append($("#table2").html());
//         // $("#table2").append($("#trow").html());
//         // $("#trow").show();
//         // $("#table2").append("");
        
//     });
// });



// ADD A NEW ROW TO THE TABLE.
export function addRow() {

    let users = [
        {username: "bob", name: "zisis", surname: "beli", email: "Ogiannisoudravlikosapothn@Kozani"},
        {username: "tamtakos",name: "Giannakis",surname: "Giannakis_eipame",email: "giannaki@tikaneis"},
        {username: "Rony",name: "Cristiano",surname: "Ronaldo",email: "Rony@reee"},
        {username: "Vlasis",name: "Pantelis",surname: "Apomaster",email: "1@pantel"},
        {username: "Lebroni",name: "Lebron",surname: "James",email: "LJ@gmail.com"}, 
        {username: "Lebroni2",name: "Lebron",surname: "James",email: "LJ@gmail.com"},
        { username: "Lebroni3", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni4", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni5", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni6", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni7", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni8", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni9", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni10", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni11", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni12", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni13", name: "Lebron", surname: "James", email: "LJ@gmail.com" },
        { username: "Lebroni14", name: "Lebron", surname: "James", email: "LJ@gmail.com" }
    ];

    // var username = users[0].username;
    // var name = users[0].name;
    // var surname = users[0].surname;
    // var email = users[0].email;


    window.totalRows = users.length;

    for (let i = 0; i < users.length; i++) {
        var username = users[i].username;
        var name = users[i].name;
        var surname = users[i].surname;
        var email = users[i].email;
        var num = i+1;
        
        var row = "<tr class='tablerow' id='tablerow'><th>"+ num +"</th> <td id='username'>" + username +
            "</td><td>" + name +
            "</td><td>" + surname +
            "</td><td>" + email +
            "</td><td>" + "Verified" +
            "</td><td><button  class='btn' id='info-user-button'><i class='fas fa-info-circle' id='details-user-icon'><span class='detailsusertext'>User Details</span></i></button>" + 
            "<button class='btn' id='edit-user-button'><i class='fas fa-user-edit' id='edit-user-icon'><span class='editusertext'>Edit User</span></i></button>" +
            "<button class='btn' id='delete-user-button'><i class='fas fa-trash-alt' id='delete-user-icon'><span class='deleteusertext'>Delete User</span></i></button>" +
            "</td></tr>"; 


        $("#table2").append(row);
    }

    // alert(users.length);

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    var pg = "<nav aria-label='...'>" + 
            "<ul class='pagination justify-content-end mt-3 mr-3'>"+
                "<li class='page-item disabled'>"+
                    "<span class='page-link'>Previous</span>"+
                "</li>"+
                "<li class='page-item'><a class='page-link' href='#'>1</a></li>"+
                "<li class='page-item active'>"+
                    "<span class='page-link'>2<span class='sr-only'>(current)</span>"+
                    "</span>"+
                "</li>"+
                "<li class='page-item'><a class='page-link' href='#'>3</a></li>"+
                "<li class='page-item'>"+
                    "<a class='page-link' href='#'>Next</a>"+
                "</li>"+
            "</ul>"+
        "</nav>";
    
        /* The element must be ready! */

    // jQuery(document).ready(function () {
    //     jQuery("#pageclass").append(pg);
    // });

    // $('#table2').after('<div id="nav"></div>');

    // var rowsTotal = users.length;
    // var rowsShown = 4;
    // var numPages = rowsTotal / rowsShown;

    // var prev = "<nav aria-label='...'>" +
    //     "<ul class='pagination justify-content-end mt-3 mr-3'>" +
    //     "<li class='page-item disabled'>" +
    //     "<span class='page-link'>Previous</span>" +
    //     "</li>";

    // // $('#nav').append(prev);

        
    // var after = "<li class='page-item'>" +
    //     "<a class='page-link' href='#'>Next</a>" +
    //     "</li>" +
    //     "</ul>" +
    //     "</nav>";;

    // for (i = 0; i < numPages; i++) {
    //     var pageNum = i + 1;

    //     // $('#nav').append("<li class= 'page-item' >");
    //     // $('#nav').append('<a class="page-link" href="#" rel="' + i + '">' + pageNum + '</a>');
    //     // $('#nav').append("</li>");

    //     jQuery(document).ready(function () {
    //                     // < !-- < li class="page-item" id = "pageItem" > <a class="page-link" id="pageLink" href="#"></a></li > -->
    //         jQuery('#paging').after('<li class="page-item"><a class="page-link" href="#" rel="' + i + '">' + pageNum + '</a></li> ');
    //     });

    //     // $('#nav').append('<a href="#" rel="' + i + '">' + pageNum + '</a> ');
    // }

    // $('#table2 tbody tr').hide();
    // $('#table2 tbody tr').slice(0, rowsShown).show();
    // // $('#nav a:first').addClass('active');
    // $('#paging a:first').addClass('active');

    // // $('#nav a').on('click', function () {
    // //     $('#nav a').removeClass('active');
    // $('#paging a').on('click', function () {
    //     $('#paging a').removeClass('active');
    //     $(this).addClass('active');
    //     var currPage = $(this).attr('rel');
    //     var startItem = currPage * rowsShown;
    //     var endItem = startItem + rowsShown;
    //     $('#table2 tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
    //         css('display', 'table-row').animate({ opacity: 1 }, 300);
    // });

}



export function pagination() {


    $('#table2').after('<div id="nav"></div>');

    // var rowsTotal = 5;
    var rowsTotal = window.totalRows;
    var rowsShown = 4;
    var numPages = rowsTotal / rowsShown;

    var prev = "<nav aria-label='...'>" +
        "<ul class='pagination justify-content-end mt-3 mr-3'>" +
        "<li class='page-item disabled'>" +
        "<span class='page-link'>Previous</span>" +
        "</li>";

    // $('#nav').append(prev);


    var after = "<li class='page-item'>" +
        "<a class='page-link' href='#'>Next</a>" +
        "</li>" +
        "</ul>" +
        "</nav>";


    for (let i = 0; i < numPages; i++) {
        var pageNum = i + 1;

        // $('#nav').append("<li class= 'page-item' >");
        // $('#nav').append('<a class="page-link" href="#" rel="' + i + '">' + pageNum + '</a>');
        // $('#nav').append("</li>");

        $('#paging').append('<li class="page-item" id="pageIt"><a class="page-link" id="page-link" href="#" rel="' + i + '">' + pageNum + '</a></li>');
            // $('#nav').append('<a href="#" rel="' + i + '">' + pageNum + '</a> ');
    }


    $('#table2 tbody tr').hide();
    $('#table2 tbody tr').slice(0, rowsShown).show();
    // $('#nav a:first').addClass('active');
    $('#pageIt:first').addClass('active');

    // $('#nav a').on('click', function () {
    //     $('#nav a').removeClass('active');
    $('#pageIt a').on('click', function () {
        $("#pageIt a").parent().removeClass('active');
        // $('#paging a').removeClass('active');
        $(this).parent().addClass('active');
        
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;

        // $("#pageIt a").scrollIntoView();

        $('#table2 tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
            css('display', 'table-row').animate({ opacity: 1 }, 300);
        
        
    
    });
}

/* REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING */
/* REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING */
/* REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING */
/* REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING */
/* REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING REQUEST TESTING */

export function request() {
    alert("HEY!!!");
    var xhr = new XMLHttpRequest();

//C:\Users\Zisis\IdeaProjects\test2\web\testjson.jsp

    // xhr.open('GET', 'http://localhost:8080/test2_war_exploded/testjson', true);
    xhr.open('GET', '/test2_war_exploded/testjson', true);
    // xhr.send(null);
    xhr.send();

    var x;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // document.write("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            // document.write(xhr.username);

            alert(xhr.responseText);
            var json = JSON.parse(xhr.responseText);

            alert(json[0].username);


            // var obj = JSON.parse(json_string);
            // document.write(obj.username);

            // var testobject = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
            // x = testobject.name;
        } else if (xhr.readyState == 4 ){
            alert(xhr.status);
        }

    }
    return x;
}










