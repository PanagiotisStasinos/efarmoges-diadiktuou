<<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 8/30/2019
  Time: 3:04 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Find SubCategories</title>
</head>
<body>

<h1>Welcome, give category and level</h1>
<form action="/11_war_exploded/FindSubCategories" method="get">
    category: <input type="text" name="category" width="30"/>
    level: <input type="number" name="level" /><br>
    <input type="submit" value="Find">
</form>

<%String er = (String)request.getAttribute("categories"); %>
<p style= "color : red;"> <%= er%></p>

</body>
</html>
