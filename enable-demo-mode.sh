#!/bin/bash

echo "Creating .env file for Demo Mode..."
echo ""

# Create .env file with demo mode configuration
cat > .env << EOF
# Demo/Test Mode Configuration
REACT_APP_DISABLE_SUPABASE=true
REACT_APP_DEMO_MODE=true
EOF

echo "Demo mode enabled successfully!"
echo ""
echo "Now you can run:"
echo "  npm start"
echo ""
echo "Then visit: http://localhost:3000/fitness"
echo ""
echo "Press Enter to continue..."
read 