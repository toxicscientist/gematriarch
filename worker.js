class OperatorResult {
    constructor(number, asString) {
        this.number = number
        this.asString = asString
    }
    distanceFrom(value) {
        return Math.abs(value - this.number)
    }
    makeTitle(){
        return this.asString.split(';')
    }
}

const operations = [
    (start) => { // multiply by arbitrary numbers
        results = []
        validMultiples = [2, 3, 5, 10, 666, -1]
        for (const m of validMultiples) {
            var result = (start * m)
            var obj = new OperatorResult(result, `${start}*${m}=${result}`)
            results.push(obj)
        }
        return results
    },
    (start) => { // divide by arbitrary numbers
        results = []
        validMultiples = [2, 3, 5, 10, 666, -1]
        for (const m of validMultiples) {
            if (start % m == 0) {
                var result = (start / m)
                var obj = new OperatorResult(result, `${start}/${m}=${result}`)
            } else {
                /* var result = Math.round(start / m)
                var obj = new OperatorResult(result, `${start}/${m}≈${result}`)  // rounded decimals result in an approximately equal symbol*/
                var obj = []
            }
            results.push(obj)
        }
        return results
    },
    (start) => { // add 1
        results = []
        if (start == 0) return []
        var result = start + 1
        var obj = new OperatorResult(result, `${start}+(${start}/${start})=${result}`)
        results.push(obj)
        return results
    },
    (start) => { // subtract 1
        results = []
        if (start == 0) return []
        var result = start - 1
        var obj = new OperatorResult(result, `${start}-(${start}/${start})=${result}`)
        results.push(obj)
        return results
    },
    (start) => { // reverse digits
        results = []
        var result = +(String(Math.abs(start)).split('').reverse().join(''))
        var obj = new OperatorResult(result, `${start}⟲${result}`)
        results.push(obj)
        return results
    },
    (start) => { // arithmetic using slices
        results = []
        var str = (String(start))
        for (let l = 1; l < str.split('').length; l++) {
            var sl = Number(str.slice(l))
            var result = start + sl
            var obj = new OperatorResult(result, `"${str.slice(l)}" from ${start}; ${start} + ${str.slice(l)} = ${result}`)
            results.push(obj)
            result = start - sl
            obj = new OperatorResult(result, `"${str.slice(l)}" from ${start}; ${start} - ${str.slice(l)} = ${result}`)
            results.push(obj)
            result = sl - start
            obj = new OperatorResult(result, `"${str.slice(l)}" from ${start}; ${str.slice(l)} - ${start} = ${result}`)
            results.push(obj)
        }
        return results
    },
    (start) => { // digital sum
        const str = String(Math.abs(start))
        if (str.length < 2) return []
        const sum = str.split('').reduce((a, d) => a + Number(d), 0)
        return [new OperatorResult(sum, `${start} digit sum = ${sum}`)]
    },
    (start) => { // exponentiation
        const results = []
        var validExponents = [2, 3, 5, 10]
        for (const m of validExponents) {
            const result = start ** m
            var obj = new OperatorResult(result, `${start}^${m}=${result}`)
            results.push(obj)
        }
        return results
    },
    (start) => { // roots
        if (start < 0) return []
        const results = []
        var validExponents = [2, 3, 5, 10]
        for (const m of validExponents) {
            const result = start ** Math.pow(m, -1) // to the power of the reciprocal of the exponent ie. the root
            var obj = new OperatorResult(result, `${m}√${start} = ${result}`)
            if (!Number.isInteger(result)) continue;
            results.push(obj)
        }
        return results
    },
    (start) => { // digit count
        var len = String(Math.abs(start)).length
        // if (len === Math.abs(start)) return []
        return [new OperatorResult(len, `${start} has ${len} digits`)]
    },
    (start) => { // digit multiplication
        var str = String(Math.abs(start))
        if (str.length < 2) return []
        var product = str.split('').reduce((a, d) => a * Number(d), 1)
        return [new OperatorResult(product, `digits of ${start} multiply to ${product}`)]
    },
    (start) => { // concatenate with self
        var result = +(`${start}${Math.abs(start)}`)
        return [new OperatorResult(result, `"${start}" + "${start}" = ${result}`)]
    },
    (start) => { // concatenate with digit sum
        var str = String(Math.abs(start))
        if (str.length < 2) return []
        var sum = str.split('').reduce((a, d) => a + Number(d), 0)
        var result = +(`${start}${sum}`)
        return [new OperatorResult(result, `"${start}" + "${sum}"(its digit sum) = ${result}`)]
    },
    (start) => { // concatenate with digit count
        var len = String(Math.abs(start)).length
        var result = +(`${start}${len}`)
        return [new OperatorResult(result, `"${start}"  +"${len}"(its digit count) = ${result}`)]
    },
    (start) => { // concatenate with reverse
        var rev = +(String(Math.abs(start)).split('').reverse().join(''))
        var result = +(`${start}${rev}`)
        return [new OperatorResult(result, `"${start}" + "${rev}"(its reverse) = ${result}`)]
    },
]

function runOperationsDFS(start = 1, end = 0, accumulated = [], runs = 0) { // depth first search version
    var goal = end || 0
    var initial = start
    var allResults = []
    for (o in operations) {
        allResults = [...allResults, ...operations[o](start)]
    }
    allResults.sort((a, b) => { return (a.distanceFrom(goal) - b.distanceFrom(goal)) })
    accumulated.push(allResults[0])
    runs += 1
    if (allResults[0].distanceFrom(goal) == 0 || runs > 64) {
        return accumulated
    } else {
        return runOperationsDFS(allResults[0].number, end, accumulated, runs)
    }
}

