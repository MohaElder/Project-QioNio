const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('order').doc(event.foodID).update({
      data: {
        stock:event.stock
      }
    })
  } catch (e) {
    console.error(e)
  }
}