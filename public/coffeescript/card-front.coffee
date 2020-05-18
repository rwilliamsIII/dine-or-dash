$("#yes").click (event) ->
    $.post "/api/restaurants",
        id: "#{id}"
        name: "#{name_biz}"
        picURL: "#{picURL}"
        liked: "true"
    .then((res) ->

    )
    
$("#no").click (event) ->
    $.post "/api/disliked/restaurants",
        id: "#{id}"
        liked: "false"
    .then((res) ->

    )