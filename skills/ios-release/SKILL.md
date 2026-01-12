---
name: ios-release
description: This skill should be used when the user asks to "release iOS app", "upload to App Store", "build for TestFlight", "archive the app", "submit to Apple", or wants to build and upload an iOS app to App Store Connect.
---

Build, archive, and upload an iOS app to App Store Connect.

## Workflow

1. **Detect project configuration** - Find .xcworkspace (preferred) or .xcodeproj
2. **Identify the scheme** - List schemes and pick the main app scheme
3. **Extract Team ID** - Get from project.pbxproj
4. **Check/create ExportOptions.plist** - Generate if missing
5. **Archive and export** - Build for release
6. **Upload or open Organizer** - Based on user preference

## Step 1: Detect Project

```bash
ls -la *.xcworkspace 2>/dev/null || ls -la *.xcodeproj 2>/dev/null
```

## Step 2: List Schemes

```bash
xcodebuild -workspace *.xcworkspace -list 2>/dev/null
# or
xcodebuild -project *.xcodeproj -list 2>/dev/null
```

## Step 3: Extract Team ID

```bash
grep -r "DEVELOPMENT_TEAM" *.xcodeproj/project.pbxproj | head -5
```

## Step 4: Create ExportOptions.plist

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
xcodebuild -workspace PROJECT.xcworkspace \
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

## Step 7: Upload

**Option A: Open Xcode Organizer (manual)**
```bash
open build/APP.xcarchive
```

**Option B: CLI upload**
```bash
xcrun altool --upload-app \
  -f build/export/APP.ipa \
  -t ios \
  --apiKey YOUR_API_KEY \
  --apiIssuer YOUR_ISSUER_ID
```

## User Prompts

Ask before starting:
1. "Should I upload directly to App Store Connect, or just open Xcode Organizer for manual upload?"
2. If multiple schemes found: "I found these schemes: [list]. Which one should I build?"
