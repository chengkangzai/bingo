// https://www.obfuscator.io/
particleJS()
makeFloatOnParticle("content-wrapper");
$("#sectionPhase1").hide();
$("#sectionPhase2").hide();
$("#sectionPhase3").hide();

var selection = [];
var userID = localStorage.getItem('userID');
var userName;
var docID;
var board = [];
var bingoCol = [];
var timestamp = new Date().getTime()
    // var timestamp = new Date().getTime()
for (var selection = [], i = 0; i < 40; ++i) selection[i] = i;


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        userName = user.displayName;
        $(".userName").text(`${userName},`);
    } else {
        window.location.href = "../index.html";
    }
});

db
    .doc(`users/${userID}`)
    .onSnapshot(doc => {
        if (doc.exists && doc.data().bingoCollection) {
            bingoCol = doc.data().bingoCollection;
            $("#bingoNumber").text(bingoCol.length)
        } else {
            $("#bingoNumber").text("0")
        }
    })

db
    .collection(`users/${userID}/board/`)
    .onSnapshot(function(snap) {
        (snap.empty) ? $("#sectionPhase1").show(): $("#sectionPhase3").show();
        snap.forEach(doc => {
            board = doc.data().board;
            var localBoard = doc.data().board;
            docID = doc.id;

            for (let key in localBoard) {
                if (localBoard.hasOwnProperty(key)) {
                    const element = localBoard[key];
                    // console.log(element)
                    if (element.taken) {
                        $(`#square${element.index}`).replaceWith(`<td id="square${element.index}" class="bg-success"></td>`);
                        $(`#square${element.index}`).append(`
                                            <a href="#" onclick="markAsTaken(this.id)" id="btnNumber${element.index}" class="btn btn-success">${element.number}</a>`);
                    } else {
                        $(`#square${element.index}`).replaceWith(`<td id="square${element.index}"></td>`);
                        $(`#square${element.index}`).append(`
                                            <a href="#" onclick="markAsTaken(this.id)" id="btnNumber${element.index}" class="btn btn-primary">${element.number}</a>`);
                    }
                }
            }
            checkBingo();
        })
    });



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
        readyNumber()
        for (let i = 0; i < 25; i++) {
            $(`#square${i}`).replaceWith(`<td id="square${i}"></td>`);
            $(`#square${i}`).append(`
                <a href="#" onclick="markAsTaken(this.id)" id="btnNumber${i}" class="btn btn-secondary" disabled>${selection[i]}</a>
            `);

            // $(`#square${i}`).replaceWith(`<td id="square${i}"></td>`);
            // $(`#square${i}`).append(`
            // <a href="#" onclick="markAsTaken(this.id)" id="btnNumber${i}" class="btn btn-primary">${(i - 1)}</a>
            // `);
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
    board = temp;
    // BLOCK if user already have it 
    db
        .collection(`users/${userID}/board`)
        .add({
            userID: userID,
            board: temp,
            timestamp: timestamp
        })
        .then((response) => {
            $("#sectionPhase2").hide()
            $("#sectionPhase3").show()
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        });

}

function markAsTaken(id) {
    var id = id.split("btnNumber")[1];
    board[id - 1].taken = true;

    db
        .doc(`users/${userID}/board/${docID}`)
        .update({
            userID: userID,
            board: board,
            timestamp: timestamp
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            //TODO check the error
            new Modal("Warnings!", `
            <h3 class='text-danger'>Please do not spam the database! </h3>
            <h2 class='text-danger'>It has been marked as a spam </h2>
            <p>You only can mark one bingo in 5 minutes </p>
            <p>No one want to pay for the bill of query from database </p>
            `).show()
        });

}

function checkBingo() {

    var r1bingo = (board[0].taken && board[1].taken && board[2].taken && board[3].taken && board[4].taken) ? true : false;
    var r2bingo = (board[5].taken && board[6].taken && board[7].taken && board[8].taken && board[9].taken) ? true : false;
    var r3bingo = (board[10].taken && board[11].taken && board[12].taken && board[13].taken) ? true : false;
    var r4bingo = (board[14].taken && board[15].taken && board[16].taken && board[17].taken && board[18].taken) ? true : false;
    var r5bingo = (board[19].taken && board[20].taken && board[21].taken && board[22].taken && board[23].taken) ? true : false;
    var c1bingo = (board[0].taken && board[5].taken && board[10].taken && board[14].taken && board[19].taken) ? true : false;
    var c2bingo = (board[1].taken && board[6].taken && board[11].taken && board[15].taken && board[20].taken) ? true : false;
    var c3bingo = (board[2].taken && board[7].taken && board[16].taken && board[21].taken) ? true : false;
    var c4bingo = (board[3].taken && board[8].taken && board[12].taken && board[17].taken && board[22].taken) ? true : false;
    var c5bingo = (board[4].taken && board[9].taken && board[13].taken && board[18].taken && board[23].taken) ? true : false;
    var ob1bingo = (board[0].taken && board[6].taken && board[17].taken && board[23].taken) ? true : false;
    var ob2bingo = (board[4].taken && board[8].taken && board[15].taken && board[19].taken) ? true : false;


    var tempBingoCol = []

    if (r1bingo == true) { tempBingoCol.push({ r1bingo: r1bingo, timestamp: timestamp }) }
    if (r2bingo == true) { tempBingoCol.push({ r2bingo: r2bingo, timestamp: timestamp }) }
    if (r3bingo == true) { tempBingoCol.push({ r3bingo: r3bingo, timestamp: timestamp }) }
    if (r4bingo == true) { tempBingoCol.push({ r4bingo: r4bingo, timestamp: timestamp }) }
    if (r5bingo == true) { tempBingoCol.push({ r5bingo: r5bingo, timestamp: timestamp }) }
    if (c1bingo == true) { tempBingoCol.push({ c1bingo: c1bingo, timestamp: timestamp }) }
    if (c2bingo == true) { tempBingoCol.push({ c2bingo: c2bingo, timestamp: timestamp }) }
    if (c3bingo == true) { tempBingoCol.push({ c3bingo: c3bingo, timestamp: timestamp }) }
    if (c4bingo == true) { tempBingoCol.push({ c4bingo: c4bingo, timestamp: timestamp }) }
    if (c5bingo == true) { tempBingoCol.push({ c5bingo: c5bingo, timestamp: timestamp }) }
    if (ob1bingo == true) { tempBingoCol.push({ ob1bingo: ob1bingo, timestamp: timestamp }) }
    if (ob2bingo == true) { tempBingoCol.push({ ob2bingo: ob2bingo, timestamp: timestamp }) }

    if (r1bingo || r2bingo || r3bingo || r4bingo || r5bingo || c1bingo || c2bingo || c3bingo || c4bingo || c5bingo || ob1bingo || ob2bingo) {
        if ((bingoCol == undefined) || (bingoCol.length !== tempBingoCol.length)) {
            db
                .doc(`users/${userID}`)
                .set({ bingoCollection: tempBingoCol })
                .then(res => {
                    new Modal("Congrats !", `Congratulation ! You have ${tempBingoCol.length} of bingo ! 🔥🔥🔥🔥🔥`).show()
                })
                .catch({})
        }
    }
}

function reset() {
    //TODO
    //Delete!
    for (let i = 0; i < board.length; i++) {
        board[i].taken = false;
    }

    db
        .doc(`users/${userID}/board/${docID}`)
        .update({
            userID: userID,
            board: board
        })
        .then()
        .catch();

    db
        .doc(`users/${userID}`)
        .set({})
        .then()
        .catch();
}