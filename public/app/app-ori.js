// https://www.obfuscator.io/
particleJS()
makeFloatOnParticle("content-wrapper");
$("#sectionPhase1").hide();
$("#sectionPhase2").hide();
$("#sectionPhase3").hide();

$("#btnVideoModal").on('click', () => { videoModal() })
$("#btnReadyModal").on('click', () => { readyModal() })
$("#btnInit1").on('click', () => { init(50) })
$("#sp2btnNo").on('click', () => { init() })
$("#sp2btnYes").on('click', () => { boardLiked() })


var selection = [
    "Cocktail Party", "Pink Noise", "Intention", "Space and time", "Bouncing",
    "Sonority", "Recording", "Tiring", "Soundscape", "Impatient",

    "Desensitize", "Conscious listening ", "Silence", "The mixer", "Savoring",
    "Mundane Sound", "Active", "Acronym", "RASA", "Spiritually",

    "Interruption", "Negotiation", "Distraction", "Boardroom Battle", "Conflict",
    "Naturally", "Influence", "Connect", "Get to Yes", "Focus",

    "Emotion", "Legal Dispute", "Elimination", "Freedom", "Businessman",
    "Settlement", "Experience", "Humbling", "Noise and Distraction ", "Listen to ourself",

    "Moment of quiet", "Fear and anxiety", "Mediation work", "Broken relationship", "Senseless war",
    "Listening Revolution", "Age of Listening", "Divorce", "Contagions", "Chain Reaction",
];
var userID = localStorage.getItem('userID');
var userName;
var docID;
var board = [];
var bingoCol = [];



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
        if (snap.empty) {
            $("#sectionPhase1").show()
            readyModal();
        } else {
            $("#sectionPhase3").show();
        }

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
                                            <a href="#" onclick="markAsNotTaken(this.id)" id="btnNumber${element.index}" class="btn btn-success">${element.number}</a>`);
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

function readyModal() {
    new Modal("Instruction", `
            <h3>Rule </h3>
            <p>Hi ${userName} , As you might using this software for first time. The rule shall be introduced</p>
            <ul>
                <li>Pay your attention to the video and listen carefully.</li>
                <li>Mark the word spoken/shown by presenter by clicking the word below</li>
                <li>This game will be a prove of attendance of yours </li>
                <li>Word listed in the table will not necessary speak by presenter</li>
                <li>Any 5 marked word that link together in the 5x5 table below count as 1 bingo (the more the better)</li>
                <li><b>IMPORTANT!</b> Enjoy yourself in this activity</li>
            </ul>
            `).show()
}

function videoModal() {
    new Modal("Video", `
    <div class="card">
    <a href="https://youtu.be/cSohjlYQI2A" target="_blank" title="open in new Window">
        <img src="https://i3.ytimg.com/vi/cSohjlYQI2A/hqdefault.jpg" class="card-img-top" alt="thumbnail">
    </a>
    <div class="card-body">
        <h5 class="card-title">5 ways to listen better | Julian Treasure</h5>
        <p class="card-text">7 minute 50 second</p>
        <a href="https://youtu.be/cSohjlYQI2A" class="btn btn-primary" target="_blank" title="open in new Window">Go Youtube</a>
    </div>
    </div>

    <div class="card">
    <a href="https://youtu.be/saXfavo1OQo" target="_blank" title="open in new Window">
        <img src="http://i3.ytimg.com/vi/saXfavo1OQo/hqdefault.jpg" class="card-img-top" alt="thumbnail">
    </a>
    <div class="card-body">
        <h5 class="card-title">The power of listening | William Ury | TEDxSanDiego
        </h5>
        <p class="card-text">15 minute 40 second</p>
        <a href="https://youtu.be/saXfavo1OQo" class="btn btn-primary" target="_blank" title="open in new Window">Go Youtube</a>
    </div>
    </div>
    
            `).show()
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
        readyNumber()
        for (let i = 0; i < 25; i++) {
            $(`#square${i}`).replaceWith(`<td id="square${i}"></td>`);
            $(`#square${i}`).append(`
                <a href="#" onclick="markAsTaken(this.id)" id="btnNumber${i}" class="btn btn-secondary" disabled>${selection[i]}</a>
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
            number: number,
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
            timestamp: new Date().getTime() - 120000
        })
        .then((response) => {
            $("#sectionPhase2").hide()
            $("#sectionPhase3").show()
            console.log(response)
        })
        .catch();

}

function markAsTaken(id) {
    var id = id.split("btnNumber")[1];
    if (board[id - 1].taken) return false;
    board[id - 1].taken = true;

    db
        .doc(`users/${userID}/board/${docID}`)
        .update({
            userID: userID,
            board: board,
            timestamp: new Date().getTime() - 60000
        })
        .then()
        .catch(error => {
            if (error.code == "permission-denied") {
                new Modal("Warnings!", `
            <h2 class='text-danger'>It has been marked as a spam </h2>
            <h3 class='text-danger'>Please do not spam the database! </h3>
            <p>You only can mark one bingo in every 1 minutes </p>
            `).show()
            }
        });
}

function markAsNotTaken(id) {
    var id = id.split("btnNumber")[1];
    if (board[id - 1].taken == false) return false;
    board[id - 1].taken = false;

    db
        .doc(`users/${userID}/board/${docID}`)
        .update({
            userID: userID,
            board: board,
            timestamp: new Date().getTime()
        })
        .then()
        .catch(error => {
            if (error.code == "permission-denied") {
                new Modal("Warnings!", `
            <h2 class='text-danger'>It has been marked as a spam </h2>
            <h3 class='text-danger'>Please do not spam the database! </h3>
            <p>You only can mark one bingo in every 5 minutes </p>
            `).show()
            }
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

    if (r1bingo) { tempBingoCol.push({ r1bingo: r1bingo, timestamp: new Date().getTime(), board: getTakenBoard("r1bingo") }) }
    if (r2bingo) { tempBingoCol.push({ r2bingo: r2bingo, timestamp: new Date().getTime(), board: getTakenBoard("r2bingo") }) }
    if (r3bingo) { tempBingoCol.push({ r3bingo: r3bingo, timestamp: new Date().getTime(), board: getTakenBoard("r3bingo") }) }
    if (r4bingo) { tempBingoCol.push({ r4bingo: r4bingo, timestamp: new Date().getTime(), board: getTakenBoard("r4bingo") }) }
    if (r5bingo) { tempBingoCol.push({ r5bingo: r5bingo, timestamp: new Date().getTime(), board: getTakenBoard("r5bingo") }) }
    if (c1bingo) { tempBingoCol.push({ c1bingo: c1bingo, timestamp: new Date().getTime(), board: getTakenBoard("c1bingo") }) }
    if (c2bingo) { tempBingoCol.push({ c2bingo: c2bingo, timestamp: new Date().getTime(), board: getTakenBoard("c2bingo") }) }
    if (c3bingo) { tempBingoCol.push({ c3bingo: c3bingo, timestamp: new Date().getTime(), board: getTakenBoard("c3bingo") }) }
    if (c4bingo) { tempBingoCol.push({ c4bingo: c4bingo, timestamp: new Date().getTime(), board: getTakenBoard("c4bingo") }) }
    if (c5bingo) { tempBingoCol.push({ c5bingo: c5bingo, timestamp: new Date().getTime(), board: getTakenBoard("c5bingo") }) }
    if (ob1bingo) { tempBingoCol.push({ ob1bingo: ob1bingo, timestamp: new Date().getTime(), board: getTakenBoard("ob1bingo") }) }
    if (ob2bingo) { tempBingoCol.push({ ob2bingo: ob2bingo, timestamp: new Date().getTime(), board: getTakenBoard("ob2bingo") }) }



    function getTakenBoard(q) {
        array = [];
        if (q == "r1bingo") {
            array.push(board[0].number);
            array.push(board[1].number);
            array.push(board[2].number);
            array.push(board[3].number);
            array.push(board[4].number);
        }
        if (q == "r2bingo") {
            array.push(board[5].number);
            array.push(board[6].number);
            array.push(board[7].number);
            array.push(board[8].number);
            array.push(board[9].number);
        }
        if (q == "r3bingo") {
            array.push(board[10].number);
            array.push(board[11].number);
            array.push(board[12].number);
            array.push(board[13].number);
        }
        if (q == "r4bingo") {
            array.push(board[14].number);
            array.push(board[15].number);
            array.push(board[16].number);
            array.push(board[17].number);
            array.push(board[18].number);
        }
        if (q == "r5bingo") {
            array.push(board[19].number);
            array.push(board[20].number);
            array.push(board[21].number);
            array.push(board[22].number);
            array.push(board[23].number);
        }
        if (q == "c1bingo") {
            array.push(board[0].number);
            array.push(board[5].number);
            array.push(board[10].number);
            array.push(board[14].number);
            array.push(board[19].number);
        }
        if (q == "c2bingo") {
            array.push(board[1].number);
            array.push(board[6].number);
            array.push(board[11].number);
            array.push(board[15].number);
            array.push(board[20].number);
        }
        if (q == "c3bingo") {
            array.push(board[2].number);
            array.push(board[7].number);
            array.push(board[16].number);
            array.push(board[21].number);
        }
        if (q == "c4bingo") {
            array.push(board[3].number);
            array.push(board[8].number);
            array.push(board[12].number);
            array.push(board[17].number);
            array.push(board[22].number);
        }
        if (q == "c5bingo") {
            array.push(board[4].number);
            array.push(board[9].number);
            array.push(board[13].number);
            array.push(board[18].number);
            array.push(board[23].number);
        }
        if (q == "ob1bingo") {
            array.push(board[0].number);
            array.push(board[6].number);
            array.push(board[17].number);
            array.push(board[23].number);
        }
        if (q == "ob2bingo") {
            array.push(board[4].number);
            array.push(board[8].number);
            array.push(board[15].number);
            array.push(board[19].number);

        }
        return array;
    }

    if (r1bingo || r2bingo || r3bingo || r4bingo || r5bingo || c1bingo || c2bingo || c3bingo || c4bingo || c5bingo || ob1bingo || ob2bingo) {
        if ((bingoCol == undefined) || (bingoCol.length !== tempBingoCol.length)) {
            db
                .doc(`users/${userID}`)
                .set({ bingoCollection: tempBingoCol, user: userName })
                .then(res => {
                    new Modal("Congrats !", `Congratulation ! You have ${tempBingoCol.length} of bingo ! 🔥🔥🔥🔥🔥`).show()
                })
                .catch({})
        }
    }
}