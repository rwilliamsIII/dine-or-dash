$("form.login").submit (event) ->
    event.preventDefault()
    username = $("input[name='username']")
    password = $("input[name='password']")
    userData = {
        username: username.val().trim()
        password: password.val().trim()
    }

    if !userData.username || !userData.password 
        return

    loginUser(userData.username, userData.password)
    username.val("")
    password.val("")

loginUser = (username, password) ->
    $.post("/api/login", {
        username: username,
        password: password
    })
    .then((res) ->
        console.log("something");
        window.location.replace("/index")
    )