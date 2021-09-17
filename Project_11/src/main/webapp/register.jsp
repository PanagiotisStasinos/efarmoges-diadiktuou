<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 7/30/2019
  Time: 6:50 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Register</title>
</head>
<body>

<h1>Φόρμα Εγγραφής χρήστη</h1>
<p>Συμπληρώστε τα στοιχεία σας παρακάτω:</p>

<form action="/Project_11_war_exploded/register" method="post">
    Username: <input type="text" name="username" >
    <br>
    Password: <input type="password" name="password" >
    <br>
    Confirm Password: <input type="password" name="conpassword" >
    <br>
    surname: <input type="text" name="surname" id="surname" width="30"/>
    <br>
    first_name: <input type="text" name="first_name" id="first_name" width="30"/>
    <br>
    email: <input type="email" name="email" id="email" width="30"/>
    <br>
    afm: <input type="number" name="afm" id="afm" width="30">
    <br>
    <input type="submit" value="Εγγραφή">

</form>
<br>
<br>
<form action="/Project_11_war_exploded/name_exists" method="post">
    login-name: <input type=""text name="temp_name" width="30"/>
    <input type="submit" value="name exists?">
</form>

<%String message = (String)request.getAttribute("message"); %>
<p>message: <%= message%></p>

</body>
</html>
