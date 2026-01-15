---
description: Fill and sign PDF/Word documents with automatic e-signature placement
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

Fill out forms, complete templates, and add Jeremy's e-signature to documents.

## Quick Reference

**Scripts location**: `~/.claude/scripts/sign-document/`
**Signature assets**: `~/.claude/scripts/sign-document/assets/`

## Workflow Decision Tree

```
Input document?
├── PDF
│   ├── Has fillable fields? → Fillable PDF Workflow
│   └── No fillable fields? → Annotation-Based Workflow
└── Word (.docx) → Word Document Workflow

All workflows end with → Add Signature → Export as PDF
```

## Step 1: Detect Document Type

```bash
file "$DOCUMENT_PATH"
```

- **PDF document** → Continue to Step 2
- **Microsoft Word** → Skip to Word Document Workflow

## Step 2: Check for Fillable Fields (PDF only)

```bash
python ~/.claude/scripts/sign-document/check_fillable_fields.py "$INPUT_PDF"
```

**Output determines workflow:**
- "has fillable form fields" → Use Fillable PDF Workflow
- "does not have fillable form fields" → Use Annotation-Based Workflow

---

## Fillable PDF Workflow

### 2A. Extract Field Information

```bash
python ~/.claude/scripts/sign-document/extract_form_field_info.py "$INPUT_PDF" field_info.json
```

Creates JSON with all form fields, types, and valid values.

### 2B. Convert to Images (for visual reference)

```bash
mkdir -p form_images
python ~/.claude/scripts/sign-document/convert_pdf_to_images.py "$INPUT_PDF" form_images/
```

View images + field_info.json to understand what each field requires.

### 2C. Create Field Values

Create `field_values.json` mapping fields to user data:

```json
[
  {
    "field_id": "last_name",
    "description": "User's last name",
    "page": 1,
    "value": "Cai"
  },
  {
    "field_id": "agree_checkbox",
    "description": "Agreement checkbox",
    "page": 2,
    "value": "/On"
  }
]
```

**Value formats by field type:**
| Type | Format | Example |
|------|--------|---------|
| Text | String | `"Jeremy Cai"` |
| Checkbox | `checked_value` from field_info | `"/On"` or `"/Yes"` |
| Radio | Value from `radio_options` | `"/Option1"` |
| Dropdown | Value from `choice_options` | `"California"` |

### 2D. Fill the Form

```bash
python ~/.claude/scripts/sign-document/fill_fillable_fields.py "$INPUT_PDF" field_values.json filled.pdf
```

---

## Annotation-Based Workflow (Non-Fillable PDFs)

For scanned forms or static PDFs without interactive fields.

### 3A. Convert to Images

```bash
mkdir -p form_images
python ~/.claude/scripts/sign-document/convert_pdf_to_images.py "$INPUT_PDF" form_images/
```

### 3B. Analyze Form Layout

Examine each image and identify:
- Field labels ("Name:", "Date:", "Address:")
- Input areas (lines, boxes where text goes)
- Checkboxes (squares to mark)

### 3C. Create fields.json

```json
{
  "pages": [
    {
      "page_number": 1,
      "image_width": 2550,
      "image_height": 3300
    }
  ],
  "form_fields": [
    {
      "page_number": 1,
      "description": "User's full name",
      "field_label": "Name:",
      "label_bounding_box": [100, 200, 180, 230],
      "entry_bounding_box": [190, 200, 500, 230],
      "entry_text": {
        "text": "Jeremy Cai",
        "font_size": 14,
        "font_color": "000000"
      }
    }
  ]
}
```

**Bounding box format**: `[left, top, right, bottom]` in pixels

**Critical rules:**
- Label and entry boxes MUST NOT overlap
- Entry box should be large enough for text
- Get image dimensions from the PNG files

### 3D. Validate Bounding Boxes

```bash
# Automated check
python ~/.claude/scripts/sign-document/check_bounding_boxes.py fields.json

# Create visual validation
python ~/.claude/scripts/sign-document/create_validation_image.py 1 fields.json form_images/page_1.png validation_page_1.png
```

