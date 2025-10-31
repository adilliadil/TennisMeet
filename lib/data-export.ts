/**
 * Data Export/Import Utilities
 * Tools for backing up and migrating user data
 */

import { Player } from '@/types/player';
import { Match } from '@/types/match';
import { Court } from '@/types/court';

export interface ExportData {
  version: string;
  exportDate: string;
  players: Player[];
  matches: Match[];
  courts: Court[];
  availability?: any;
}

// Export all data to JSON
export function exportDataToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

// Download JSON file
export function downloadJSON(data: ExportData, filename: string = 'tennismeet-backup'): void {
  const json = exportDataToJSON(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Export to CSV format
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  const headerRow = headers.map(h => h.label).join(',');
  const dataRows = data.map(item => {
    return headers
      .map(h => {
        const value = item[h.key];
        // Escape commas and quotes in CSV
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

// Download CSV file
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Export players to CSV
export function exportPlayersToCSV(players: Player[]): string {
  const headers = [
    { key: 'id' as keyof Player, label: 'ID' },
    { key: 'firstName' as keyof Player, label: 'First Name' },
    { key: 'lastName' as keyof Player, label: 'Last Name' },
    { key: 'email' as keyof Player, label: 'Email' },
    { key: 'phone' as keyof Player, label: 'Phone' },
    { key: 'location' as keyof Player, label: 'Location' },
    { key: 'ntrpRating' as keyof Player, label: 'NTRP Rating' },
    { key: 'playingStyle' as keyof Player, label: 'Playing Style' },
  ];

  return exportToCSV(players, headers);
}

// Export matches to CSV
export function exportMatchesToCSV(matches: Match[]): string {
  const headers = [
    { key: 'id' as keyof Match, label: 'ID' },
    { key: 'date' as keyof Match, label: 'Date' },
    { key: 'time' as keyof Match, label: 'Time' },
    { key: 'location' as keyof Match, label: 'Location' },
    { key: 'duration' as keyof Match, label: 'Duration (min)' },
    { key: 'status' as keyof Match, label: 'Status' },
  ];

  return exportToCSV(matches, headers);
}

// Export courts to CSV
export function exportCourtsToCSV(courts: Court[]): string {
  const headers = [
    { key: 'id' as keyof Court, label: 'ID' },
    { key: 'name' as keyof Court, label: 'Name' },
    { key: 'location' as keyof Court, label: 'Location' },
    { key: 'surfaceType' as keyof Court, label: 'Surface Type' },
    { key: 'rating' as keyof Court, label: 'Rating' },
  ];

  return exportToCSV(courts, headers);
}

// Import data from JSON
export function importDataFromJSON(jsonString: string): ExportData {
  try {
    const data = JSON.parse(jsonString);

    // Validate required fields
    if (!data.version || !data.exportDate) {
      throw new Error('Invalid export file format');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to parse import file. Please ensure it is a valid JSON file.');
  }
}

// Read file as text
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// Import from file
export async function importFromFile(file: File): Promise<ExportData> {
  if (!file.name.endsWith('.json')) {
    throw new Error('Please select a valid JSON backup file');
  }

  const text = await readFileAsText(file);
  return importDataFromJSON(text);
}

// Validate import data
export function validateImportData(data: ExportData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.version) {
    errors.push('Missing version information');
  }

  if (!data.exportDate) {
    errors.push('Missing export date');
  }

  if (!Array.isArray(data.players)) {
    errors.push('Invalid players data');
  }

  if (!Array.isArray(data.matches)) {
    errors.push('Invalid matches data');
  }

  if (!Array.isArray(data.courts)) {
    errors.push('Invalid courts data');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Merge import data with existing data
export function mergeImportData(
  existing: ExportData,
  imported: ExportData,
  strategy: 'replace' | 'merge' | 'skip-duplicates' = 'skip-duplicates'
): ExportData {
  const result: ExportData = {
    version: existing.version,
    exportDate: new Date().toISOString(),
    players: [...existing.players],
    matches: [...existing.matches],
    courts: [...existing.courts],
  };

  if (strategy === 'replace') {
    return {
      ...result,
      players: imported.players,
      matches: imported.matches,
      courts: imported.courts,
    };
  }

  if (strategy === 'merge') {
    result.players = [...existing.players, ...imported.players];
    result.matches = [...existing.matches, ...imported.matches];
    result.courts = [...existing.courts, ...imported.courts];
    return result;
  }

  // skip-duplicates strategy
  const existingPlayerIds = new Set(existing.players.map(p => p.id));
  const existingMatchIds = new Set(existing.matches.map(m => m.id));
  const existingCourtIds = new Set(existing.courts.map(c => c.id));

  result.players.push(
    ...imported.players.filter(p => !existingPlayerIds.has(p.id))
  );
  result.matches.push(
    ...imported.matches.filter(m => !existingMatchIds.has(m.id))
  );
  result.courts.push(
    ...imported.courts.filter(c => !existingCourtIds.has(c.id))
  );

  return result;
}

// Create backup of current state
export async function createBackup(
  players: Player[],
  matches: Match[],
  courts: Court[]
): Promise<ExportData> {
  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    players,
    matches,
    courts,
  };
}

// Auto-backup to localStorage
export function autoBackupToStorage(data: ExportData): void {
  try {
    const key = `tennismeet-backup-${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(key, JSON.stringify(data));

    // Keep only last 7 days of backups
    const allKeys = Object.keys(localStorage).filter(k =>
      k.startsWith('tennismeet-backup-')
    );

    if (allKeys.length > 7) {
      allKeys
        .sort()
        .slice(0, allKeys.length - 7)
        .forEach(k => localStorage.removeItem(k));
    }
  } catch (error) {
    console.error('Failed to create auto-backup:', error);
  }
}

// Restore from localStorage backup
export function restoreFromStorage(date?: string): ExportData | null {
  try {
    const key = date
      ? `tennismeet-backup-${date}`
      : Object.keys(localStorage)
          .filter(k => k.startsWith('tennismeet-backup-'))
          .sort()
          .reverse()[0];

    if (!key) {
      return null;
    }

    const data = localStorage.getItem(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return null;
  }
}

// List available backups
export function listAvailableBackups(): string[] {
  return Object.keys(localStorage)
    .filter(k => k.startsWith('tennismeet-backup-'))
    .map(k => k.replace('tennismeet-backup-', ''))
    .sort()
    .reverse();
}
