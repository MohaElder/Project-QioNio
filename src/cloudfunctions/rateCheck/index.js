const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    db.collection('check').doc(event.checkID).update({
      data: {
        isRated: true,
      }
    });

    return await db.collection('order').doc(event.orderID).update({
      data: {
        rateNum: _.inc(1),
        goodRateNum: _.inc(event.goodNum)
      }
    });
  } catch (e) {
    console.error(e)
  }
}




