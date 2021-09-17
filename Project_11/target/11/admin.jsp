<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 8/8/2019
  Time: 8:37 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Administrator</title>
</head>
<body>
<form action="/11_war_exploded/get_items" method="post">
    <input type="submit" name="button1" value="Create!" />
</form>

<form action="/11_war_exploded/get_items" method="get">
    <select name="type">
        <option value="xml">XML</option>
        <option value="json">JSON</option>
    </select>
    <input type="submit" value="Download">
</form>
<br>
<br>

<form method="post" action="/11_war_exploded/store_users">
    file : <input type="number" name="file"/><br>
    <input type="submit" value="store_users">
</form>
<form method="get" action="/11_war_exploded/store_users">
    <input type="submit" value="get_files">
</form>
<%String files = (String)request.getAttribute("files"); %>
<p style= "color : red;"> <%= files%></p>


<form action="/11_war_exploded/find_categories" method="get">
    <input type="submit" value="Find_Categories">
</form>
<%String er = (String)request.getAttribute("categories"); %>
<p style= "color : red;"> <%= er%></p>


<form action="/11_war_exploded/get_users" method="get">
    <input type="submit" value="Go">
</form>


<%String users = (String)request.getAttribute("users"); %>
<p style= "color : red;"> <%= users%></p>
</body>
</html>