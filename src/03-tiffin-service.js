/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */

const mealTypes = ["veg", "nonveg", "jain"]

export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  // Your code here
  if(!mealTypes.includes(mealType) || !name) return null
  const rates = {
    "veg": 80,
    "nonveg": 120,
    "jain": 90
  }
  const dailyRate = rates[mealType]
  const totalCost = days*dailyRate

  const response = {
    name,
    mealType,
    days,
    dailyRate,
    totalCost
  }
  return response
}

export function combinePlans(...plans) {
  // Your code here
  if (plans.length === 0) return null
  let totalRevenue = 0
  let vegCount = 0
  let nonvegCount = 0
  let jainCount = 0
  const totalCustomers = plans.length
  plans.forEach((plan) => {
    totalRevenue += plan.totalCost
    if(plan.mealType === "veg") vegCount++
    if(plan.mealType === "nonveg") nonvegCount++
    if(plan.mealType === "jain") jainCount++
  })
  const response = {
    totalCustomers,
    totalRevenue,
    mealBreakdown: {
      veg: vegCount,
      nonveg: nonvegCount,
      jain: jainCount
    }
  }
  return response
}

export function applyAddons(plan, ...addons) {
  // Your code here
  if (!plan) return null
  let dailyrate = plan.dailyRate
  addons.forEach((addon) => {
    dailyrate += addon.price
  })
  const totalcost = dailyrate*plan.days
  const updated = {...plan, addonNames: addons.map(addon => addon.name), dailyRate: dailyrate, totalCost: totalcost}
  return updated
}
