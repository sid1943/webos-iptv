# Optimize — UX Scenario Draft

Purpose:
Provide a simple M3U playlist player for LG webOS TVs with user-provided playlists.

Test environment:
LG webOS TV, remote control, network connected.

Preconditions:
- TV has internet access.
- Tester has a valid M3U or M3U8 playlist URL.
- Optional: EPG URL if the playlist provides one.

Scenario 1: First launch with no playlists
Steps:
1. Launch Optimize from the home screen.
Expected results:
- App loads to the viewing screen.
- A message indicates no channels are available and suggests opening Settings.

Scenario 2: Add a playlist
Steps:
1. Press Blue to open Settings.
2. Choose Add Playlist.
3. Enter a playlist name and URL. Optionally add an EPG URL if available.
4. Close Settings.
Expected results:
- Channels are fetched and displayed.
- Channel list opens and allows selection.

Scenario 3: Play a channel and navigate
Steps:
1. Select a channel.
2. Use Up or Down to change channels.
3. Press Yellow to show channel info.
4. Press Red to toggle favorite.
5. Press Back to return to the previous channel or exit.
Expected results:
- Stream playback starts and changes when channels are selected.
- Info and favorites update correctly.

Scenario 4: EPG (if provided)
Steps:
1. Press Green to open the Programme Guide.
2. Navigate the grid and select a programme.
Expected results:
- EPG grid loads and a channel tunes when selected.
