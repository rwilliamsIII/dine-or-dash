$("form.signup").submit (event) ->
    event.preventDefault()
    username = $("input[name='username']")
    password = $("input[name='password']")
    userData = {
        username: username.val().trim()
        password: password.val().trim()
    }

    if !userData.username || !userData.password
        return;

    signUpUser(userData.username, userData.password)
    username.val("")
    password.val("")

signUpUser = (username, password) ->
    $.post("/api/signup", {
      username: username,
      password: password
    })
      .then((data) ->
        window.location.replace("/index")
      )