function runOperations(start, end = 0, sReason = "", eReason = "") {
    var goal = +end || 0
    const MAX_DEPTH = 64
    const MAX_NODES = 3e5
    const MAX_DIGITS = Math.max((String(start).length + 8), (String(end).length + 8))

    var sReasonO = new OperatorResult(start, sReason)
    var eReasonO = new OperatorResult(end, eReason)
    if (start === goal){
        var equalRes = new OperatorResult(end, "Already equal")
        return [sReasonO].concat([eReasonO]).concat([equalRes])
    }

    var visited = new Set([start])
    var queue = [{ value: start, path: [] }]
    var head = 0
    var nodesExplored = 0
    var best = { value: start, path: [], dist: Math.abs(goal - start) }

    while (head < queue.length) {
        var current = queue[head++]
        nodesExplored++
        if (nodesExplored > MAX_NODES) break
        if (current.path.length >= MAX_DEPTH) continue

        var candidates = []
        for (var o in operations) candidates = candidates.concat(operations[o](current.value))

        for (var i = 0; i < candidates.length; i++) {
            var cand = candidates[i]
            var v = cand.number
            if (!Number.isFinite(v)) continue // should catch infinity and nan
            if (String(Math.abs(v)).length > MAX_DIGITS) continue // getting too big
            if (visited.has(v)) continue // weve been at this number before

            var newPath = current.path.concat([cand])

            if (v === goal){
                return [sReasonO].concat([eReasonO]).concat(newPath) // concatenates the start and end reasons
            }

            visited.add(v)
            if (cand.distanceFrom(goal) < best.dist) best = { value: v, path: newPath, dist: cand.distanceFrom(goal) }
            queue.push({ value: v, path: newPath })
        }
    }

    return [sReasonO].concat([eReasonO]).concat(best.path) //  returns closest path found on fail concatenated with start and end reasons
}

function runAll(start, end = 0){
    var normalized = normalizeStrings(start, end)
    var nStart = normalized[0]
    var nEnd = normalized[1]
    var sReason = normalized[2]
    var eReason = normalized[3]

    var mainAttempt = runOperations(nStart, nEnd, sReason, eReason)
    if (mainAttempt[mainAttempt.length - 1].number == nEnd) return mainAttempt
    else {// the first attempt gets it close to success, DFS should pretty much always succeed
        var secondAttempt = runOperationsDFS(mainAttempt[mainAttempt.length - 1].number, end)
        return mainAttempt.concat(secondAttempt)
    }
}

function normalizeStrings(start, goal) {
    var startAsNum
    var goalAsNum
    var startReason = ""
    var goalReason = ""

    const normalizations = [
        (s) => ({ value: s.length, reason: `length of "${s}" is ${s.length}` }), //lemgth
        (s) => { // fuse digits in str
            var digits = s.match(/\d/g)
            if (digits == null) return { value: NaN, reason: "no" }
            var value = +(digits.join(''))
            return { value, reason: `fused characters of "${s}" into ${value}` }
        },
        (s) => { // first number in str
            var nums = s.match(/\d+/g)
            if (nums == null) return { value: NaN, reason: "no" }
            var value = +(nums[0])
            return { value, reason: `first number in "${s}" is ${value}` }
        },
        (s) => { // sum of alphabet positions
            var letters = s.match(/([A-Za-z])/g)
            if (letters == null) return { value: NaN, reason: "no" }
            var value = letters.reduce((a, v) => a + (v.toUpperCase().codePointAt() - 64), 0)
            return { value, reason: `sum of the positions in the alphabet of letters in "${s}" is ${value}` }
        },
        (s) => { // sum of alphabet positions of vowels
            var vowels = s.match(/([aeiouAEIOU])/g)
            if (vowels == null) return { value: NaN, reason: "no" }
            var value = vowels.reduce((a, v) => a + (v.toUpperCase().codePointAt() - 64), 0)
            return { value, reason: `sum of the positions in the alphabet of vowels in "${s}" is ${value}` }
        },
    ]

    if (start.length && +(start.match(/\d*/)) == +start) { // +"" is 0 so you gotta check the length too
        startAsNum = +start
        startReason = `${start} is already a number`
    }
    if (goal.length && +(goal.match(/\d*/)) == +goal) {
        goalAsNum = +goal
        goalReason = `${goal} is already a number`
    }
    if (Number.isFinite(startAsNum) && Number.isFinite(goalAsNum)) return [startAsNum, goalAsNum, startReason, goalReason]

    // if the start/goal AsNum are already numbers, give their value in the candidate var instead of an array
    var startCandidates = Number.isFinite(startAsNum) ? [{ value: startAsNum, reason: startReason }] : normalizations.map(fn => fn(start)).filter(c => Number.isFinite(c.value))
    var goalCandidates = Number.isFinite(goalAsNum) ? [{ value: goalAsNum, reason: goalReason }] : normalizations.map(fn => fn(goal)).filter(c => Number.isFinite(c.value))

    // silly(but cool) way of getting the closest options from the arrays
    var bestStart, bestGoal, bestDist = Infinity
    for (const sc of startCandidates) {
        for (const gc of goalCandidates) {
            var d = Math.abs(sc.value - gc.value)
            if (d < bestDist) { bestDist = d; bestStart = sc; bestGoal = gc }
        }
    }

    return [bestStart.value, bestGoal.value, bestStart.reason, bestGoal.reason]
}

onmessage = (e) => {
    if (e.data.type !== 'run') return
    var res = runAll(e.data.start, e.data.goal)
    postMessage({
        type: 'done',
        result: res
    })
}