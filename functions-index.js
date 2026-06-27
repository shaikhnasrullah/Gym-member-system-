const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// 🔽 Gmail / SMTP credentials (use Firebase config or environment variables — never hardcode in production)
// Run: firebase functions:config:set smtp.email="you@gmail.com" smtp.pass="your-app-password"
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().smtp.email,
    pass: functions.config().smtp.pass // Gmail App Password, not normal password
  }
});

const quotes = [
  "Every workout brings you closer to the best version of yourself. Keep going! 💪",
  "Discipline today, strength tomorrow. You've got this!",
  "Small daily progress leads to big results. Don't stop now!",
  "Your body achieves what your mind believes. Stay focused!",
  "Sweat now, shine later. One more rep, one more day!",
  "Consistency beats motivation. Show up today!",
  "The pain you feel today will be the strength you feel tomorrow.",
  "You didn't come this far to only come this far. Push on!"
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Runs every day at 7:00 AM (server time) — change schedule as needed
exports.sendDailyMotivation = functions.pubsub
  .schedule("every day 07:00")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const db = admin.firestore();
    const snapshot = await db.collection("customers").get();

    const sendPromises = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.email) return;

      const quote = getRandomQuote();

      const mailOptions = {
        from: '"FRALEN Gym" <no-reply@fralen.com>',
        to: data.email,
        subject: "Your Daily Motivation 💪",
        text: `Hi ${data.name},\n\n${quote}\n\nKeep showing up!\n\n- Team`,
        html: `<div style="font-family:Georgia,serif;background:#0c0d10;color:#f4efe4;padding:30px;border-radius:12px;">
                 <h2 style="color:#e8d2a0;">Hi ${data.name} 👋</h2>
                 <p style="font-size:16px;line-height:1.6;">${quote}</p>
                 <p style="color:#a9966b;font-size:12px;margin-top:24px;">Gym Code: ${data.gymCode || "-"}</p>
               </div>`
      };

      sendPromises.push(transporter.sendMail(mailOptions));
    });

    await Promise.all(sendPromises);
    console.log(`Sent motivational emails to ${sendPromises.length} customers.`);
    return null;
  });

