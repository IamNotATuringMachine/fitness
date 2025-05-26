const fs = require('fs');
const path = require('path');

console.log('🧪 Testing version counter functionality...');

// Test the increment-version.js script
const versionPath = path.join(__dirname, 'public', 'version.json');

// Check if version file exists
if (fs.existsSync(versionPath)) {
  const currentData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  console.log('📄 Current version:', currentData.version);
} else {
  console.log('📄 No version file found, will be created');
}

// Run the increment script
console.log('🔄 Running increment-version.js...');
try {
  require('./increment-version.js');
  
  // Check the result
  if (fs.existsSync(versionPath)) {
    const newData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    console.log('✅ New version:', newData.version);
    console.log('🎉 Version counter test successful!');
  } else {
    console.log('❌ Version file was not created');
  }
} catch (error) {
  console.error('❌ Error testing version counter:', error.message);
} 