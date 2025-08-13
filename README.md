# Data-AIchemist 

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.3.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>Transform messy spreadsheets into clean, validated data with AI-powered assistance</h3>
  <p>Built for non-technical users who need to prepare resource allocation data without the complexity</p>
</div>

---

## 🎯 Overview

The **Data-AIchemist** is a web application that helps organizations transform chaotic spreadsheet data into clean, validated, and rule-based configurations ready for resource allocation systems. Using Google's Gemini AI, it provides an intuitive interface for data cleaning, validation, and business rule creation.

### 🌟 Key Features

- **AI-Powered Data Parsing** - Automatically handles misnamed columns and different formats
- **Natural Language Search** - Query your data using plain English
- **Smart Validation** - 12+ validation types with AI-enhanced error detection
- **Rule Builder** - Create business rules through UI or natural language
- **Priority Configuration** - Visual sliders to set allocation weights
- **Export Ready** - Download cleaned CSVs and rules.json in a ZIP file

##  Quick Start

### Prerequisites

- Node.js 18 or higher
- Google Gemini API key 

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SurajBisht105/Data-Alchemist.git
cd Data-Alchemist
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Format

The application expects three CSV/Excel files:

### clients.csv
```csv
ClientID,ClientName,PriorityLevel,RequestedTaskIDs,GroupTag,AttributesJSON
C001,Acme Corp,5,"T001,T002,T003",Enterprise,"{""industry"":""Technology""}"
C002,Beta Inc,3,"T004,T005",SMB,"{""industry"":""Retail""}"
```

### workers.csv
```csv
WorkerID,WorkerName,Skills,AvailableSlots,MaxLoadPerPhase,WorkerGroup,QualificationLevel
W001,John Smith,"JavaScript,React,Node.js","1,2,3,4,5",3,Development,4
W002,Jane Doe,"Python,Data Analysis","2,3,4",2,Data Science,5
```

### tasks.csv
```csv
TaskID,TaskName,Category,Duration,RequiredSkills,PreferredPhases,MaxConcurrent
T001,Frontend Dev,Development,2,"JavaScript,React",1-3,2
T002,API Integration,Backend,1,Node.js,"2,3,4",1
```

## 🎮 How to Use

### 1. Upload Data
- Drag and drop your CSV/Excel files
- Enable AI parsing for automatic column mapping
- Files are automatically categorized (clients, workers, tasks)

### 2. Review & Edit
- View data in an interactive grid
- Click any cell to edit inline
- Red highlights show validation errors
- Use natural language search: "Show all tasks requiring Python"

### 3. Fix Validation Errors
- View all errors in the validation panel
- Click "✨ Fix" for AI-powered corrections
- Errors are grouped by type with clear explanations

### 4. Create Business Rules
- Use templates or natural language
- Example: "Tasks T001 and T002 must run together"
- AI converts your intent to structured rules

### 5. Set Priorities
- Adjust sliders for different criteria
- Use presets like "Maximize Fulfillment" or "Fair Distribution"
- See real-time weight distribution

### 6. Export Results
- Click "Export All" to download:
  - Cleaned CSV files
  - rules.json with all configurations
  - README with instructions

##  AI Features

### Natural Language Processing
- **Search**: "Find workers available in phase 3 with Python skills"
- **Rules**: "Senior developers should handle maximum 3 projects"
- **Validation**: AI detects complex patterns and business logic issues

### Smart Corrections
- One-click fixes for common errors
- Context-aware suggestions
- Bulk apply corrections

### AI Assistant
- Chat interface for help
- Context-aware guidance
- Explains validation errors

##  Technical Stack

- **Frontend**: Next.js 14, TypeScript, React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Integration**: Google Gemini 2.0 Flash
- **Data Processing**: PapaParse (CSV), SheetJS (Excel)
- **Deployment**: Vercel

## 📁 Project Structure

```
Data-AIchemist/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   └── page.tsx      # Main page
│   ├── components/       # React components
│   │   ├── ai/           # AI-related components
│   │   ├── data-grid/    # Data visualization
│   │   ├── rules/        # Rule builder
│   │   └── validation/   # Validation UI
│   ├── lib/              # Core logic
│   │   ├── ai/           # AI integrations
│   │   ├── validators/   # Validation engine
│   │   └── export/       # Export functionality
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
├── public/               # Static assets
└── .env.local           # Environment variables
```

##  Validation Types

The app validates:
1. Missing required columns
2. Duplicate IDs
3. Malformed data formats
4. Out-of-range values
5. Invalid JSON
6. Unknown references
7. Circular dependencies
8. Resource conflicts
9. Overloaded workers
10. Phase saturation
11. Skill coverage
12. Concurrency limits
