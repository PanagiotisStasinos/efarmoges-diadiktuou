<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 8/16/2019
  Time: 6:18 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Insert_Item</title>
</head>
<body>

<form action="/Project_11_war_exploded/insert_item" method="post">
    Name : <input type="text" name="Name" /><br>
    <select name="Category">
        <option value="Collectibles">Collectibles</option>
        <option value="Clothing & Accessories">Clothing & Accessories</option>
        <option value="Movies & Television">Movies & Television</option>
        <option value="Movies & Television">Movies & Television</option>
    </select>
    Buy_Price: <input type="number" name="Buy_Price" /><br>
    First_Bid: <input type="number" name="First_Bid" /><br>
    Location: <input type="text" name="Location" /><br>
    Country: <input type="text" name="Country" /><br>
    Description : <input type=text name="Description" width="30"/><br>

    <input type="submit" value="Submit">
</form>

</body>
</html>
