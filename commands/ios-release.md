---
description: Build and upload iOS app to App Store Connect or TestFlight
allowed-tools: Bash, Read, Glob, Grep, Write, Edit
---

Build, archive, and upload an iOS app to App Store Connect.

## Instructions for Claude

Use extended thinking to work through this systematically. Before running any build commands:

1. **Detect project configuration** - Find .xcworkspace (preferred) or .xcodeproj
2. **Identify the scheme** - List schemes and pick the main app scheme
3. **Extract Team ID** - Get from project.pbxproj
4. **Check/create ExportOptions.plist** - Generate if missing
5. **Archive and export** - Build for release
6. **Upload or open Organizer** - Based on user preference

## Step 1: Detect Project

```bash
# Find workspace or project
ls -la *.xcworkspace 2>/dev/null || ls -la *.xcodeproj 2>/dev/null
```

If `.xcworkspace` exists, use `-workspace`. Otherwise use `-project`.

## Step 2: List Schemes

```bash
# For workspace:
xcodebuild -workspace *.xcworkspace -list 2>/dev/null

# For project:
xcodebuild -project *.xcodeproj -list 2>/dev/null
```

Look for the main app scheme (usually matches the project name, not "Tests" or "UITests").

If multiple non-test schemes exist, ask the user which one to build.

## Step 3: Extract Team ID

```bash
# Find DEVELOPMENT_TEAM in project settings
grep -r "DEVELOPMENT_TEAM" *.xcodeproj/project.pbxproj | head -5
```

Extract the 10-character Team ID (e.g., `ABC123DEF0`).

## Step 4: Create ExportOptions.plist

Check if `build/ExportOptions.plist` exists. If not, create it:

```bash
mkdir -p build
```

Then write this file (substitute detected TEAM_ID):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>teamID</key>
    <string>TEAM_ID_HERE</string>
    <key>uploadSymbols</key>
    <true/>
    <key>destination</key>
    <string>upload</string>
</dict>
</plist>
```

## Step 5: Archive

```bash
# Workspace example:
xcodebuild -workspace PROJECT.xcworkspace \
  -scheme SCHEME_NAME \
  -configuration Release \
  -archivePath build/APP.xcarchive \
  archive \
  -allowProvisioningUpdates \
  -quiet

# Project example:
xcodebuild -project PROJECT.xcodeproj \
  -scheme SCHEME_NAME \
  -configuration Release \
  -archivePath build/APP.xcarchive \
  archive \
  -allowProvisioningUpdates \
  -quiet
```

## Step 6: Export IPA

```bash
xcodebuild -exportArchive \
  -archivePath build/APP.xcarchive \
  -exportPath build/export \
  -exportOptionsPlist build/ExportOptions.plist \
  -allowProvisioningUpdates
```

## Step 7: Upload or Open

**Option A: Open Xcode Organizer (manual upload)**
```bash
open build/APP.xcarchive
```
Then: Distribute App -> App Store Connect -> Upload

**Option B: CLI upload with altool**
```bash
xcrun altool --upload-app \
  -f build/export/APP.ipa \
  -t ios \
  --apiKey YOUR_API_KEY \
  --apiIssuer YOUR_ISSUER_ID
```

## Common Errors

### "No signing certificate"
- Open Xcode -> Preferences -> Accounts -> Download Manual Profiles
- Or: `xcodebuild -downloadAllPlatforms`

### "Provisioning profile doesn't match"
- Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- Clean build: `xcodebuild clean`

### "Archive failed"
- Check scheme is set to Release: Product -> Scheme -> Edit Scheme
- Verify destination: `xcodebuild -showdestinations -scheme SCHEME`

### ITMS-90XXX errors
- Usually missing Info.plist keys (NSCameraUsageDescription, etc.)
- Check email from Apple for specific missing key

## User Prompts

Ask the user before starting:
1. "Should I upload directly to App Store Connect, or just open Xcode Organizer for manual upload?"
2. If multiple schemes found: "I found these schemes: [list]. Which one should I build?"
