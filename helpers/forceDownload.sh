#!/bin/bash
# Use to fix long downloads during the build. Run it with: 'bash helpers/forceDownload.sh"
# Fill the big_modules directory with: cp node_modules/react-native-reanimated/android/build/downloads/*.tar.gz big_modules
cp big_modules/*.tar.gz node_modules/react-native-reanimated/android/build/downloads/