View validation image:
- **Red rectangles** = Entry areas (where text will appear)
- **Blue rectangles** = Labels (should cover label text only)

Fix any issues and regenerate until perfect.

### 3E. Fill the Form

```bash
python ~/.claude/scripts/sign-document/fill_pdf_form_with_annotations.py "$INPUT_PDF" fields.json filled.pdf
```

---

## Word Document Workflow

### For Templates with Placeholders

```python
from docx import Document

doc = Document('template.docx')

replacements = {
    '{{name}}': 'Jeremy Cai',
    '{{date}}': 'January 13, 2026',
    '{{address}}': '123 Main St, Park City, UT'
}

# Replace in paragraphs
for paragraph in doc.paragraphs:
    for key, value in replacements.items():
        if key in paragraph.text:
            for run in paragraph.runs:
                if key in run.text:
                    run.text = run.text.replace(key, value)

# Replace in tables
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                for key, value in replacements.items():
                    if key in paragraph.text:
                        for run in paragraph.runs:
                            if key in run.text:
                                run.text = run.text.replace(key, value)

doc.save('filled.docx')
```

---

## Final Step: Add Signature and Export PDF

**ALWAYS add signature as the final step.**

```bash
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.pdf output.pdf
```

### Signature Options

| Option | Default | Description |
|--------|---------|-------------|
| `--position` | `bottom-right` | `bottom-left`, `bottom-right`, `bottom-center` |
| `--margin` | `50` | Points from page edge |
| `--width` | `200` | Signature width in points |
| `--page` | `-1` (last) | Page to sign (0-indexed, -1=last) |
| `--no-signature` | false | Convert to PDF without signature |

### Common Signature Placements

```bash
# Default: bottom-right of last page
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.pdf output.pdf

# Signature block in contract (center)
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.pdf output.pdf --position bottom-center

# Sign first page
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.pdf output.pdf --page 0

# Larger signature
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.pdf output.pdf --width 250

# Just convert DOCX to PDF, no signature
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.docx output.pdf --no-signature
```

### Signature at Specific Coordinates

For placing signature on a signature line at specific location, modify the script call to use exact coordinates. First identify the signature line position from the form images, then use the annotation workflow to place the signature image at those coordinates.

---

## User Data Reference

When filling documents for Jeremy Cai:

**Personal**
- Full Name: Jeremy Cai
- DOB: April 21, 1995 (04/21/1995)
- Height: 182cm / 6'0"

**Contact Locations**
- Park City, UT
- Chicago, IL
- Los Angeles, CA

**Business**
- Occupation: Serial Entrepreneur & Angel Investor
- Companies: Fountain, Italic, Carbon (acquired by Perplexity), Blemish, Courtly

**Family**
- Spouse: Katherine (Kati) Holland Cai (b. Mar 23, 1994)
- Parents: Emily Chen (b. Apr 16, 1963), James Cai (b. Nov 10, 1963)
- Sister: Jillian Cai (b. Mar 7, 1998)

---

## Dependencies

Install if missing:
```bash
pip install pypdf reportlab pdf2image python-docx cairosvg pillow
brew install poppler  # Required for pdf2image on macOS
```

---

## Troubleshooting

### "No fillable fields" but form looks fillable
The PDF uses annotations/images, not actual form fields. Use annotation-based workflow.

### Checkbox won't check
Use exact `checked_value` from field_info.json (usually `"/On"` or `"/Yes"`).

### Text appears in wrong location
- Verify image dimensions match fields.json
- Check coordinate format: `[left, top, right, bottom]`
- Use validation images to verify placement

### Signature overlaps content
```bash
# Increase margin or reduce size
python ~/.claude/scripts/sign-document/add_signature_and_export.py filled.pdf output.pdf --margin 100 --width 150
```

### DOCX conversion fails
Install LibreOffice: `brew install --cask libreoffice`

---

## Interaction Guidelines

1. **Ask for the document** if not provided
2. **Confirm understanding** of what needs to be filled
3. **Ask about signature placement** if the document has a specific signature line
4. **Show the user** a summary of what will be filled before proceeding
5. **Provide the output path** when complete
