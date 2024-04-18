if (localStorage.getItem("DONOTSHARE-secretkey") === null) {
    window.location.replace("/login")
    document.body.innerHTML = "Redirecting..."
    throw new Error();
}

function attempt() {
    if (document.getElementById("appidbox").value.match(/^[A-Za-z]+$/)) {
        fetch("https://auth.hectabit.org/api/newauth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                appId: document.getElementById("appidbox").value,
                rdiruri: document.getElementById("rdiruribox").value,
                secretKey: localStorage.getItem("DONOTSHARE-secretkey")
            })
        })
        .then(response => {
            async function doStuff() {
                let code = await response.json()
                if (response.status == 200) {
                    document.getElementById("status").innerText = "Your key is: " + code["key"] + ". This will only be shown once!"
                    getauths();
                } else if (response.status == 500) {
                    document.getElementById("status").innerText = "Whoops... Something went wrong. Please try again later. (Error Code 500)"
                } else if (response.status == 401) {
                    document.getElementById("status").innerText = "AppID already taken. (Error Code 401)"
                } else {
                    document.getElementById("status").innerText = "Unkown error encountered. (Error Code " + response.status + ")"
                }
            }
            doStuff()
        })
    }
}

function getauths() {
    fetch("https://auth.hectabit.org/api/listauth", {
        method: "POST",
        body: JSON.stringify({
            secretKey: localStorage.getItem("DONOTSHARE-secretkey")
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {
        async function doStuff() {
            let responseData = await response.json()
            document.querySelectorAll(".oauthentry").forEach((el) => el.remove());
            for (let i in responseData) {
                let oauthElement = document.createElement("div")
                let oauthText = document.createElement("p")
                let oauthRemoveButton = document.createElement("button")
                oauthText.innerText = "Client ID: " + responseData[i]["appId"]
                oauthRemoveButton.innerText = "Delete Permanently"
                oauthRemoveButton.addEventListener("click", (event) => {
                    if (window.confirm("Are you SURE you would like to delete this FOREVER?") == true) {
                        fetch("https://auth.hectabit.org/api/deleteauth", {
                            method: "POST",
                            body: JSON.stringify({
                                secretKey: localStorage.getItem("DONOTSHARE-secretkey"),
                                appId: responseData[i]["appId"]
                            }),
                            headers: {
                                "Content-Type": "application/json; charset=UTF-8"
                            }
                        })
                        oauthElement.remove()
                    }
                });

                oauthElement.append(oauthText)
                oauthElement.append(oauthRemoveButton)
                oauthElement.classList.add("oauthentry")

                document.getElementById("oauthlist").append(oauthElement)
            }
        }
        doStuff()
    });
}

getauths()
