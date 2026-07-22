const worker = new Worker("./worker.js")

var startNumber = document.getElementById("start-number")
var endNumber = document.getElementById("end-number") // the names are weird because this used to only deal with numbers and i dont feel like changing them
var runButton = document.getElementById("run")
var explanation = document.getElementById("explanation")


/*runButton.onclick = (() => {
    var res = runOperations(+startNumber.value)
    var goal = +endNumber.value || 0
    if (res.length === 0) {
        explanation.innerText = "They are equal"
    } else {
        var reached = res[res.length - 1].number
        var text = res.map(r => r.asString).join("\n")
        if (reached !== goal) {
            text += `\n\n(closest reached: ${reached})`
        }
        explanation.innerText = text
    }
})*/
runButton.onclick = (() => {
    worker.postMessage({ type: 'run', start: startNumber.value, goal: endNumber.value })
    runButton.disabled = true
    startNumber.disabled = true
    endNumber.disabled = true
    runButton.innerText = "Running..."
})



worker.onmessage = (e) => {
    if (e.data.type === 'done') {
        var res = e.data.result
        var goal = endNumber.value || 0
        if (res.length === 0) {
            explanation.innerText = "They are equal"
        } else {
            var reached = res[res.length - 1].number
            var text = res.map(r => `<div class="step">${r.asString}</div>`).join("")
            explanation.innerHTML = text
        }
        runButton.disabled = false
        startNumber.disabled = false
        endNumber.disabled = false
        runButton.innerText = "Run Gematriarch"
    }
}