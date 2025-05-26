const fs = require('fs');
const path = require('path');

const versionPath = path.join(__dirname, 'public', 'version.json');

function incrementVersion(versionString) {
  // Parse semantic version (e.g., "0.0.0.1" -> [0, 0, 0, 1])
  const parts = versionString.split('.').map(Number);
  
  // If invalid format, start from 0.0.0.1
  if (parts.length !== 4 || parts.some(isNaN)) {
    return '0.0.0.1';
  }
  
  // Increment patch version (last number)
  parts[3] += 1;
  
  // Handle overflow: if patch reaches 100, increment minor and reset patch
  if (parts[3] >= 100) {
    parts[3] = 0;
    parts[2] += 1;
    
    // If minor reaches 100, increment major and reset minor
    if (parts[2] >= 100) {
      parts[2] = 0;
      parts[1] += 1;
      
      // If major reaches 100, increment version and reset major
      if (parts[1] >= 100) {
        parts[1] = 0;
        parts[0] += 1;
      }
    }
  }
  
  return parts.join('.');
}

try {
  let version = '0.0.0.1';
  
  // Read current version if file exists
  if (fs.existsSync(versionPath)) {
    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    version = incrementVersion(versionData.version || '0.0.0.0');
  }
  
  // Write new version
  const newVersionData = { version };
  fs.writeFileSync(versionPath, JSON.stringify(newVersionData, null, 2));
  
  console.log(`✅ Version updated to v${version}`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
} 