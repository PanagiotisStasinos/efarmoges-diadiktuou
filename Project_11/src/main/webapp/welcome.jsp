<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 7/18/2019
  Time: 7:44 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Welcome</title>

</head>
<body>
<h1>Welcome</h1>

<%String name = (String)request.getAttribute("username"); %>
<p>Dear: <%= name%></p>

<%String ps = (String)request.getAttribute("password"); %>
<p>Your password is: <%= ps%></p>

<%String json = (String)request.getAttribute("json"); %>
<p>Your json is: <%= json%></p>

<%String jwt = (String)request.getAttribute("jwt"); %>
<p>Your jwt is: <%= jwt%></p>

<%String token = (String)request.getAttribute("token"); %>
<p>Your token is: <%= token%></p>

<script>
    var txt = '{"name":"John", "age":30, "city":"New York"}'
    var obj = JSON.parse(txt);
    document.getElementById("demo").innerHTML = obj.name + ", " + obj.age;
</script>



</body>
</html>
