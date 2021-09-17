<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 7/26/2019
  Time: 6:23 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Login</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">    -->

    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/login.css" rel="stylesheet">

    <!-- JavaScript -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <script src="js/login.js"></script>

</head>

<body>

<!-- Navigation bar -->
<nav class="navbar navbar-light bg-light">
    <a class="navbar-brand" href="index.html">
        <img class="ebaypic" src="img/ebay-icon2.png" width="30" height="30" class="d-inline-block align-top" alt="">
    </a>

    <!-- Search bar  -->
    <!-- <div class="form-group mb-0 ml-0" style="width: 40em; margin-right: -1em;">
            <input id="exampleFormControlInput5" type="email" placeholder="What're you searching for?" class="form-control form-control-underlined border-success">
            <div class="input-group-append border-0">
                <button id="button-addon3" type="button" class="btn btn-link text-success"><i class="fa fa-search"></i></button>
            </div>
        </div> -->
    <div class="input-group mb-1 border rounded-pill p-1 bg-white" style="width: 60em;">
        <input type="search" placeholder="What're you searching for?" aria-describedby="button-addon3"
               class="form-control bg-none border-0 " style="style: black;">
        <div class="input-group-append border-0 ">
            <button id="button-addon3" type="button" class="btn btn-link text-success"><i class="fa fa-search"
                                                                                          style="color:black;"></i></button>
        </div>
    </div>

    <ul class="nav navbar-nav navbar-right" style="margin-right: 1em;">
        <li style="margin-right: 15px"><a style="color: black" href="signup.html"><span class="fa fa-sign-in"></span> Sing in</a>
        </li>
        <li><a style="color: black" href="login.html"><span class="fa fa-user"></span> Login</a></li>
    </ul>

</nav>

<!-- Menu Navbar -->
<div id="navbar" class="container-fluid">
    <div class="container nav-fill w-100">
        <nav class="navbar navbar-expand-md navbar-light" role="navigation">
            <button class="navbar-toggler"
                    style="margin-left: 10em; background-color: rgb(167, 26, 26) ; border-width: 2px;"
                    data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <!-- <span class="navbar-toggler-icon"></span> -->
                <span class="colmenu" style="color:white;">Menu</span>

            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav nav-fill w-100">
                    <li class="nav-item">
                        <a href="index.html" role="button" class="btn btn-default">Home</a>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Technology</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Fashion</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Health & Beauty</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Motors</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Sports</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Home</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Deals</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group">
                            <a href="#" role="button" class="btn btn-default">Collectibles</a>
                            <button class="btn btn-default dropdown-toggle dropdown-toggle-split d-none d-md-block"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Item</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</div>


<%--<div id="logreg-forms">--%>
<%--    <form class="form-signin">--%>

<%--        <h1 class="h3 mb-3 font-weight-normal"  style="text-align: center"> Sign in </h1>--%>

<%--        <div class="input-group">--%>
<%--            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required=""--%>
<%--                   autofocus="">--%>
<%--        </div>--%>

<%--        <div class="input-group">--%>
<%--            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="">--%>
<%--        </div>--%>

<%--        <div class="input-group">--%>
<%--            <button class="btn btn-md btn-rounded btn-block form-control submit" href="/Project_11_war_exploded/login" type="submit"><i--%>
<%--                    class="fas fa-sign-in-alt"></i> Sign in</button>--%>
<%--        </div>--%>

<%--        <a href="#" id="forgot_pswd">Forgot password?</a>--%>
<%--        <hr>--%>
<%--        <!-- <p>Don't have an account!</p>  -->--%>
<%--        <button class="btn btn-primary btn-block" type="button" id="btn-signup"><i class="fa fa-sign-in"></i> Sign up--%>
<%--            New Account</button>--%>
<%--    </form>--%>

<%--    <form action="#" class="form-reset">--%>
<%--        <input type="email" id="resetEmail" class="form-control" placeholder="Email address" required="" autofocus="">--%>
<%--        <button class="btn btn-primary btn-block" type="submit">Reset Password</button>--%>
<%--        <a href="#" id="cancel_reset"><i class="fa fa-arrow-left"></i> Back</a>--%>
<%--    </form>--%>

    <!--        <form action="#" class="form-signup">
               <div class="social-login">
                   <button class="btn facebook-btn social-btn" type="button"><span><i class="fab fa-facebook-f"></i> Sign up
                           with Facebook</span> </button>
               </div>
               <div class="social-login">
                   <button class="btn google-btn social-btn" type="button"><span><i class="fab fa-google-plus-g"></i> Sign up
                           with Google+</span> </button>
               </div>

               <p style="text-align:center">OR</p>

               <input type="text" id="user-name" class="form-control" placeholder="Full name" required="" autofocus="">
               <input type="email" id="user-email" class="form-control" placeholder="Email address" required autofocus="">
               <input type="password" id="user-pass" class="form-control" placeholder="Password" required autofocus="">
               <input type="password" id="user-repeatpass" class="form-control" placeholder="Confirm Password" required
                   autofocus="">

               <div class="input-group">
                   <button class="btn btn-md btn-block submit" type="submit"><i class="fas fa-user-plus"></i> Sign Up</button>
               </div>

               <a href="#" id="cancel_signup"><i class="fa fa-sign-in"></i> Back</a>
           </form>
           <br> -->

<%--</div>--%>


<h1>Welcome, please login</h1>
<form action="/11_war_exploded/login" method="post">
    login-name: <input type="text" name="username" width="30"/>
    password: <input type="password" name="password" width="10"/>
    <input type="submit" value="Login">
</form>


<%String er = (String)request.getAttribute("errorMessage"); %>
<p style= "color : red;"> <%= er%></p>


<div class="d-flex flex-column">
    <div id="page-content" style="background-color: black;">
        <div class="container text-center">
            <div class="row justify-content-center">
                <div class="col-md-7">
                    <h1 class="font-weight-light mt-4 text-white">Sticky Footer using Flexbox</h1>
                    <p class="lead text-white-50">Use just two Bootstrap 4 utility classes and three custom CSS rules
                        and you will have a flexbox enabled sticky footer for your website!</p>
                </div>
            </div>
        </div>
    </div>
    <footer id="sticky-footer" class="py-4 bg-dark text-white-50">
        <div class="container text-center">
            <small>Copyright &copy; Your Website</small>
        </div>
    </footer>
</div>

<%--<!-- Bootstrap core JavaScript -->--%>
<%--<script src="vendor/jquery/jquery.min.js"></script>--%>
<%--<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>--%>
<%--</body>--%>
<%--<html>--%>
<%--<head>--%>
<%--    <title>login</title>--%>
<%--</head>--%>
<%--<body>--%>
<%--<h1>Welcome, please login</h1>--%>
<%--<form action="/Project_11_war_exploded/login" method="post">--%>
<%--    login-name: <input type=""text name="username" width="30"/>--%>
<%--    password: <input type="password" name="password" width="10"/>--%>
<%--    <input type="submit" value="Login">--%>
<%--</form>--%>


<%--<%String er = (String)request.getAttribute("errorMessage"); %>--%>
<%--<p style= "color : red;"> <%= er%></p>--%>

<%--</body>--%>
<%--</html>--%>
