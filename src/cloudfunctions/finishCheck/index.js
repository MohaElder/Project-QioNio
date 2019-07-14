const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    db.collection('check').doc(event.checkID).update({
      data: {
        isFinished: true
      }
    });

    return await db.collection('user').doc(event.userID).update({
      data: {
        isOrdered: false
      }
    });
  } catch (e) {
    console.error(e)
  }
}




