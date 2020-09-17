particleJS()
makeFloatOnParticle("content-wrapper");
$("#sectionPhase1").hide();
$("#sectionPhase2").hide();

var selection = [];
var userID;
var docID;
var board;
for (var selection = [], i = 0; i < 40; ++i) selection[i] = i;


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        $("#userName").text(user.displayName + " ,")
        userID = user.uid;
        gerFromFirebase();

    } else {
        window.location.href = "../index.html";
    }
});

function gerFromFirebase() {
    db
        .collection(`user/${userID}/board`)
        .get()
        .then(snap => {
            if (snap.empty) {
                $("#sectionPhase1").show();
            }
            snap.forEach(doc => {
                board = doc.data().board
                docID = doc.id;
                for (let key in board) {
                    if (board.hasOwnProperty(key)) {
                        const element = board[key];
                        // console.log(element)
                        if (element.taken) {
                            $(`#square${element.index}`).replaceWith(`<td id="square${element.index}" class="bg-success"></td>`);
                            $(`#square${element.index}`).append(`
                                <a href="#" onclick="recordToDB(this.id)" id="btnNumber${element.index}" class="btn btn-success">
                                ${element.number}</a>`);
                        } else {
                            $(`#square${element.index}`).replaceWith(`<td id="square${element.index}"></td>`);
                            $(`#square${element.index}`).append(`
                                <a href="#" onclick="recordToDB(this.id)" id="btnNumber${element.index}" class="btn btn-primary">
                                ${element.number}</a>`);
                        }
                    }
                }

            });
        })
        .catch(error => {
            console.log(error)
        })
}

function readyNumber() {
    var tmp, current, top = selection.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = selection[current];
            selection[current] = selection[top];
            selection[top] = tmp;
        }
}

function init(j = 0) {
    var interval = setInterval(change, 50);
    $("#sp2btnYes").attr('onclick', '').addClass('btn-secondary').removeClass('btn-primary');
    $("#sp2btnNo").attr('onclick', '').addClass('btn-secondary').removeClass('btn-primary');



    function change() {
        readyNumber(selection)
        for (let i = 1; i < 25; i++) {
            $(`#square${i}`).replaceWith(`<td id="square${i}"></td>`);
            $(`#square${i}`).append(`
            <a href="#" onclick="recordToDB(this.id)" id="btnNumber${i}" class="btn btn-primary">${selection[i]}</a>
        `);
        }
        j++;
        if (j >= Math.floor(Math.random() * (100 - 60 + 1) + 60)) {
            clearInterval(interval);
            $("#sp2btnYes").attr('onclick', 'boardLiked()').removeClass('btn-secondary').addClass('btn-primary');
            $("#sp2btnNo").attr('onclick', 'init()').removeClass('btn-secondary').addClass('btn-primary');
        }
    }

    $("#sectionPhase1").hide()
    $("#sectionPhase2").show()
}

function boardLiked() {

    var temp = [];
    for (let i = 1; i < 25; i++) {
        var number = $(`#btnNumber${i}`).text()
        var text = {
            index: i,
            number: parseInt(number),
            taken: false
        }
        temp.push(text);
    }
    // BLOCK if user already have it 
    db
        .collection(`user/${userID}/board`)
        .add({
            userID: userID,
            board: temp
        })
        .then((response) => {
            getFromFirebase()
        })
        .catch((error) => {
            console.log(error)
        });

}

function recordToDB(id) {
    var id = id.split("btnNumber")[1];
    board[id - 1].taken = true;

    db
        .doc(`user/${userID}/board/${docID}`)
        .update({
            userID: userID,
            board: board
        })
        .then((response) => {
            gerFromFirebase()
        })
        .catch((error) => {
            console.log(error)
        });

}