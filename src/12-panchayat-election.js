/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here
  if(!Array.isArray(candidates)) return {}

  let registeredSet = {}
  let castedVotes = {}

  const registerVoter = (voter) => {
    if (!voter || !voter.id || !voter.name || !voter.age) return false
    if(voter.age < 18) return false

    if(registeredSet[voter.id]) return false
    
    registeredSet[voter.id] = voter
    return true
  }

  const castVote = (voterId, candidateId, onSuccess, onError) => {
    if(!registeredSet[voterId]) return onError("Voter not Registered")
    
    const candidateExists = candidates.some((candidate) => candidate.id === candidateId);
    if (!candidateExists) {
      return onError("Invalid CandidateId");
    }

    if(castedVotes[voterId]) return onError("Vote already registered")

    castedVotes[voterId] = {voterId, candidateId}
    return onSuccess({voterId, candidateId})
  }

  const getResults = (sortFn) => {
    const castedData = Object.values(castedVotes)
    const result = candidates.map((candidate)=>{
      const voteCount =  castedData.reduce((count, vote) => {
        return vote.candidateId === candidate.id ? count + 1 : count
      }, 0)
      return {...candidate, votes: voteCount}
    })

    if(sortFn) {
      return result.sort(sortFn)
    } else {
      return result.sort((a,b) => b.votes - a.votes)
    }
  }

  const getWinner = () => {
    const result = getResults()
    if(Object.keys(castedVotes).length === 0) return null
    return result[0]
  }

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner
  }
}

export function createVoteValidator(rules) {
  // Your code here
  return function (voter) {
    if(!voter) {
      return {
        valid: false,
        reason: "invalid voter"
      }
    }

    for(const rField of rules.requiredFields){
      if(voter[rField] === undefined) return {valid: false, reason: "Required Fields are missing"} 
    }

    if(voter.age < rules.minAge) return {valid: false, reason: `${rules.minAge} is required`}

    return {
      valid: true,
      reason: "All validation passed"
    }
  }
}

export function countVotesInRegions(regionTree) {
  // Your code here
  if(!regionTree) return 0

  let totalVotes = regionTree.votes
  
  if(regionTree.subRegions && Array.isArray(regionTree.subRegions)){
    for (const subRegion of regionTree.subRegions){
      totalVotes += countVotesInRegions(subRegion)
    }
  }
  return totalVotes
}

export function tallyPure(currentTally, candidateId) {
  // Your code here
  return { 
    ...currentTally, 
    [candidateId]: (currentTally[candidateId] || 0) + 1 
  };

}
