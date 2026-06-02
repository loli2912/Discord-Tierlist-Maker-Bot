const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Validate token alone before fetching members
app.post('/api/test-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token is required' });

  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bot ${token}` }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return res.status(response.status).json({ error: data.message || 'Invalid token' });
  }
  res.json({ ok: true, username: data.username });
});

app.post('/api/members', async (req, res) => {
  const { token, guildId } = req.body;

  if (!token || !guildId) {
    return res.status(400).json({ error: 'token and guildId are required' });
  }

  try {
    let allMembers = [];
    let after = '0';

    // Paginate through all guild members (Discord returns max 1000 per request)
    while (true) {
      const url = `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000&after=${after}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bot ${token}` }
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: err.message || `Discord API error: ${response.status}`
        });
      }

      const batch = await response.json();
      if (!batch.length) break;

      allMembers = allMembers.concat(batch);
      if (batch.length < 1000) break;
      after = batch[batch.length - 1].user.id;
    }

    const members = allMembers
      .filter(m => !m.user.bot)
      .map(m => {
        const user = m.user;
        const displayName = m.nick || user.global_name || user.username;
        let avatarUrl;

        if (user.avatar) {
          const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
          avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
        } else {
          // New Discord default avatars (based on user ID)
          const index = Number(BigInt(user.id) >> 22n) % 6;
          avatarUrl = `https://cdn.discordapp.com/embed/avatars/${index}.png`;
        }

        return { id: user.id, username: user.username, displayName, avatarUrl };
      });

    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err.message);
    res.status(500).json({ error: 'Failed to fetch members from Discord' });
  }
});

app.listen(PORT, () => {
  console.log(`Tierlist server running at http://localhost:${PORT}`);
});
