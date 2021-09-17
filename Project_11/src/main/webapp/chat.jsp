<%--
  Created by IntelliJ IDEA.
  User: panai
  Date: 8/20/2019
  Time: 8:25 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Chat</title>
</head>
<body>
<form action="/Project_11_war_exploded/chat" class="form-container" method="post">
    <h1>Chat</h1>

    <%--    <label for="msg"><b>Message</b></label>--%>
    <textarea placeholder="Type message.." name="msg" required></textarea>
    sender: <input type="text" name="sender" width="30" required/>
    receiver: <input type="text" name="receiver" width="10" required/>

    <button type="submit" class="btn">Send</button>
<%--    <button type="button" class="btn cancel" onclick="closeForm()">Close</button>--%>
</form>
</body>
</html>
