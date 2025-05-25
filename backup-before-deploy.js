#!/usr/bin/env node

/**
 * Automatisches Backup-Script vor Deployments
 * 
 * Dieses Script:
 * 1. Öffnet die Live-App
 * 2. Erstellt automatisch ein Backup
 * 3. Speichert es lokal
 * 4. Warnt bei Problemen
 * 
 * Verwendung: node backup-before-deploy.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const LIVE_APP_URL = 'https://iamnotaturingmachine.github.io/fitness';
const BACKUP_DIR = './pre-deployment-backups';
const TIMEOUT = 30000; // 30 Sekunden

async function createBackup() {
    console.log('🚀 Starting automated backup before deployment...');
    
    // Backup-Verzeichnis erstellen
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
    }

    let browser;
    try {
        // Browser starten
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Zur Data Import/Export Seite navigieren
        console.log('📄 Navigating to app...');
        await page.goto(`${LIVE_APP_URL}/data-import-export`, {
            waitUntil: 'networkidle2',
            timeout: TIMEOUT
        });
        
        // Warten bis die Seite geladen ist
        await page.waitForSelector('button', { timeout: TIMEOUT });
        
        // Backup-Funktion über localStorage ausführen
        console.log('💾 Creating backup...');
        const backupData = await page.evaluate(() => {
            // Backup-Funktionen aus der App verwenden
            const createBackup = () => {
                try {
                    const workoutState = JSON.parse(localStorage.getItem('workoutState') || '{}');
                    const nutritionState = JSON.parse(localStorage.getItem('nutritionState') || '{}');
                    const gamificationState = JSON.parse(localStorage.getItem('gamificationState') || '{}');

                    return {
                        metadata: {
                            version: '1.0.0',
                            appVersion: '1.0.0',
                            createdAt: new Date().toISOString(),
                            createdBy: 'Automatisches Backup Script',
                            description: 'Automatisches Backup vor Deployment'
                        },
                        data: {
                            workout: workoutState,
                            nutrition: nutritionState,
                            gamification: gamificationState
                        }
                    };
                } catch (error) {
                    return { error: error.message };
                }
            };
            
            return createBackup();
        });
        
        if (backupData.error) {
            throw new Error(`Backup creation failed: ${backupData.error}`);
        }
        
        // Backup validieren
        const validation = validateBackup(backupData);
        if (!validation.isValid) {
            console.warn('⚠️ Backup validation warnings:');
            validation.issues.forEach(issue => console.warn(`   - ${issue}`));
        }
        
        // Backup-Datei speichern
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `pre-deployment-backup-${timestamp}.json`;
        const filepath = path.join(BACKUP_DIR, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
        
        // Statistiken anzeigen
        const stats = getBackupStats(backupData);
        console.log('✅ Backup created successfully!');
        console.log(`📁 File: ${filepath}`);
        console.log(`📊 Stats:`);
        console.log(`   - Workout Plans: ${stats.workout.plans}`);
        console.log(`   - Exercises: ${stats.workout.exercises}`);
        console.log(`   - Workout History: ${stats.workout.history}`);
        console.log(`   - File Size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
        
        // Cleanup alte Backups (behalte nur die letzten 10)
        cleanupOldBackups();
        
        return {
            success: true,
            filename,
            filepath,
            stats
        };
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        
        // Fallback: Manuelle Anweisungen ausgeben
        console.log('\n📝 Manual backup instructions:');
        console.log('1. Go to: https://iamnotaturingmachine.github.io/fitness/data-import-export');
        console.log('2. Click "Backup Herunterladen"');
        console.log('3. Save the file as: pre-deployment-backup-YYYY-MM-DD.json');
        console.log('4. Continue with deployment ONLY after backup is secured!');
        
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

function validateBackup(backup) {
    const issues = [];
    
    if (!backup || typeof backup !== 'object') {
        return { isValid: false, issues: ['Backup ist kein gültiges Objekt'] };
    }
    
    if (!backup.metadata) {
        issues.push('Backup-Metadaten fehlen');
    }
    
    if (!backup.data) {
        issues.push('Backup-Daten fehlen');
        return { isValid: false, issues };
    }
    
    if (backup.data.workout) {
        const workoutPlans = backup.data.workout.workoutPlans;
        if (!workoutPlans || !Array.isArray(workoutPlans) || workoutPlans.length === 0) {
            issues.push('Keine Trainingspläne gefunden - ist die App korrekt konfiguriert?');
        }
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

function getBackupStats(backup) {
    return {
        createdAt: backup.metadata?.createdAt,
        totalSize: JSON.stringify(backup).length,
        workout: {
            plans: backup.data?.workout?.workoutPlans?.length || 0,
            exercises: backup.data?.workout?.exercises?.length || 0,
            history: backup.data?.workout?.workoutHistory?.length || 0,
            measurements: backup.data?.workout?.bodyMeasurements?.length || 0
        },
        nutrition: {
            plans: backup.data?.nutrition?.nutritionPlans?.length || 0,
            foodItems: backup.data?.nutrition?.foodItems?.length || 0,
            dailyLogs: backup.data?.nutrition?.dailyLogs?.length || 0
        }
    };
}

function cleanupOldBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('pre-deployment-backup-') && file.endsWith('.json'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_DIR, file),
                mtime: fs.statSync(path.join(BACKUP_DIR, file)).mtime
            }))
            .sort((a, b) => b.mtime - a.mtime);
        
        // Behalte nur die letzten 10 Backups
        const filesToDelete = files.slice(10);
        
        filesToDelete.forEach(file => {
            fs.unlinkSync(file.path);
            console.log(`🗑️ Cleaned up old backup: ${file.name}`);
        });
        
        if (filesToDelete.length > 0) {
            console.log(`🧹 Cleaned up ${filesToDelete.length} old backup(s)`);
        }
    } catch (error) {
        console.warn('⚠️ Could not cleanup old backups:', error.message);
    }
}

// Main execution
async function main() {
    console.log('🛡️ Pre-Deployment Backup Script');
    console.log('===============================\n');
    
    try {
        const result = await createBackup();
        
        console.log('\n✅ BACKUP SUCCESSFUL - Safe to deploy!');
        console.log(`📁 Backup saved: ${result.filename}`);
        console.log('\n🚀 You can now proceed with deployment.');
        
        process.exit(0);
    } catch (error) {
        console.log('\n❌ BACKUP FAILED - DO NOT DEPLOY!');
        console.log('Please create a manual backup before proceeding.');
        console.log('See DEPLOYMENT_DATENSICHERHEIT.md for instructions.');
        
        process.exit(1);
    }
}

// Nur ausführen wenn direkt aufgerufen
if (require.main === module) {
    main();
}

module.exports = { createBackup, validateBackup, getBackupStats }; 