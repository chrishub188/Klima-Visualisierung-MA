#!/bin/bash

pkill -9 "Google Chrome"

# First window
open -na "Google Chrome" --args --start-fullscreen --new-window --kiosk --incognito "http://localhost:5173/dashboard"

# Second window
open -na "Google Chrome" --args --start-fullscreen --new-window --kiosk --incognito "http://localhost:5173/map"

