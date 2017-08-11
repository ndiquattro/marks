#!/bin/bash

# Build Clientside
echo "======================================================"
echo "Building Client Side"
echo "======================================================"
au build --env prod

# Deploy scripts
echo "======================================================"
echo "Deploying Scripts Folder"
echo "======================================================"
scp -r scripts nick@165.227.3.186:~/marks/client/deployed

# Deploy index.html
echo "======================================================"
echo "Deploying Index.html"
echo "======================================================"
scp index.html nick@165.227.3.186:~/marks/client/deployed

# Say Done
echo "======================================================"
echo "Done Deploying"
echo "======================================================"
