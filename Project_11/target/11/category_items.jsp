<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 8/31/2019
  Time: 7:07 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>CategoryItems</title>
</head>
<body>

<form action="/11_war_exploded/CategoryItems" method="get">
    UpperCategory: <input type="text" name="upper_category" width="30"/>
    Category: <input type="text" name="category" width="30"/>
    level: <input type="number" name="level" placeholder="0" value="0">
    number_of_items: <input type="number" name="number_of_items" placeholder="10" value="10">
    number_of_page: <input type="number" name="number_of_page" placeholder="1" value="1">
    <input type="submit" value="GO!">
</form>

<%String er = (String)request.getAttribute("items"); %>
<p style= "color : red;"> <%= er%></p>

</body>
</html>
