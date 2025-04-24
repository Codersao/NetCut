const express = require('express');
const ytdlp = require('yt-dlp-exec'); // Using yt-dlp-exec to support Render 🌐
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Static files ki taraf rasta clear! 📂
app.use(express.static('public'));

// Video download route
app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    const quality = req.query.quality;

    // Agar URL nahi hai ya galat format mein hai, toh error bhej do 🤷‍♂️
    if (!videoURL || !videoURL.startsWith('http')) {
        return res.status(400).send('Invalid URL');
    }

    const formatMap = {
        "720p": "bestvideo[height<=720]+bestaudio/best",
        "1080p": "bestvideo[height<=1080]+bestaudio/best",
        "2160p": "bestvideo[height<=2160]+bestaudio/best",
        "4320p": "bestvideo[height<=4320]+bestaudio/best",
        "best": "bestvideo+bestaudio/best"
    };

    const format = formatMap[quality] || formatMap["best"];
    const filename = `video-${Date.now()}.mp4`;
    const filePath = path.join(__dirname, filename);

    // Wait message — romantic style 😍
    console.log(`💖 Downloading... ${videoURL}`);

    try {
        await ytdlp(videoURL, {
            output: filePath,
            format: format,
            mergeOutputFormat: 'mp4',
            verbose: true
        });

        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
            }

            // Delete after send — thoda temporary pyaar tha 🥹
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send(`Failed to download video. Error: ${error.message}`);
    }
});

// Server ko start karna — jaise first message send karna 💬
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
